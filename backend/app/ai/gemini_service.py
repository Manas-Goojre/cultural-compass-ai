import json
import logging
import time
from typing import Any

import httpx
import vertexai
from vertexai.generative_models import GenerativeModel

from app.config import Settings, get_settings
from app.core.errors import GeminiError
from app.core.observability import track_ai_call

logger = logging.getLogger(__name__)


class GeminiService:
    def __init__(self, settings: Settings | None = None):
        self.settings = settings or get_settings()
        self._vertex_model: GenerativeModel | None = None

    def _get_vertex_model(self) -> GenerativeModel | None:
        if self._vertex_model is not None:
            return self._vertex_model
        project = self.settings.google_cloud_project
        if not project:
            return None
        try:
            vertexai.init(project=project, location=self.settings.google_cloud_region)
            self._vertex_model = GenerativeModel(self.settings.gemini_model)
            return self._vertex_model
        except Exception as exc:
            logger.warning("Vertex AI init failed: %s", exc)
            return None

    def _call_studio_api(self, system: str, user: str) -> str:
        api_key = self.settings.gemini_api_key
        if not api_key:
            raise GeminiError("GEMINI_API_KEY is not configured", status_code=503)

        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{self.settings.gemini_model}:generateContent?key={api_key}"
        )
        payload = {
            "systemInstruction": {"parts": [{"text": system}]},
            "contents": [{"role": "user", "parts": [{"text": user}]}],
            "generationConfig": {
                "responseMimeType": "application/json",
                "temperature": 0.7,
            },
        }
        with httpx.Client(timeout=self.settings.gemini_timeout_seconds) as client:
            response = client.post(url, json=payload)
            if response.status_code == 429:
                raise GeminiError("Gemini quota exceeded. Please retry shortly.", status_code=429)
            if response.status_code >= 400:
                raise GeminiError(f"Gemini API error: {response.text}", status_code=502)
            data = response.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]

    def _call_vertex(self, system: str, user: str) -> str:
        model = self._get_vertex_model()
        if model is None:
            raise GeminiError("Vertex AI is not configured", status_code=503)
        response = model.generate_content(
            [system, user],
            generation_config={"response_mime_type": "application/json", "temperature": 0.7},
        )
        return response.text

    def generate_structured(self, *, operation: str, system: str, user: str) -> tuple[dict[str, Any], float]:
        prompt_chars = len(system) + len(user)
        last_error: Exception | None = None

        with track_ai_call(operation, self.settings.gemini_model, prompt_chars) as metrics:
            for attempt in range(self.settings.gemini_max_retries + 1):
                try:
                    raw = self._call_studio_api(system, user)
                    metrics.response_chars = len(raw)
                    parsed = json.loads(raw)
                    latency_ms = metrics.latency_ms
                    return parsed, latency_ms
                except GeminiError as exc:
                    if exc.status_code == 429:
                        raise
                    last_error = exc
                    logger.warning("Studio API attempt %s failed: %s", attempt + 1, exc.message)
                except Exception as exc:
                    last_error = exc
                    logger.warning("Studio API attempt %s failed: %s", attempt + 1, exc)

                if attempt < self.settings.gemini_max_retries:
                    time.sleep(0.5 * (attempt + 1))

            try:
                raw = self._call_vertex(system, user)
                metrics.response_chars = len(raw)
                parsed = json.loads(raw)
                latency_ms = metrics.latency_ms
                return parsed, latency_ms
            except Exception as exc:
                last_error = exc
                logger.error("All Gemini paths failed: %s", exc)

        raise GeminiError(
            f"Unable to generate AI response: {last_error}",
            status_code=503,
        )

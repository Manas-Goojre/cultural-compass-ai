import json
import logging
import re
from typing import Any

logger = logging.getLogger(__name__)


class ResponseValidator:
    def parse_json_response(self, raw: str) -> dict[str, Any]:
        text = (raw or "").strip()
        if text.startswith("```"):
            text = re.sub(r"^```(?:json)?\s*", "", text)
            text = re.sub(r"\s*```$", "", text)
        try:
            data = json.loads(text)
        except json.JSONDecodeError as exc:
            logger.warning("Failed to parse JSON response: %s", exc)
            raise ValueError("AI returned malformed JSON") from exc
        if not isinstance(data, dict):
            raise ValueError("AI response must be a JSON object")
        return data

    def ensure_fields(self, data: dict[str, Any], required: list[str]) -> dict[str, Any]:
        missing = [field for field in required if field not in data]
        if missing:
            raise ValueError(f"AI response missing fields: {', '.join(missing)}")
        return data

    def attach_metadata(self, data: dict[str, Any], *, model: str, latency_ms: float) -> dict[str, Any]:
        data.setdefault("meta", {})
        data["meta"].update({"model": model, "latency_ms": latency_ms})
        return data

import json
import logging
from pathlib import Path
from typing import Any

import yaml

logger = logging.getLogger(__name__)

PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"


class PromptLoader:
    def __init__(self, prompts_dir: Path | None = None):
        self.prompts_dir = prompts_dir or PROMPTS_DIR
        self._cache: dict[str, dict[str, Any]] = {}

    def load(self, relative_path: str) -> dict[str, Any]:
        if relative_path in self._cache:
            return self._cache[relative_path]
        path = self.prompts_dir / relative_path
        if not path.exists():
            raise FileNotFoundError(f"Prompt template not found: {relative_path}")
        with path.open(encoding="utf-8") as f:
            data = yaml.safe_load(f)
        self._cache[relative_path] = data
        return data

    def render(self, relative_path: str, variables: dict[str, Any]) -> str:
        template = self.load(relative_path)
        system = template.get("system", "")
        user = template.get("user", "")
        output_schema = template.get("output_schema", {})
        rendered_user = user.format(**variables)
        payload = {
            "system": system,
            "user": rendered_user,
            "output_schema": output_schema,
        }
        return json.dumps(payload, ensure_ascii=False)

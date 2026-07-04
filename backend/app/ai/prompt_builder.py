import json
from typing import Any

from app.core.security import detect_prompt_injection, sanitize_user_text
from app.models.travel import TravelProfile


class PromptBuilder:
    def build_profile_context(self, profile: TravelProfile) -> dict[str, Any]:
        return {
            "interests": ", ".join(profile.interests) or "general exploration",
            "travel_style": profile.travel_style,
            "budget_range": profile.budget_range,
            "duration_days": profile.duration_days,
            "origin_location": profile.origin_location or "not specified",
            "preferred_regions": ", ".join(profile.preferred_regions) or "open to suggestions worldwide",
            "travel_dates": profile.travel_dates or "flexible dates",
            "dietary_preferences": ", ".join(profile.dietary_preferences) or "none specified",
            "accessibility_needs": ", ".join(profile.accessibility_needs) or "none specified",
            "language": profile.language,
            "currency": profile.currency,
        }

    def build_safety_preamble(self) -> str:
        return (
            "Safety rules: refuse harmful requests; do not invent verified events or prices; "
            "mark uncertain facts explicitly; never present guesses as verified facts."
        )

    def build_refinement_context(self, prior_summary: str, refinement: str) -> dict[str, str]:
        safe_refinement = sanitize_user_text(refinement)
        if detect_prompt_injection(safe_refinement):
            safe_refinement = "Please adjust the recommendations within normal travel planning scope."
        return {
            "prior_summary": sanitize_user_text(prior_summary, max_length=6000),
            "refinement_request": safe_refinement,
        }

    def compose_messages(self, prompt_payload_json: str) -> tuple[str, str]:
        payload = json.loads(prompt_payload_json)
        system = payload["system"] + "\n\n" + self.build_safety_preamble()
        user = payload["user"]
        schema = payload.get("output_schema")
        if schema:
            user += "\n\nRespond ONLY with valid JSON matching this schema:\n" + json.dumps(schema, indent=2)
        return system, user

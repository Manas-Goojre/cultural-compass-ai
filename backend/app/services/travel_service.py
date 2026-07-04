from typing import Any

from app.ai.gemini_service import GeminiService
from app.ai.prompt_builder import PromptBuilder
from app.ai.prompt_loader import PromptLoader
from app.ai.response_validator import ResponseValidator
from app.core.errors import GeminiError, ValidationError
from app.models.travel import RefineRequest, TravelProfile, TripPlanRequest


class TravelService:
    PROMPT_MAP = {
        "discover": "travel/destination_discover.yaml",
        "culture": "travel/culture.yaml",
        "hidden_gems": "travel/hidden_gems.yaml",
        "food": "travel/food.yaml",
        "festivals": "travel/festivals.yaml",
        "experiences": "travel/experiences.yaml",
        "itinerary": "travel/itinerary.yaml",
        "story": "travel/storytelling.yaml",
        "refine": "travel/refine.yaml",
        "trip_plan": "travel/trip_planner.yaml",
    }

    REQUIRED_FIELDS = {
        "discover": ["summary", "destinations"],
        "culture": ["destination", "cultural_overview"],
        "hidden_gems": ["destination", "hidden_gems"],
        "food": ["destination", "food_overview", "must_try_dishes"],
        "festivals": ["destination", "events"],
        "experiences": ["destination", "experiences"],
        "itinerary": ["destination", "trip_title", "days"],
        "story": ["destination", "title", "story"],
        "refine": ["refined_summary", "updated_recommendations"],
        "trip_plan": ["itinerary", "budget"],
    }

    def __init__(self):
        self.loader = PromptLoader()
        self.builder = PromptBuilder()
        self.gemini = GeminiService()
        self.validator = ResponseValidator()

    def _run(self, operation: str, variables: dict[str, Any]) -> dict[str, Any]:
        prompt_path = self.PROMPT_MAP[operation]
        payload_json = self.loader.render(prompt_path, variables)
        system, user = self.builder.compose_messages(payload_json)
        try:
            data, latency_ms = self.gemini.generate_structured(operation=operation, system=system, user=user)
        except GeminiError:
            raise
        except Exception as exc:
            raise GeminiError(str(exc)) from exc

        try:
            data = self.validator.ensure_fields(data, self.REQUIRED_FIELDS[operation])
        except ValueError as exc:
            raise ValidationError(str(exc)) from exc

        return self.validator.attach_metadata(data, model=self.gemini.settings.gemini_model, latency_ms=latency_ms)

    def discover_destinations(self, profile: TravelProfile) -> dict[str, Any]:
        variables = self.builder.build_profile_context(profile)
        return self._run("discover", variables)

    def cultural_insights(self, profile: TravelProfile, destination: str) -> dict[str, Any]:
        variables = self.builder.build_profile_context(profile)
        variables["destination"] = destination
        return self._run("culture", variables)

    def hidden_gems(self, profile: TravelProfile, destination: str) -> dict[str, Any]:
        variables = self.builder.build_profile_context(profile)
        variables["destination"] = destination
        return self._run("hidden_gems", variables)

    def food_recommendations(self, profile: TravelProfile, destination: str) -> dict[str, Any]:
        variables = self.builder.build_profile_context(profile)
        variables["destination"] = destination
        return self._run("food", variables)

    def festival_suggestions(self, profile: TravelProfile, destination: str) -> dict[str, Any]:
        variables = self.builder.build_profile_context(profile)
        variables["destination"] = destination
        return self._run("festivals", variables)

    def experience_recommendations(self, profile: TravelProfile, destination: str) -> dict[str, Any]:
        variables = self.builder.build_profile_context(profile)
        variables["destination"] = destination
        return self._run("experiences", variables)

    def generate_itinerary(self, profile: TravelProfile, destination: str) -> dict[str, Any]:
        variables = self.builder.build_profile_context(profile)
        variables["destination"] = destination
        return self._run("itinerary", variables)

    def generate_story(self, profile: TravelProfile, destination: str, theme: str | None) -> dict[str, Any]:
        variables = self.builder.build_profile_context(profile)
        variables["destination"] = destination
        variables["theme"] = theme or "cultural immersion"
        return self._run("story", variables)

    def refine_recommendations(self, request: RefineRequest) -> dict[str, Any]:
        variables = self.builder.build_profile_context(request.profile)
        variables.update(self.builder.build_refinement_context(request.prior_summary, request.refinement_request))
        return self._run("refine", variables)

    def plan_trip(self, request: TripPlanRequest) -> dict[str, Any]:
        variables = {
            "destination": request.destination or "recommend the best fit for this profile",
            "budget": request.budget or "flexible",
            "days": request.days,
            "travelers": request.travelers,
            "travel_style": request.travel_style,
            "interests": ", ".join(request.interests) or "general exploration",
            "transport": request.transport or "any suitable option",
            "hotel_preference": request.hotel_preference or "no preference",
            "start_date": request.start_date or "flexible",
            "currency": request.currency,
            "language": request.language,
        }
        return self._run("trip_plan", variables)

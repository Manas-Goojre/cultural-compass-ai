import pytest

from app.core.errors import ValidationError
from app.models.travel import TripPlanRequest
from app.services.travel_service import TravelService


def test_plan_trip_returns_validated_data(monkeypatch, valid_trip):
    service = TravelService()

    def fake_generate_structured(*, operation, system, user):
        assert operation == "trip_plan"
        return valid_trip, 20.0

    monkeypatch.setattr(service.gemini, "generate_structured", fake_generate_structured)

    result = service.plan_trip(TripPlanRequest(destination="Kyoto", days=1))
    assert "itinerary" in result
    assert "budget" in result
    assert result["meta"]["latency_ms"] == 20.0


def test_plan_trip_raises_when_required_missing(monkeypatch):
    service = TravelService()

    def fake_generate_structured(*, operation, system, user):
        return {"summary": "no itinerary here"}, 5.0

    monkeypatch.setattr(service.gemini, "generate_structured", fake_generate_structured)

    with pytest.raises(ValidationError):
        service.plan_trip(TripPlanRequest(destination="Kyoto"))

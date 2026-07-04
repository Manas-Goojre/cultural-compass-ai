import os

# Configure a deterministic test environment before any app module is imported.
os.environ.setdefault("AUTH_REQUIRED", "false")
os.environ.setdefault("GEMINI_API_KEY", "test-key")
os.environ.setdefault("APP_ENV", "test")

import pytest
from fastapi.testclient import TestClient


VALID_TRIP = {
    "destination": "Kyoto, Japan",
    "summary": "A cultural food journey through Kyoto.",
    "itinerary": [
        {
            "day": 1,
            "title": "Old town temples",
            "morning": {"activity": "Kinkaku-ji", "location": "Kinkaku-ji", "lat": 35.0394, "lng": 135.7292},
            "afternoon": {"activity": "Nishiki Market", "location": "Nishiki", "lat": 35.005, "lng": 135.764},
            "estimated_cost": "$80",
        }
    ],
    "budget": {"accommodation": "$120", "food": "$60", "transport": "$30", "total": "$210", "currency": "USD"},
    "hotels": [],
    "restaurants": [],
    "hidden_gems": [],
    "travel_tips": ["Carry cash"],
    "packing_list": ["Comfortable shoes"],
    "safety_tips": ["Watch belongings"],
    "map_points": [{"name": "Kinkaku-ji", "type": "stop", "lat": 35.0394, "lng": 135.7292, "day": 1}],
    "confidence": "medium",
    "uncertainty_notes": ["Coordinates are approximate."],
}


@pytest.fixture
def valid_trip():
    # Return a fresh copy so tests can mutate without cross-contamination.
    import copy

    return copy.deepcopy(VALID_TRIP)


@pytest.fixture
def client(monkeypatch, valid_trip):
    from app.api.routes import travel
    from app.main import app

    def fake_generate_structured(*, operation, system, user):
        return valid_trip, 12.5

    monkeypatch.setattr(travel.travel_service.gemini, "generate_structured", fake_generate_structured)
    return TestClient(app)

import json

import pytest

from app.ai.prompt_loader import PromptLoader


@pytest.fixture
def loader():
    return PromptLoader()


def test_renders_trip_planner_with_variables(loader):
    variables = {
        "destination": "Kyoto",
        "budget": "2000",
        "days": 3,
        "travelers": 2,
        "travel_style": "food",
        "interests": "Food, Temples",
        "transport": "Train",
        "hotel_preference": "Mid-range",
        "start_date": "flexible",
        "currency": "USD",
        "language": "en",
    }
    payload = json.loads(loader.render("travel/trip_planner.yaml", variables))
    assert "Kyoto" in payload["user"]
    assert payload["output_schema"]  # schema braces must not break rendering
    assert "system" in payload


def test_missing_template_raises(loader):
    with pytest.raises(FileNotFoundError):
        loader.render("travel/does_not_exist.yaml", {})


def test_caches_loaded_template(loader):
    first = loader.load("travel/trip_planner.yaml")
    second = loader.load("travel/trip_planner.yaml")
    assert first is second

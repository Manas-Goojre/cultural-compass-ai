import pytest
from pydantic import ValidationError

from app.models.travel import TripPlanRequest


def test_defaults():
    req = TripPlanRequest()
    assert req.days == 3
    assert req.travelers == 1
    assert req.travel_style == "solo"
    assert req.interests == []
    assert req.currency == "USD"


def test_accepts_full_payload():
    req = TripPlanRequest(
        destination="Kyoto",
        budget="2000",
        days=5,
        travelers=2,
        travel_style="food",
        interests=["Food", "Temples"],
        transport="Train",
        hotel_preference="Mid-range",
        start_date="2026-09-01",
    )
    assert req.days == 5
    assert req.interests == ["Food", "Temples"]


@pytest.mark.parametrize("days", [0, 31, -1])
def test_rejects_out_of_range_days(days):
    with pytest.raises(ValidationError):
        TripPlanRequest(days=days)


@pytest.mark.parametrize("travelers", [0, 31])
def test_rejects_out_of_range_travelers(travelers):
    with pytest.raises(ValidationError):
        TripPlanRequest(travelers=travelers)

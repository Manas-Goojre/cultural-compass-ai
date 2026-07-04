from typing import Literal

from pydantic import BaseModel, Field


class TravelProfile(BaseModel):
    interests: list[str] = Field(default_factory=list)
    travel_style: Literal["solo", "family", "adventure", "spiritual", "heritage"] = "solo"
    budget_range: Literal["budget", "mid", "luxury"] = "mid"
    duration_days: int = Field(default=5, ge=1, le=30)
    origin_location: str | None = None
    preferred_regions: list[str] = Field(default_factory=list)
    travel_dates: str | None = None
    dietary_preferences: list[str] = Field(default_factory=list)
    accessibility_needs: list[str] = Field(default_factory=list)
    language: str = "en"
    currency: str = "USD"


class DestinationDiscoverRequest(BaseModel):
    profile: TravelProfile


class DestinationFocusRequest(BaseModel):
    profile: TravelProfile
    destination: str


class ItineraryRequest(BaseModel):
    profile: TravelProfile
    destination: str


class StoryRequest(BaseModel):
    profile: TravelProfile
    destination: str
    theme: str | None = None


class RefineRequest(BaseModel):
    profile: TravelProfile
    prior_summary: str
    refinement_request: str

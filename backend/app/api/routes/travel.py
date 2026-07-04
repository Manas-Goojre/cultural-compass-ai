from fastapi import APIRouter, Depends, HTTPException

from app.core.errors import AppError, GeminiError, ValidationError
from app.models.auth import UserInfo
from app.models.travel import (
    DestinationDiscoverRequest,
    DestinationFocusRequest,
    ItineraryRequest,
    RefineRequest,
    StoryRequest,
)
from app.api.dependencies import get_current_user
from app.services.travel_service import TravelService

router = APIRouter(prefix="/api/travel", tags=["travel"])
travel_service = TravelService()


def _handle_errors(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ValidationError as exc:
            raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc
        except GeminiError as exc:
            raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc
        except AppError as exc:
            raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc

    return wrapper


@router.post("/destinations/discover")
def discover_destinations(body: DestinationDiscoverRequest, user: UserInfo = Depends(get_current_user)):
    return travel_service.discover_destinations(body.profile)


@router.post("/culture/insights")
def cultural_insights(body: DestinationFocusRequest, user: UserInfo = Depends(get_current_user)):
    return travel_service.cultural_insights(body.profile, body.destination)


@router.post("/destinations/hidden-gems")
def hidden_gems(body: DestinationFocusRequest, user: UserInfo = Depends(get_current_user)):
    return travel_service.hidden_gems(body.profile, body.destination)


@router.post("/food/recommend")
def food_recommend(body: DestinationFocusRequest, user: UserInfo = Depends(get_current_user)):
    return travel_service.food_recommendations(body.profile, body.destination)


@router.post("/festivals/suggest")
def festivals(body: DestinationFocusRequest, user: UserInfo = Depends(get_current_user)):
    return travel_service.festival_suggestions(body.profile, body.destination)


@router.post("/experiences/recommend")
def experiences(body: DestinationFocusRequest, user: UserInfo = Depends(get_current_user)):
    return travel_service.experience_recommendations(body.profile, body.destination)


@router.post("/itinerary/generate")
def itinerary(body: ItineraryRequest, user: UserInfo = Depends(get_current_user)):
    return travel_service.generate_itinerary(body.profile, body.destination)


@router.post("/story/generate")
def story(body: StoryRequest, user: UserInfo = Depends(get_current_user)):
    return travel_service.generate_story(body.profile, body.destination, body.theme)


@router.post("/refine")
def refine(body: RefineRequest, user: UserInfo = Depends(get_current_user)):
    return travel_service.refine_recommendations(body)

from fastapi import APIRouter, Query
from app.core.lunar import get_lunar_phase
from app.core.wisdom import get_daily_wisdom

router = APIRouter()

@router.get("/daily_rhythm")
async def daily_rhythm(
    city: str = Query("Santiago", description="Nombre de la ciudad")
):
    lunar = get_lunar_phase(city)
    wisdom = get_daily_wisdom()
    return {"moon": lunar, "wisdom": wisdom}

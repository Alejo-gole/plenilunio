from fastapi import APIRouter
from app.core.lunar import get_lunar_phase
from app.core.wisdom import get_daily_wisdom

router = APIRouter()

@router.get("/daily_rhythm")
async def daily_rhythm(
):

    lunar = get_lunar_phase()
    wisdom = get_daily_wisdom()
    return {"moon": lunar, "wisdom": wisdom}

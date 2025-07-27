from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.api.v1 import daily_rhythm

app = FastAPI()

app.include_router(daily_rhythm.router, prefix="/api/v1")

app.mount("/", StaticFiles(directory="static", html=True), name="static")

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from app.api.v1 import daily_rhythm

load_dotenv()

app = FastAPI()

app.include_router(daily_rhythm.router, prefix="/api/v1")

app.mount("/", StaticFiles(directory="static", html=True), name="static")

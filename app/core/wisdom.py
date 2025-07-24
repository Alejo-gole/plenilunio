import json
import random
from pathlib import Path

WISDOM_PATH = Path(__file__).resolve().parents[2] / "data" / "wisdom.json"

def get_daily_wisdom():
    try:
        with open(WISDOM_PATH, encoding="utf-8") as f:
            data = json.load(f)
        
        # Espera un objeto con clave "entries"
        frases = data["entries"] if isinstance(data, dict) and "entries" in data else data
        
        return random.choice(frases)

    except (FileNotFoundError, json.JSONDecodeError, KeyError, IndexError) as e:
        return "🌑 Hoy el silencio es suficiente."

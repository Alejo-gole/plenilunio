from datetime import datetime, timezone
from astral import moon

def get_lunar_phase(_city=None):
    now = datetime.now(timezone.utc)
    age = moon.phase(now)

    # Cálculo estimado de iluminación en porcentaje
    illum_frac = 1 - abs(15 - age) / 15

    if age < 1 or age >= 29:
        phase_name = "Luna Nueva"
    elif age < 7:
        phase_name = "Cuarto Creciente"
    elif age < 15:
        phase_name = "Luna Llena"
    elif age < 22:
        phase_name = "Cuarto Menguante"
    else:
        phase_name = "Luna Nueva"

    return {
        "phase": phase_name,
        "illumination": round(illum_frac * 100, 2)
    }

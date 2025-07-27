import math
from datetime import datetime, timezone
from astral import moon

def get_lunar_phase():
    now = datetime.now(timezone.utc)
    phase_days = moon.phase(now)

    # Cálculo estimado de iluminación en porcentaje
    angle = (phase_days / 29.530) * 360
    illumination = (1 - math.cos(math.radians(angle))) / 2
    illumination_percent = illumination * 100
    
    if illumination_percent < 0.5:
        phase_name = "Luna Nueva"
    elif illumination_percent < 25:
        phase_name = "Creciente Cóncava"
    elif illumination_percent < 49.5:
        phase_name = "Cuarto Creciente"
    elif illumination_percent < 50.5:
        phase_name = "Creciente Convexa"  # Primera fase convexa
    elif illumination_percent < 99.5:
        phase_name = "Luna Llena"
    elif illumination_percent < 75:
        phase_name = "Menguante Convexa"  # Segunda fase convexa
    elif illumination_percent < 50.5:
        phase_name = "Cuarto Menguante"
    else:
        phase_name = "Menguante Cóncava"

    return {
        "phase": phase_name,
        "illumination": round(illumination_percent, 2)
    }
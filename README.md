# 🌕 Plenilunio

**Plenilunio** is a minimalist web application designed to create a symbolic, daily connection with the moon's natural cycle.  
It offers users a simple interface to view the current moon phase, its illumination percentage, and a daily reflection message based on their selected location.

---

## ✨ Purpose

- Foster a sense of introspection through lunar rhythms.
- Respect digital sustainability (low CO₂, no accounts, no data tracking).


## 🌐 Live Demo

*Coming soon / Local installation instructions below.*

---

# 🛠️ Stack

- **Frontend**: HTML + Tailwind CSS + vanilla JavaScript
- **Backend**: FastAPI + JSON-based dynamic data (no database)
- **Lunar calculations**: [Astral](https://astral.readthedocs.io/)
- **Infrastructure**: Clean folder separation (`/static`, `/data`, `/app`, etc.)

## 🚀 How to Run Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/Alejo-gole/plenilunio.git
   cd plenilunio

2. Install dependencies:

   ```bash
   pip install -r requirements.txt

3. Run the server:

   ```bash
   uvicorn app.main:app --reload

4. Visit localhost in your browser.

---

# 📄 Licenses

## 🔧 Project Code
This project’s source code is licensed under the GNU General Public License v3.0 (GPL-3.0).

You are free to:

- Use, study, and modify the code
- Distribute it and your changes
- As long as you distribute your modifications under the same license
- Commercial use is allowed under the same terms


## 🎨 Creative Content Rights

All symbolic content, textual reflections, UI narrative structure, visual metaphors, and philosophical concepts are original works by Alejandro Rodríguez and are not freely licensed.

See: [CREATIVE-CONTENT-NOTICE.md](CREATIVE-CONTENT-NOTICE.md)

These works are part of the author's professional and academic portfolio.
Do not reproduce, adapt, or use them without explicit permission.

## 📦 Third-Party Dependencies and Licenses

This project uses third-party software libraries that are separately licensed as follows:

- **FastAPI**  
  License: [MIT License](https://opensource.org/licenses/MIT)  
  Repository: [https://github.com/tiangolo/fastapi](https://github.com/tiangolo/fastapi)

- **Uvicorn**  
  License: [BSD 3-Clause License](https://opensource.org/licenses/BSD-3-Clause)  
  Repository: [https://github.com/encode/uvicorn](https://github.com/encode/uvicorn)

- **Astral**  
  License: [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)  
  Repository: [https://github.com/sffjunkie/astral](https://github.com/sffjunkie/astral)

These libraries are included via `requirements.txt` and are subject to their respective licenses.

---

🙏 Credits

Created with life care by Alejandro Rodríguez
Visual communicator · Nature-conscious design advocate · Researcher in symbolic interfaces


---

🌱 Philosophy

*Plenilunio is more than code—it's a contemplative gesture.*
It lives in the rhythm of the moon, not in scrolls or feeds.
Designed with minimal environmental impact and maximal poetic intent.

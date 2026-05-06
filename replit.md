# ELD Trip Planner

Full-stack app for truckers to plan FMCSA HOS-compliant trips with route mapping and driver daily log generation.

## Run & Operate

- **Frontend dev**: `cd frontend && npm run dev` (port 5000)
- **Backend dev**: `cd backend && python manage.py runserver localhost:8000`
- **Migrations**: `cd backend && python manage.py makemigrations && python manage.py migrate`
- **Build for prod**: `cd frontend && npm run build`

## Stack

- **Frontend**: React 19 + Vite 8, plain CSS (no UI framework)
- **Backend**: Django 5.2 + Django REST Framework, SQLite (dev)
- **Runtime**: Python 3.11, Node.js 20

## Where things live

- `backend/` — Django project root
  - `eld_planner/` — settings, urls, wsgi
  - `trips/` — models, views, serializers, urls, HOS calculator
  - `trips/hos_calculator.py` — core FMCSA HOS logic
- `frontend/src/` — React app
  - `components/TripForm.jsx` — trip input form with presets
  - `components/LogSheet.jsx` — ELD log grid renderer
  - `components/RouteMap.jsx` — SVG route map
  - `components/TripSummary.jsx` — trip stats
  - `components/TripHistory.jsx` — saved trips list

## Architecture decisions

- Frontend proxies `/api/*` to Django via Vite dev proxy (port 8000 → served at 5000)
- Distance calculated using Haversine formula from lat/lon coordinates
- HOS schedule built with pure Python logic in `hos_calculator.py` (no external deps)
- Log entries stored per-trip in SQLite for history/retrieval
- Deployment: frontend built to `backend/static_frontend/`, served via gunicorn

## Product

- Enter current location, pickup, and dropoff with current HOS cycle hours
- Auto-generates multi-day HOS-compliant driving schedule (11h drive, 14h window, 70h cycle)
- Visual ELD log grid showing Off Duty / Sleeper Berth / Driving / On Duty per hour
- SVG route map showing all three stops
- Trip history saved and retrievable

## Gotchas

- Backend must run on `localhost:8000` (not `0.0.0.0`) to avoid port conflict with frontend
- Frontend must use `0.0.0.0:5000` for Replit preview proxy to work
- `CORS_ALLOW_ALL_ORIGINS = True` in dev — restrict in production

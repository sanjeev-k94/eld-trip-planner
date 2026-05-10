# 🚛 ELD Trip Planner

A Full Stack ELD (Electronic Logging Device) Trip Planning application built using React and Django.

The application helps truck drivers and logistics teams plan trips using FMCSA Hours of Service (HOS) rules, calculate ETAs, visualize routes, generate driver logs, recommend fuel stops, and monitor driver fatigue.

---

# ✨ Features

## 🚚 Trip Planning
- Plan routes between current, pickup, and dropoff locations
- Calculate total trip distance
- Generate estimated travel days

## 🕒 ETA Calculations
- Current time tracking
- Pickup ETA
- Dropoff ETA

## 📋 HOS Compliance
- FMCSA 70-hour / 8-day rule support
- Driver log generation
- Driving hour tracking

## ⛽ Fuel Stop Recommendations
- Automatic fuel stop suggestions
- Distance-based stop calculations
- ETA for each fuel stop
- Break recommendations

## ⚠ Driver Fatigue Monitoring
- Fatigue warning system
- Cycle hour monitoring
- Safety alert notifications

## 🗺 Route Visualization
- Interactive route map
- Route markers
- Pickup/dropoff visualization

## 🎨 Modern UI/UX
- Responsive dashboard layout
- Animated loading screens
- Professional trip summary cards
- Interactive components

---

# 🛠 Tech Stack

## Frontend
- React
- Vite
- CSS

## Backend
- Django
- Django REST Framework

## Other Tools
- Git & GitHub
- Node.js
- Python

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/sanjeev-k94/eld-trip-planner
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5000
```

---

## Backend Setup

```bash
cd backend
pip install -r requirements.txt
python manage.py runserver
```

Backend runs on:

```bash
http://127.0.0.1:8000
```

---

# 🚀 Major Features Implemented

✅ Trip distance calculation using Haversine formula  
✅ FMCSA HOS schedule generation  
✅ ETA calculation system  
✅ Fuel stop recommendation engine  
✅ Driver fatigue warning system  
✅ Trip history management  
✅ Interactive route visualization  
✅ Modern animated loading UI  
✅ Full Stack React + Django integration  

---

# 📌 Example Route

Current Location:
- New York, NY

Pickup Location:
- Chicago, IL

Dropoff Location:
- Los Angeles, CA

---

# 🚀 Future Improvements

- Live traffic integration
- Real-time GPS tracking
- Weather integration
- PDF export for driver logs
- Dark mode
- Mobile responsiveness
- Authentication system

---

# 👨‍💻 Author

Sanjeev K

GitHub:
https://github.com/sanjeev-k94
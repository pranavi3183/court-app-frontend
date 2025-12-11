# 🎾 Sports Facility Booking — Frontend

This is the frontend application for the *Sports Facility Booking Platform*, built using React, Vite, and Tailwind CSS.

The app communicates with the backend to allow users to book courts, equipment, and coaches, and to view dynamic pricing based on rules set in the admin dashboard.

---

## 🚀 Features

### ✔ Booking Page
- Select Court  
- Select Coach (optional)  
- Select Rackets / Shoes  
- Choose Date & Time  
- Fetch final price dynamically from backend  
- Displays booking confirmation + pricing breakdown  

### ✔ Admin Dashboard
- Add courts  
- Add pricing rules (peak, weekend, court type)  
- View existing courts  
- View existing pricing rules  

### ✔ Home Page
- Intro to system  
- Quick links to pages  

---

## 🛠 Tech Stack

- *React* (Vite)
- *Tailwind CSS*
- *React Router*
- *Fetch API*
- *Vite Environment Variables*

---

## 📁 Folder Structure


src/
├── api/
│   ├── courts.js
│   ├── coaches.js
│   ├── bookings.js
│   └── pricing.js
├── components/
│   ├── courts/
│   │   └── CourtsList.jsx
│   ├── coaches/
│   │   └── CoachesList.jsx
│   └── bookings/
│       ├── BookingForm.jsx
│       └── BookingSuccess.jsx
├── pages/
│   ├── Home.jsx
│   ├── BookingPage.jsx
│   └── AdminPage.jsx
├── App.jsx
├── main.jsx
└── index.css
.env
vite.config.js
package.json
README.md


---

## ⚙ Installation

bash
cd court-app-frontend
npm install


## ▶ Running the Frontend

bash
npm run dev


Default app runs at:


http://localhost:5174


---

## 🌐 Environment Variables

Create .env in project root:


VITE_API_BASE_URL=http://localhost:4000


This connects React to the backend server.

---

## 🔌 API Layer (Fetch)

All API functions live in:


src/api/


Each file uses:

js
const BASE = import.meta.env.VITE_API_BASE_URL;


No axios is used — all requests use fetch().

---

## 🎨 Styling

Tailwind is configured via:


tailwind.config.js
postcss.config.js


Global styles:


src/index.css


---

## 🌍 Deployment (Vercel)

Use the recommended vercel.json:

json
{
  "version": 2,
  "builds": [
    { "src": "package.json", "use": "@vercel/static-build" }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ]
}


This fixes React Router 404 issues.

*Make sure:*
- Build command → npm run build
- Output directory → dist

---

## 🧪 Test Workflow (End‑to‑End)

### 1️⃣ Start Backend

bash
npm start


### 2️⃣ Start Frontend

bash
npm run dev


### 3️⃣ Open the booking page


http://localhost:5174/book


### 4️⃣ Fill booking form and submit

You should see:


Booking confirmed
Price: ₹<dynamic_price>

# 🌦️ Real-Time Weather Dashboard

## 📌 Project Overview
The Real-Time Weather Dashboard is a modern React-based web application that provides live weather updates, hourly and daily forecasts, air quality insights, custom alerts, and historical comparisons.

This project simulates an industry-level weather dashboard with focus on performance, reliability, and user experience.

---

## 🎯 Objective
To build a live dashboard showing:
- Current weather conditions  
- Hourly (48-hour) forecasts  
- Daily (14-day) forecasts  
- Alerts for extreme conditions  
- Historical comparison using past 5-year data  

---

## 🚀 Key Features

### 🌍 Weather Information
- Real-time temperature, humidity, and wind speed  
- Air Quality Index (AQI)  
- Feels-like temperature  
- Visibility, sunrise, and sunset  

### ⏱️ Forecasting
- 48-hour hourly forecast  
- 14-day daily forecast  
- Scrollable forecast cards  

### 📊 Interactive Charts
- Hourly temperature chart (48h)  
- Precipitation probability chart  
- 7-day temperature trend (min, max, avg)  

### ⚠️ Smart Alerts
- Heat alerts  
- Rain alerts  
- Air quality alerts  

### ⭐ User Features
- City search  
- Favorites system  
- Current location support  

### 📈 Historical Comparison
- Compares today’s temperature with 5-year monthly average  
- Uses Open-Meteo Archive API  
- Displays difference and insights  

---

## 🛠️ Tech Stack

Frontend: React (JSX)  
Charts: Recharts  
APIs: Open-Meteo (Forecast, Air Quality, Archive)  
State Management: React Hooks  
Storage: LocalStorage (Custom Cache System)  

---

## 🔌 APIs Used

### Open-Meteo Forecast API
- Current weather  
- Hourly (48 hours)  
- Daily (14 days)  

### Open-Meteo Air Quality API
- AQI data  

### Open-Meteo Archive API
- Historical weather data  

---

## ⚡ API Robustness
- Implemented retry mechanism for failed API calls  
- Handles network/API failures gracefully  
- Uses cached data as fallback  
- Prevents UI crashes  

---

## 🧠 Caching Strategy

### Cache Keys
- weather_city_{city}  
- weather_coords_{lat}_{lon}  
- aqi_city_{city}  
- historical_coords_{lat}_{lon}_{month}  

### TTL (Time-To-Live)
- Weather → 15 minutes  
- AQI → 30 minutes  
- Historical → 24 hours  

### Offline Fallback
- If API fails → stale cached data is used  

---

## 🔁 Rate Limit & Retry Strategy
- Custom retry logic implemented  
- Retries failed API calls automatically  
- Reduces unnecessary API calls using caching  

---

## 📊 Historical Data Method
- Fetches data for the same month across last 5 years  
- Calculates average monthly temperature  
- Compares with today’s temperature  

---

## 🧪 Testing

### Cache Service
- Cache storage and retrieval  
- Expiration handling  
- Stale fallback  

### Helper Functions
- Alert generation logic  

Run tests:
npm test

---

## ⚙️ Installation & Setup

git clone https://github.com/shashi1349/weather-dashboard.git

cd weather-dashboard

npm install

npm start

---

## 🌐 Live Demo
https://weather-dashboard-ten-brown.vercel.app/

---

## 📦 Deployment
- Deployed using Vercel  
- Connected with GitHub repository  
- Automatic builds on push  

---


## 🚀 Future Improvements
- Browser notifications for alerts  
- Dark mode  
- Mobile optimization  
- Advanced analytics  

---

## 👨‍💻 Author
Pagilla ShashiKiran Reddy

---

## 📌 Conclusion
This project demonstrates a production-ready weather dashboard with strong focus on performance, caching, and user experience.

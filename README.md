# ❄️ POLAR — Polar Expedition Logistics & Asset Management System

> A centralized digital platform for planning, monitoring, and managing polar expedition logistics, cargo, inventory, personnel, assets, weather risks, and emergency response.

## 🌐 Overview

POLAR is designed to simplify the management of complex polar expeditions where extreme weather, limited resources, long resupply cycles, transportation delays, and remote locations create major logistical challenges.

The platform brings important expedition operations into a single command center and provides data-driven decision support.

**Monitor → Predict → Simulate → Recommend → Act**

## 🎯 Problem Statement

**SIH26062 — Integrated Polar Expedition Logistics and Asset Management System**

Polar expeditions require coordination between research stations, personnel, cargo, inventory, transportation, equipment, and emergency resources.

POLAR addresses this by providing a unified system for:

- 🚢 Expedition planning
- 📦 Cargo & shipment tracking
- 📊 Inventory management
- 👥 Personnel movement
- 🔧 Asset management
- 🌦️ Weather & risk monitoring
- 🚨 Emergency response
- 🤖 Intelligent decision support

## ✨ Key Features

### 📊 Command Center Dashboard
Provides a real-time overview of:

- Active expeditions
- Personnel
- Cargo in transit
- Inventory health
- Transportation
- Alerts
- Operational risk

### 📦 Smart Cargo Management
Track cargo throughout its journey using:

- Cargo ID
- Category
- Quantity
- Weight
- Origin & destination
- Priority
- Transport status
- ETA

### 📈 Inventory Monitoring

Monitor critical resources such as:

- Fuel
- Food
- Oxygen
- Medicine
- Spare parts
- Emergency supplies

The system can identify low-stock conditions and help forecast potential shortages before the next resupply.

### 👥 Personnel Management

Track researchers, crew, logistics teams, and other personnel across:

- Research stations
- Ships
- Aircraft
- Vehicles
- Field locations

### 🚢 Transportation Management

Manage and monitor:

- Research vessels
- Aircraft
- Snow vehicles
- Supply vehicles

Transportation delays can be connected with cargo ETA and inventory forecasts.

### 🌦️ Weather & Risk Intelligence

Weather conditions can directly affect polar logistics.

POLAR connects weather events with transportation, inventory, and operational risk.

```text
Severe Weather
      ↓
Transport Delay
      ↓
Cargo ETA Changes
      ↓
Inventory Forecast
      ↓
Risk Assessment
### 🚨 Emergency Response

Support emergency situations such as:

- Medical emergencies
- Severe weather
- Equipment failure
- Fuel shortages
- Oxygen shortages
- Personnel isolation
- Evacuation

The system helps identify affected personnel, available resources, nearby stations, and possible response actions.

### 🤖 AI-Assisted Decision Support

The planned intelligence layer can help answer questions such as:

- Which station is at highest risk?
- When will a critical resource run out?
- Which cargo should be prioritized?
- What happens if a vessel is delayed?
- Which nearby station has available resources?

Recommendations are designed to provide explanations so operators can understand **why** an action is suggested.

## 🧠 What-If Simulation

POLAR can be extended with scenario simulation to test situations before taking action.

Example:

```text
Vessel delayed by 5 days
        ↓
Cargo delivery delayed
        ↓
Inventory forecast updated
        ↓
Shortage predicted
        ↓
Alternative resupply recommended
        POLAR Web Application
                 │
                 ▼
           Backend API
                 │
       ┌─────────┼─────────┐
       ▼         ▼         ▼
   Database    AI/Risk   External
              Engine      APIs
Example:

```text
Vessel delayed by 5 days
        ↓
Cargo delivery delayed
        ↓
Inventory forecast updated
        ↓
Shortage predicted
        ↓
Alternative resupply recommended
```

## 🏗️ Architecture

```text
        POLAR Web Application
                 │
                 ▼
           Backend API
                 │
       ┌─────────┼─────────┐
       ▼         ▼         ▼
   Database    AI/Risk   External
              Engine      APIs
```

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| UI | CSS |
| Data Visualization | Recharts |
| Icons | Lucide React |
| Backend | Planned |
| Database | Planned |
| AI Layer | Planned |
| Version Control | Git + GitHub |

## 📁 Current Project Structure

```text
POLAR/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── public/
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mhdshahal64-coder/POLAR.git
cd POLAR
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## 🏆 SIH 2026 Alignment

| Requirement | POLAR |
|---|---|
| Expedition Planning | ✅ |
| Cargo Tracking | ✅ |
| Inventory Management | ✅ |
| Personnel Movement | ✅ |
| Asset Management | ✅ |
| Emergency Response | ✅ |
| Weather Monitoring | ✅ |
| Risk Intelligence | 🚧 |
| AI Decision Support | 🚧 |
| What-If Simulation | 🚧 |

## 🔮 Future Scope

- 🛰️ Satellite data integration
- 🌦️ Real-time weather APIs
- 📡 IoT sensor integration
- 🗺️ Route optimization
- 📦 Advanced cargo optimization
- 🔮 Predictive inventory forecasting
- 🤖 AI logistics assistant
- 📱 Offline-first capabilities
- 🌐 Digital twin visualization
- 🚨 Advanced emergency coordination

## 📌 Project Status

POLAR is currently being developed as a prototype for **Smart India Hackathon 2026**.

The current version focuses on the command-center interface and core expedition management concepts, with backend, database, AI intelligence, and real-time integrations planned for future development.
# ❄️ POLAR — Polar Expedition Logistics & Asset Management System

> An integrated digital command center for planning, tracking, and managing
> polar expeditions, cargo, inventory, personnel, transportation, and
> emergency response.

---

## 🌐 Overview

POLAR is a centralized expedition management platform designed to support
polar research missions in extreme and remote environments.

The system brings expedition planning, cargo tracking, inventory management,
personnel movement, transportation monitoring, and emergency response into
one intelligent command center.

---

## 🎯 Problem Statement

**SIH26062 — Integrated Polar Expedition Logistics and Asset Management System**

The platform addresses the challenges of managing:

- 🚢 Expedition logistics
- 📦 Cargo movement
- 📊 Inventory and supplies
- 👥 Personnel movement
- 🚨 Emergency situations
- 🌦️ Environmental and operational risks

---

## ✨ Key Features

### 🚢 Expedition Management

- Create and manage expeditions
- Track expedition status
- Manage stations and routes
- Monitor mission timelines

### 📦 Cargo Tracking

- Cargo identification and categorization
- Shipment tracking
- Origin and destination management
- Cargo status monitoring
- ETA tracking

### 📊 Smart Inventory

- Real-time stock monitoring
- Fuel, food, medicine and oxygen tracking
- Low-stock alerts
- Consumption monitoring
- Inventory forecasting
- Resupply recommendations

### 👥 Personnel Management

- Personnel registration
- Station assignment
- Movement tracking
- Arrival/departure monitoring
- Personnel status management

### 🚨 Emergency Response

- Critical incident detection
- Personnel affected by emergencies
- Nearby resource identification
- Emergency response recommendations
- Risk assessment

### 🌦️ Risk & Weather Intelligence

- Weather-aware logistics
- Transport risk monitoring
- Operational risk scoring
- Weather impact on ETA and supplies

### 🤖 AI Logistics Assistant

- Explain operational risks
- Recommend resupply actions
- Analyze expedition conditions
- Support logistics decision-making

---

## 🧠 Intelligent Decision Support

POLAR follows a simple operational intelligence cycle:

**MONITOR → PREDICT → SIMULATE → RECOMMEND → ACT**

Instead of simply displaying data, POLAR helps expedition managers understand
what may happen next and what action should be taken.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────┐
│        POLAR Web App        │
│     React + Vite + UI       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        Backend API          │
│       Node.js / Express     │
└──────────────┬──────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌─────────────┐
│ PostgreSQL  │  │ AI Services │
│  Database   │  │ Intelligence │
└─────────────┘  └─────────────┘ 
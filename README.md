# AeroSense

A simulated predictive-maintenance dashboard for monitoring fleet health, prioritising maintenance, and improving aircraft availability.

## Problem statement

**Air Power: Predictive Maintenance & Fleet Availability** — help maintenance teams identify degrading aircraft systems before failures cause avoidable downtime, while coordinating repairs, spares, and fleet readiness.

## Features

- Fleet readiness overview with aircraft health, status, and availability KPIs
- Live-style telemetry and a selectable digital twin for each airframe
- Predictive-alert queue with remaining useful life (RUL), explainability, acknowledgement, and work-order actions
- Airframe matrix, IAF air-station directory, maintenance planner, and spares view
- Fault simulation that injects a visible Engine 2 anomaly into the current aircraft
- Optional Express mock API for fleet, alerts, telemetry, spares, work orders, and fault simulations
- Built-in local mock-data fallback so the frontend remains usable without the API

## Tech stack

- React 18 and Vite
- Tailwind CSS
- Recharts and Lucide React
- Express and CORS for the optional mock backend

## Run the project

### Frontend

```bash
npm install
npm run dev
```

Open the URL shown by Vite (normally `http://localhost:5173`). Create a production build with:

```bash
npm run build
```

### Optional mock server

In a second terminal, after installing dependencies, run:

```bash
npm run server
```

The mock API listens on `http://localhost:3001`. During Vite development, `/api` is proxied to it. If it is not running, AeroSense automatically uses its bundled local mock data.

## Project structure

```text
src/
  components/        Shared dashboard layout components
  context/           Fleet state and safe API/local-data coordination
  data/              Frontend fallback mock data and telemetry generator
  pages/             Dashboard views
  services/api.js    Failure-safe optional API client
server/
  data/              JSON mock data used by the Express API
  index.js            API routes and in-memory mutation handlers
```

## How it would work in production

Aircraft health, flight, and maintenance-record feeds would be ingested through secured streaming and batch connectors. RUL regression and anomaly-detection models would score clean telemetry, while a digital twin would maintain each airframe's current subsystem state. An optimisation engine would then balance risk, maintenance-bay capacity, technician availability, and spares logistics to recommend or create the best maintenance actions.

All data, telemetry, predictions, airframes, stations, and work orders in this repository are simulated for demonstration purposes.

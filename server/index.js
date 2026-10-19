import cors from 'cors';
import express from 'express';
import { readFileSync } from 'node:fs';

const app = express();
const port = Number(process.env.PORT) || 3001;
const dataDirectory = new URL('./data/', import.meta.url);

function loadJson(filename) {
  return JSON.parse(readFileSync(new URL(filename, dataDirectory), 'utf8'));
}

const fleet = loadJson('fleet.json');
const alerts = loadJson('alerts.json');
const spares = loadJson('spares.json');
const sensors = loadJson('sensors.json');
const faultTemplate = loadJson('faults.json');
const workOrders = loadJson('workOrders.json');

app.use(cors());
app.use(express.json());

app.get('/api/fleet', (_request, response) => response.json(fleet));
app.get('/api/alerts', (_request, response) => response.json(alerts));
app.get('/api/spares', (_request, response) => response.json(spares));

app.get('/api/aircraft/:id/sensors', (request, response) => {
  const aircraftId = request.params.id;
  response.json({ aircraftId, readings: sensors[aircraftId] || sensors.default });
});

app.post('/api/workorders', (request, response) => {
  const workOrder = {
    id: request.body.id || `WO-${Math.floor(1000 + Math.random() * 9000)}`,
    tailNumber: request.body.tailNumber || 'UNASSIGNED',
    priority: request.body.priority || 'High',
    base: request.body.base || 'Unassigned Base',
    title: request.body.title || 'Inspection / Repair',
    assignedTo: request.body.assignedTo || 'Rapid Turnaround Depot',
    createdDate: request.body.createdDate || new Date().toISOString().slice(0, 10),
    status: request.body.status || 'Dispatched',
    sparesUsed: request.body.sparesUsed || []
  };

  workOrders.unshift(workOrder);
  response.status(201).json({ workOrder });
});

app.post('/api/simulate-fault', (request, response) => {
  const requestedAircraftId = request.body.aircraftId;
  if (!requestedAircraftId) {
    response.status(404).json({ error: 'No mock aircraft is available.' });
    return;
  }

  let aircraft = fleet.find(item => item.id === requestedAircraftId);
  if (!aircraft) {
    aircraft = {
      id: requestedAircraftId,
      tailNumber: request.body.tailNumber || requestedAircraftId,
      base: request.body.base || 'Simulated Base',
      healthScore: request.body.healthScore || 58,
      subsystems: {}
    };
    fleet.push(aircraft);
  }

  const alert = {
    id: `SIM-${Date.now()}`,
    tailNumber: aircraft.tailNumber,
    base: aircraft.base,
    component: faultTemplate.component,
    issue: faultTemplate.issue,
    severity: faultTemplate.severity,
    failureProbability: faultTemplate.failureProbability,
    rulHours: faultTemplate.rulHours,
    timestamp: 'just now',
    acknowledged: false,
    workOrderId: null,
    shapFactors: faultTemplate.shapFactors,
    recommendedAction: faultTemplate.recommendedAction
  };
  const aircraftPatch = {
    status: 'degraded',
    healthScore: Math.min(aircraft.healthScore || 58, 58),
    predictedFailureDays: 2,
    activeAlert: alert.issue,
    subsystems: { engine2: faultTemplate.subsystemPatch }
  };

  alerts.unshift(alert);
  Object.assign(aircraft, aircraftPatch, {
    subsystems: { ...aircraft.subsystems, engine2: { ...aircraft.subsystems?.engine2, ...faultTemplate.subsystemPatch } }
  });
  response.status(201).json({ aircraftId: aircraft.id, aircraftPatch, alert });
});

app.listen(port, () => {
  console.log(`AeroSense mock API listening on http://localhost:${port}`);
});

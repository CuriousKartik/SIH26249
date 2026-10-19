const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 1500);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      signal: controller.signal
    });

    if (!response.ok) return null;
    return response.json();
  } catch {
    // The deployed frontend deliberately continues with local demo data.
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export const getFleet = () => request('/fleet');
export const getAlerts = () => request('/alerts');
export const getSpares = () => request('/spares');
export const getAircraftSensors = (aircraftId) => request(`/aircraft/${encodeURIComponent(aircraftId)}/sensors`);

export const postWorkOrder = (workOrder) => request('/workorders', {
  method: 'POST',
  body: JSON.stringify(workOrder)
});

export const postSimulateFault = (aircraft) => request('/simulate-fault', {
  method: 'POST',
  body: JSON.stringify({
    aircraftId: aircraft.id,
    tailNumber: aircraft.tailNumber,
    base: aircraft.base,
    healthScore: aircraft.healthScore
  })
});

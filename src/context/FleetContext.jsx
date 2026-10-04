import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_AIRCRAFT_DATA } from '../data/aircraftData';
import { INITIAL_PREDICTIVE_ALERTS, STREAM_TICKER_ALERTS } from '../data/alertsData';
import { INITIAL_SPARES, INITIAL_MAINTENANCE_SCHEDULE, INITIAL_WORK_ORDERS } from '../data/sparesData';
import { generateSubsystemSensorReading } from '../data/sensorGenerator';
import { getAlerts, getFleet, getSpares, postSimulateFault, postWorkOrder } from '../services/api';

const FleetContext = createContext(null);

export function FleetProvider({ children }) {
  const [fleet, setFleet] = useState(INITIAL_AIRCRAFT_DATA);
  const [selectedAircraftId, setSelectedAircraftId] = useState('KA-2417');
  const [alerts, setAlerts] = useState(INITIAL_PREDICTIVE_ALERTS);
  const [liveTickerAlerts, setLiveTickerAlerts] = useState(STREAM_TICKER_ALERTS.slice(0, 6));
  const [tickerStreamIndex, setTickerStreamIndex] = useState(6);
  const [spares, setSpares] = useState(INITIAL_SPARES);
  const [schedule, setSchedule] = useState(INITIAL_MAINTENANCE_SCHEDULE);
  const [workOrders, setWorkOrders] = useState(INITIAL_WORK_ORDERS);
  const [isScheduleOptimized, setIsScheduleOptimized] = useState(false);
  const [tick, setTick] = useState(0);
  const [downtimeSaved, setDowntimeSaved] = useState(142.5);
  const [isFaultSimulationRunning, setIsFaultSimulationRunning] = useState(false);

  // Selected aircraft helper
  const selectedAircraft = fleet.find(a => a.id === selectedAircraftId) || fleet[0];

  // The API augments the bundled demo data when the optional mock server is running.
  // Each request is failure-safe so static deployments retain their local data.
  useEffect(() => {
    let isCurrent = true;

    Promise.all([getFleet(), getAlerts(), getSpares()]).then(([remoteFleet, remoteAlerts, remoteSpares]) => {
      if (!isCurrent) return;

      if (Array.isArray(remoteFleet)) {
        setFleet(currentFleet => currentFleet.map((aircraft) => {
          const remoteAircraft = remoteFleet.find(item => item.id === aircraft.id);
          if (!remoteAircraft) return aircraft;

          const mergedSubsystems = { ...aircraft.subsystems, ...remoteAircraft.subsystems };
          Object.keys(remoteAircraft.subsystems || {}).forEach((key) => {
            mergedSubsystems[key] = { ...aircraft.subsystems[key], ...remoteAircraft.subsystems[key] };
          });

          return { ...aircraft, ...remoteAircraft, subsystems: mergedSubsystems };
        }));
      }

      if (Array.isArray(remoteAlerts)) {
        setAlerts(currentAlerts => [
          ...remoteAlerts,
          ...currentAlerts.filter(alert => !remoteAlerts.some(remoteAlert => remoteAlert.id === alert.id))
        ]);
      }

      if (Array.isArray(remoteSpares)) {
        setSpares(currentSpares => currentSpares.map((spare) => {
          const remoteSpare = remoteSpares.find(item => item.id === spare.id);
          return remoteSpare ? { ...spare, ...remoteSpare } : spare;
        }));
      }
    });

    return () => {
      isCurrent = false;
    };
  }, []);

  // Sensor reading updates every 1.5s (baseline + sin + noise + upward drift for faulty)
  useEffect(() => {
    const sensorInterval = setInterval(() => {
      setTick(prevTick => {
        const nextTick = prevTick + 1;
        
        // Update sensor values on all aircraft slightly to simulate live telemetry
        setFleet(currentFleet => {
          return currentFleet.map(ac => {
            // Re-sample primary subsystems
            const e1Reading = generateSubsystemSensorReading(ac, 'engine1', nextTick);
            const e2Reading = generateSubsystemSensorReading(ac, 'engine2', nextTick);
            const hydReading = generateSubsystemSensorReading(ac, 'hydraulics', nextTick);
            const avioReading = generateSubsystemSensorReading(ac, 'avionics', nextTick);

            return {
              ...ac,
              subsystems: {
                ...ac.subsystems,
                engine1: {
                  ...ac.subsystems.engine1,
                  egt: e1Reading.egt,
                  vibration: e1Reading.vibration,
                  oilPressure: e1Reading.oilPressure,
                  rulHours: e1Reading.rul
                },
                engine2: {
                  ...ac.subsystems.engine2,
                  egt: e2Reading.egt,
                  vibration: e2Reading.vibration,
                  oilPressure: e2Reading.oilPressure,
                  rulHours: e2Reading.rul
                },
                hydraulics: {
                  ...ac.subsystems.hydraulics,
                  temp: hydReading.hydraulicTemp,
                  pressure: hydReading.hydraulicPressure
                },
                avionics: {
                  ...ac.subsystems.avionics,
                  coreTemp: avioReading.avionicsTemp
                }
              }
            };
          });
        });

        return nextTick;
      });
    }, 1500);

    return () => clearInterval(sensorInterval);
  }, []);

  // Live alert ticker: push a new alert into ticker every 25 seconds
  useEffect(() => {
    const tickerInterval = setInterval(() => {
      setTickerStreamIndex(currentIndex => {
        const nextIndex = (currentIndex + 1) % STREAM_TICKER_ALERTS.length;
        const newAlert = STREAM_TICKER_ALERTS[currentIndex % STREAM_TICKER_ALERTS.length];
        
        const timestampedAlert = {
          ...newAlert,
          id: `TICK-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };

        setLiveTickerAlerts(prev => [timestampedAlert, ...prev.slice(0, 19)]);
        return nextIndex;
      });
    }, 25000);

    return () => clearInterval(tickerInterval);
  }, []);

  // Acknowledge alert
  const acknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
  };

  // Create work order from alert
  const createWorkOrder = (alert) => {
    const newWoId = `WO-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: newWoId,
      tailNumber: alert.tailNumber,
      priority: alert.severity === 'critical' ? 'Critical' : 'High',
      base: alert.base,
      title: `${alert.component} Inspection / Repair (${alert.tailNumber})`,
      assignedTo: 'Rapid Turnaround Depot',
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Dispatched',
      sparesUsed: ['SP-101', 'SP-107']
    };

    setWorkOrders(prev => [newOrder, ...prev]);
    setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, acknowledged: true, workOrderId: newWoId } : a));
    setDowntimeSaved(prev => parseFloat((prev + 12.5).toFixed(1)));
    
    // Add event into live ticker
    const notice = {
      id: `WO-TICK-${Date.now()}`,
      tail: alert.tailNumber,
      text: `Work Order ${newWoId} initiated for ${alert.tailNumber} (${alert.component}) at ${alert.base}`,
      type: 'warning',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setLiveTickerAlerts(prev => [notice, ...prev]);

    // Keep the UI instant; the optional API persists the same mock work order.
    postWorkOrder(newOrder);
  };

  const simulateFault = async (aircraftId = selectedAircraftId) => {
    const aircraft = fleet.find(item => item.id === aircraftId) || selectedAircraft;
    if (!aircraft || isFaultSimulationRunning) return;

    setIsFaultSimulationRunning(true);

    const fallbackAlert = {
      id: `SIM-${Date.now()}`,
      tailNumber: aircraft.tailNumber,
      base: aircraft.base,
      component: 'Engine 2',
      issue: 'Simulated Engine 2 vibration anomaly: 86% failure probability in ~36 flight hours',
      severity: 'high',
      failureProbability: 86,
      rulHours: 36,
      timestamp: 'just now',
      acknowledged: false,
      workOrderId: null,
      shapFactors: [
        { feature: 'High-frequency vibration', impact: 0.41, direction: 'increase' },
        { feature: 'Oil-pressure decline', impact: 0.24, direction: 'increase' }
      ],
      recommendedAction: 'Inspect the Engine 2 bearing assembly during the next maintenance window.'
    };

    try {
      const response = await postSimulateFault(aircraft);
      const alert = response?.alert || fallbackAlert;
      const aircraftPatch = response?.aircraftPatch || {
        status: 'degraded',
        healthScore: Math.min(aircraft.healthScore, 58),
        predictedFailureDays: 2,
        activeAlert: alert.issue,
        subsystems: {
          engine2: {
            health: 48,
            egt: 762,
            vibration: 5.4,
            oilPressure: 49,
            rulHours: alert.rulHours,
            status: 'warning'
          }
        }
      };

      setFleet(currentFleet => currentFleet.map((item) => {
        if (item.id !== aircraft.id) return item;

        const patchedSubsystems = { ...item.subsystems, ...aircraftPatch.subsystems };
        Object.keys(aircraftPatch.subsystems || {}).forEach((key) => {
          patchedSubsystems[key] = { ...item.subsystems[key], ...aircraftPatch.subsystems[key] };
        });

        return { ...item, ...aircraftPatch, subsystems: patchedSubsystems };
      }));
      setAlerts(currentAlerts => [alert, ...currentAlerts.filter(item => item.id !== alert.id)]);
      setLiveTickerAlerts(currentAlerts => [{
        id: `SIM-TICK-${Date.now()}`,
        tail: aircraft.tailNumber,
        text: `Simulated fault injected: ${alert.component} anomaly detected on ${aircraft.tailNumber}`,
        type: 'critical',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }, ...currentAlerts.slice(0, 19)]);
    } finally {
      setIsFaultSimulationRunning(false);
    }
  };

  // Optimize Schedule Action
  const toggleOptimizeSchedule = () => {
    setIsScheduleOptimized(prev => !prev);
  };

  // Derived Fleet KPIs
  const totalAircraft = fleet.length;
  const operationalCount = fleet.filter(a => a.status === 'operational').length;
  const degradedCount = fleet.filter(a => a.status === 'degraded').length;
  const groundedCount = fleet.filter(a => a.status === 'critical').length;
  
  // Base availability is 71%, raises to 84% when optimized
  const availabilityPercentage = isScheduleOptimized ? 84.2 : 70.8;
  const predictedFailuresCount = fleet.filter(a => a.predictedFailureDays !== null).length;

  return (
    <FleetContext.Provider
      value={{
        fleet,
        setFleet,
        selectedAircraftId,
        setSelectedAircraftId,
        selectedAircraft,
        alerts,
        setAlerts,
        liveTickerAlerts,
        spares,
        setSpares,
        schedule,
        setSchedule,
        workOrders,
        isScheduleOptimized,
        toggleOptimizeSchedule,
        tick,
        downtimeSaved,
        acknowledgeAlert,
        createWorkOrder,
        simulateFault,
        isFaultSimulationRunning,
        kpis: {
          totalAircraft,
          operationalCount,
          degradedCount,
          groundedCount: isScheduleOptimized ? 1 : groundedCount,
          availabilityPercentage,
          predictedFailuresCount: isScheduleOptimized ? 2 : predictedFailuresCount,
          downtimeSaved
        }
      }}
    >
      {children}
    </FleetContext.Provider>
  );
}

export function useFleet() {
  const context = useContext(FleetContext);
  if (!context) {
    throw new Error('useFleet must be used within a FleetProvider');
  }
  return context;
}

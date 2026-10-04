import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_AIRCRAFT_DATA } from '../data/aircraftData';
import { INITIAL_PREDICTIVE_ALERTS, STREAM_TICKER_ALERTS } from '../data/alertsData';
import { INITIAL_SPARES, INITIAL_MAINTENANCE_SCHEDULE, INITIAL_WORK_ORDERS } from '../data/sparesData';
import { generateSubsystemSensorReading } from '../data/sensorGenerator';

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

  // Selected aircraft helper
  const selectedAircraft = fleet.find(a => a.id === selectedAircraftId) || fleet[0];

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

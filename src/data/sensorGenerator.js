// Sensor generator using: baseline + sin(time) + noise (+ upward/downward drift for faulty aircraft)

/**
 * Generate instantaneous telemetry sample for an aircraft subsystem
 * @param {Object} aircraft - Aircraft object
 * @param {string} subsystemKey - 'engine1' | 'engine2' | 'hydraulics' | 'avionics' | 'landingGear'
 * @param {number} tick - Continuous counter or timestamp
 */
export function generateSubsystemSensorReading(aircraft, subsystemKey, tick = 0) {
  const isCritical = aircraft.status === 'critical';
  const isDegraded = aircraft.status === 'degraded';
  
  // Specific subsystem anomaly flags based on mock data
  const subData = aircraft.subsystems[subsystemKey] || {};
  const isTargetFault = subData.status === 'warning' || subData.status === 'critical';

  // Base parameters
  let egtBaseline = 648;
  let vibBaseline = 1.6;
  let oilPressBaseline = 68.0;
  let hydTempBaseline = 71.0;
  let hydPressBaseline = 3000;
  let avioTempBaseline = 42.0;

  // Drift multipliers if faulty
  if (isTargetFault || isCritical || (isDegraded && (subsystemKey === 'engine2' || subsystemKey === 'hydraulics'))) {
    if (subsystemKey === 'engine1' || subsystemKey === 'engine2') {
      egtBaseline = isCritical ? 785 : 740;
      vibBaseline = isCritical ? 6.4 : 4.9;
      oilPressBaseline = isCritical ? 45.0 : 51.0;
    } else if (subsystemKey === 'hydraulics') {
      hydTempBaseline = isCritical ? 96.0 : 84.0;
      hydPressBaseline = isCritical ? 2450 : 2750;
    } else if (subsystemKey === 'avionics') {
      avioTempBaseline = isCritical ? 62.0 : 56.0;
    }
  }

  // Periodic oscillation (sin wave)
  const sinPhase = Math.sin((tick * 0.15) + (aircraft.tailNumber.charCodeAt(aircraft.tailNumber.length - 1)));
  const slowSin = Math.sin((tick * 0.04) + 1.2);

  // Random noise
  const noise = (Math.random() - 0.5);

  // Compute calculated metrics
  const egt = parseFloat((egtBaseline + (sinPhase * 12) + (slowSin * 8) + (noise * 6)).toFixed(1));
  const vibration = parseFloat(Math.max(0.4, (vibBaseline + (sinPhase * 0.35) + (noise * 0.45))).toFixed(2));
  const oilPressure = parseFloat(Math.max(20, (oilPressBaseline - (sinPhase * 1.5) + (noise * 1.2))).toFixed(1));
  const hydraulicTemp = parseFloat((hydTempBaseline + (slowSin * 3) + (noise * 2)).toFixed(1));
  const hydraulicPressure = Math.round(hydPressBaseline + (sinPhase * 40) + (noise * 30));
  const avionicsTemp = parseFloat((avioTempBaseline + (slowSin * 1.5) + (noise * 1.0)).toFixed(1));

  // Remaining Useful Life (RUL)
  let rul = subData.rulHours || 1000;
  if (isCritical) {
    rul = Math.max(12, Math.round(rul - (tick % 5 === 0 ? 0.1 : 0)));
  }

  return {
    egt,
    vibration,
    oilPressure,
    hydraulicTemp,
    hydraulicPressure,
    avionicsTemp,
    rul,
    subsystemHealth: subData.health || 95,
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
}

/**
 * Generate initial historical dataset of 25 points for charts
 */
export function generateHistoricalPoints(aircraft, subsystemKey, count = 25) {
  const points = [];
  const now = Date.now();
  for (let i = count; i >= 0; i--) {
    const historicalTick = (count - i) * 2;
    const reading = generateSubsystemSensorReading(aircraft, subsystemKey, historicalTick);
    const timeLabel = new Date(now - (i * 2000)).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    points.push({
      ...reading,
      time: timeLabel
    });
  }
  return points;
}

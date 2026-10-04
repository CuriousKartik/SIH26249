// 12 Predictive Alerts and Dynamic Alert Stream for AeroSense

export const INITIAL_PREDICTIVE_ALERTS = [
  {
    id: 'ALT-101',
    tailNumber: 'KA-2417',
    base: 'Base Charlie',
    component: 'Engine 2',
    issue: 'Engine 2 bearing wear: 87% failure probability in ~42 flight hours',
    severity: 'high',
    failureProbability: 87,
    rulHours: 42,
    timestamp: '2 mins ago',
    acknowledged: false,
    workOrderId: null,
    shapFactors: [
      { feature: 'High Freq Harmonic Vibration (Z-axis)', impact: 0.42, direction: 'increase' },
      { feature: 'Oil Scavenge Temp Delta (+14°C)', impact: 0.28, direction: 'increase' },
      { feature: 'Magnetic Chip Detector Ferrous Count', impact: 0.19, direction: 'increase' },
      { feature: 'Compressor Spool RPM Regularity', impact: -0.06, direction: 'decrease' },
      { feature: 'Exhaust Gas Temp Margin', impact: 0.04, direction: 'increase' }
    ],
    recommendedAction: 'Stage CFM56 / AL-31FP bearing replacement assembly & schedule 12-hr inspection slot at Base Charlie Hangar 2.'
  },
  {
    id: 'ALT-102',
    tailNumber: 'KA-2404',
    base: 'Base Alpha',
    component: 'Engine 1',
    issue: 'Critical Spool Bearing Severe Harmonic Vibration: 94% failure probability in ~18 flight hours',
    severity: 'critical',
    failureProbability: 94,
    rulHours: 18,
    timestamp: '5 mins ago',
    acknowledged: false,
    workOrderId: null,
    shapFactors: [
      { feature: 'Peak Vibration Amplitude (6.8 mm/s)', impact: 0.48, direction: 'increase' },
      { feature: 'Lube Oil Pressure Drop (-18 psi)', impact: 0.29, direction: 'increase' },
      { feature: 'Turbine Thermal Gradient Spikes', impact: 0.18, direction: 'increase' },
      { feature: 'Inlet Air Velocity Stability', impact: -0.04, direction: 'decrease' }
    ],
    recommendedAction: 'Immediate grounding; borescope inspection of compressor stage 3 and immediate bearing race replacement.'
  },
  {
    id: 'ALT-103',
    tailNumber: 'KA-2410',
    base: 'Base Bravo',
    component: 'Hydraulics',
    issue: 'Primary Hydraulic Manifold cavitation risk: 91% failure probability in ~24 flight hours',
    severity: 'critical',
    failureProbability: 91,
    rulHours: 24,
    timestamp: '12 mins ago',
    acknowledged: true,
    workOrderId: 'WO-8821',
    shapFactors: [
      { feature: 'Manifold Return Line Pressure Pulsation', impact: 0.44, direction: 'increase' },
      { feature: 'Hydraulic Fluid Fluidity Index degradation', impact: 0.26, direction: 'increase' },
      { feature: 'Reservoir Temp Exceedance (98°C)', impact: 0.22, direction: 'increase' },
      { feature: 'Pump Motor Duty Cycle (96%)', impact: 0.11, direction: 'increase' }
    ],
    recommendedAction: 'Flush System B fluid, replace pressure relief valve PRV-4 and test accumulator pre-charge.'
  },
  {
    id: 'ALT-104',
    tailNumber: 'KA-2420',
    base: 'Base Charlie',
    component: 'Landing Gear',
    issue: 'Nose gear retraction cylinder internal bypass seal rupture: 89% failure probability in ~28 flight hours',
    severity: 'critical',
    failureProbability: 89,
    rulHours: 28,
    timestamp: '18 mins ago',
    acknowledged: false,
    workOrderId: null,
    shapFactors: [
      { feature: 'Extension Cycle Actuator Load (+26%)', impact: 0.41, direction: 'increase' },
      { feature: 'Hydraulic Fluid Seepage Signature', impact: 0.32, direction: 'increase' },
      { feature: 'Brake Pad Thermal Dissipation Lag', impact: 0.17, direction: 'increase' },
      { feature: 'Lock Hook Strain Sensor Deviation', impact: 0.09, direction: 'increase' }
    ],
    recommendedAction: 'Overhaul NLG Actuator Assembly; dispatch seal kit SK-842 to Base Charlie forward hangar.'
  },
  {
    id: 'ALT-105',
    tailNumber: 'KA-2402',
    base: 'Base Alpha',
    component: 'Engine 2',
    issue: 'High-Pressure Turbine thermal anomaly: 78% failure probability in ~64 flight hours',
    severity: 'high',
    failureProbability: 78,
    rulHours: 64,
    timestamp: '25 mins ago',
    acknowledged: false,
    workOrderId: null,
    shapFactors: [
      { feature: 'EGT Spread Variation (+42°C)', impact: 0.39, direction: 'increase' },
      { feature: 'Fuel Flow Metering Valve Jitter', impact: 0.27, direction: 'increase' },
      { feature: 'Turbine Blade Aerodynamic Load Disparity', impact: 0.21, direction: 'increase' },
      { feature: 'Cooling Air Bleed Rate Stability', impact: -0.08, direction: 'decrease' }
    ],
    recommendedAction: 'Inspect combustor liner and fuel nozzles #4 and #7; run diagnostic calibration run.'
  },
  {
    id: 'ALT-106',
    tailNumber: 'KA-2412',
    base: 'Base Bravo',
    component: 'Avionics',
    issue: 'Mission Computer Bay cooling duct flow restriction: 74% failure probability in ~76 flight hours',
    severity: 'medium',
    failureProbability: 74,
    rulHours: 76,
    timestamp: '34 mins ago',
    acknowledged: true,
    workOrderId: 'WO-8819',
    shapFactors: [
      { feature: 'Bay Thermal Enclosure Delta (+24°C)', impact: 0.43, direction: 'increase' },
      { feature: 'Avionics Bus 1553 Parity Retry Spikes', impact: 0.31, direction: 'increase' },
      { feature: 'Cooling Blower Static Backpressure', impact: 0.22, direction: 'increase' },
      { feature: 'Processor Power Rail Ripple', impact: 0.08, direction: 'increase' }
    ],
    recommendedAction: 'Clean intake particle separator mesh; replace cooling fan pack CF-12.'
  },
  {
    id: 'ALT-107',
    tailNumber: 'KA-2421',
    base: 'Base Charlie',
    component: 'Hydraulics',
    issue: 'Return circuit flow restrictor micro-clogging trend: 68% failure probability in ~92 flight hours',
    severity: 'medium',
    failureProbability: 68,
    rulHours: 92,
    timestamp: '42 mins ago',
    acknowledged: false,
    workOrderId: null,
    shapFactors: [
      { feature: 'Differential Return Filter Pressure ΔP', impact: 0.38, direction: 'increase' },
      { feature: 'Actuator Slew Rate Hysteresis', impact: 0.28, direction: 'increase' },
      { feature: 'Fluid Viscosity Index Drift', impact: 0.18, direction: 'increase' }
    ],
    recommendedAction: 'Replace high-pressure inline hydraulic micron filter element HF-502.'
  },
  {
    id: 'ALT-108',
    tailNumber: 'KA-2407',
    base: 'Base Alpha',
    component: 'Landing Gear',
    issue: 'Main Gear Starboard Brake disc carbon wear limit approaching: 62% failure probability in ~110 flight hours',
    severity: 'medium',
    failureProbability: 62,
    rulHours: 110,
    timestamp: '1 hour ago',
    acknowledged: false,
    workOrderId: null,
    shapFactors: [
      { feature: 'Brake Disc Thickness Degradation Model', impact: 0.45, direction: 'increase' },
      { feature: 'Touchdown Kinetic Energy Heat Retention', impact: 0.30, direction: 'increase' },
      { feature: 'Anti-Skid Pulse Frequency Modulation', impact: 0.15, direction: 'increase' }
    ],
    recommendedAction: 'Schedule carbon rotor replacement during next turnaround at Base Alpha.'
  },
  {
    id: 'ALT-109',
    tailNumber: 'KA-2415',
    base: 'Base Bravo',
    component: 'Engine 1',
    issue: 'Oil Scavenge Pump impeller minor cavitation vibration: 58% failure probability in ~140 flight hours',
    severity: 'low',
    failureProbability: 58,
    rulHours: 140,
    timestamp: '1.5 hours ago',
    acknowledged: false,
    workOrderId: null,
    shapFactors: [
      { feature: 'High-frequency Acoustic Sensor dB Peak', impact: 0.36, direction: 'increase' },
      { feature: 'Oil aeration percentage increase', impact: 0.31, direction: 'increase' },
      { feature: 'Oil cooler heat exchange efficiency', impact: -0.12, direction: 'decrease' }
    ],
    recommendedAction: 'Perform lube oil spectral analysis test for metallic particulates.'
  },
  {
    id: 'ALT-110',
    tailNumber: 'KA-2405',
    base: 'Base Alpha',
    component: 'Avionics',
    issue: 'Radar Altimeter Transceiver gain degradation: 54% failure probability in ~160 flight hours',
    severity: 'low',
    failureProbability: 54,
    rulHours: 160,
    timestamp: '2 hours ago',
    acknowledged: false,
    workOrderId: null,
    shapFactors: [
      { feature: 'RF Signal-to-Noise Ratio Falloff', impact: 0.40, direction: 'increase' },
      { feature: 'Waveguide impedance mismatch drift', impact: 0.28, direction: 'increase' },
      { feature: 'Transceiver power amplifier temperature', impact: 0.14, direction: 'increase' }
    ],
    recommendedAction: 'Calibrate transceiver antenna feed line coupling during next pre-flight inspection.'
  },
  {
    id: 'ALT-111',
    tailNumber: 'KA-2418',
    base: 'Base Charlie',
    component: 'Hydraulics',
    issue: 'Elevon actuator servo-valve current offset creeping: 49% failure probability in ~190 flight hours',
    severity: 'low',
    failureProbability: 49,
    rulHours: 190,
    timestamp: '2.5 hours ago',
    acknowledged: false,
    workOrderId: null,
    shapFactors: [
      { feature: 'Quiescent Current Consumption (+12mA)', impact: 0.37, direction: 'increase' },
      { feature: 'Flap response time lag (+15ms)', impact: 0.29, direction: 'increase' },
      { feature: 'Flight Control Computer Null Bias Error', impact: 0.16, direction: 'increase' }
    ],
    recommendedAction: 'Re-zero and lubricate elevon servo drive linkage assembly.'
  },
  {
    id: 'ALT-112',
    tailNumber: 'KA-2423',
    base: 'Base Charlie',
    component: 'Engine 2',
    issue: 'FADEC sensor channel B intermittent thermocouple drift: 45% failure probability in ~210 flight hours',
    severity: 'low',
    failureProbability: 45,
    rulHours: 210,
    timestamp: '3 hours ago',
    acknowledged: false,
    workOrderId: null,
    shapFactors: [
      { feature: 'Thermocouple cross-channel resistance delta', impact: 0.42, direction: 'increase' },
      { feature: 'Engine harness vibration jitter', impact: 0.25, direction: 'increase' },
      { feature: 'Ambient inlet sensor correlation', impact: -0.08, direction: 'decrease' }
    ],
    recommendedAction: 'Inspect wiring harness connector pin continuity at engine bulkhead junction.'
  }
];

// Dynamic stream pool for the 25-second ticker push
export const STREAM_TICKER_ALERTS = [
  { tail: 'KA-2417', text: 'Telemetry Sync: Engine 2 vibration trending at 5.2 mm/s (bearing wear alert active)', type: 'warning' },
  { tail: 'KA-2404', text: 'AI Model Edge Ingest: Anomaly score escalated to 0.94 on E-1 turbine bearing', type: 'critical' },
  { tail: 'KA-2401', text: 'Automated Diagnostic: Sortie #313 post-flight parameter sweep verified nominal', type: 'success' },
  { tail: 'KA-2410', text: 'Health Gateway: Hydraulic return pressure stabilized at 2,420 psi under ground power', type: 'warning' },
  { tail: 'KA-2403', text: 'IoT Edge Node: Base Alpha RF health telemetry package received 100% packet integrity', type: 'info' },
  { tail: 'KA-2420', text: 'Spares ERP: NLG seal repair pack dispatched via courier to Base Charlie', type: 'info' },
  { tail: 'KA-2412', text: 'Condition Monitor: Avionics thermal dissipation delta increased +2.1°C', type: 'warning' },
  { tail: 'KA-2409', text: 'Fleet Command: Sortie readiness index Base Bravo updated to 87.5%', type: 'info' },
  { tail: 'KA-2421', text: 'Predictive Model: Hydraulic return filter RUL recalculated to 92 flight hrs', type: 'warning' },
  { tail: 'KA-2419', text: 'Digital Twin: Real-time telemetry digital twin synchronization latency 12ms', type: 'success' },
  { tail: 'KA-2414', text: 'IoT Sensor Stream: EGT distribution across annular combustors within ±3°C', type: 'success' },
  { tail: 'KA-2406', text: 'Maint Record Sync: Technical logbook entry #TL-9042 validated by Base Alpha engineering', type: 'info' }
];

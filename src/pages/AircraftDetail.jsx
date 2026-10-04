import React, { useState, useEffect, useMemo } from 'react';
import { 
  Crosshair, 
  ArrowLeft, 
  Activity, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon, 
  Zap, 
  Gauge, 
  Clock, 
  Cpu, 
  Plane, 
  Download, 
  Wrench, 
  Sliders, 
  RefreshCw,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { useFleet } from '../context/FleetContext';
import { generateSubsystemSensorReading, generateHistoricalPoints } from '../data/sensorGenerator';

export function AircraftDetail({ onNavigateBack }) {
  const { 
    fleet, 
    selectedAircraftId, 
    setSelectedAircraftId, 
    selectedAircraft, 
    alerts, 
    createWorkOrder, 
    tick 
  } = useFleet();

  const [activeSubsystem, setActiveSubsystem] = useState('engine2');
  const [historyData, setHistoryData] = useState([]);
  const [testRunning, setTestRunning] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Fallback aircraft if undefined
  const currentAircraft = selectedAircraft || fleet[0];

  // Hotspot definitions
  const hotspots = [
    { id: 'avionics', name: 'Avionics & Radar', shortName: 'Avionics', x: '50%', y: '24%' },
    { id: 'hydraulics', name: 'Hydraulics & Controls', shortName: 'Hydraulics', x: '50%', y: '48%' },
    { id: 'engine1', name: 'Engine 1 (Port Turbofan)', shortName: 'Engine 1', x: '38%', y: '72%' },
    { id: 'engine2', name: 'Engine 2 (Starboard)', shortName: 'Engine 2', x: '62%', y: '72%' },
    { id: 'landingGear', name: 'Landing Gear & Brakes', shortName: 'Landing Gear', x: '50%', y: '86%' },
  ];

  // Initialize or re-generate history points when aircraft or subsystem changes
  useEffect(() => {
    if (currentAircraft) {
      const initialPoints = generateHistoricalPoints(currentAircraft, activeSubsystem, 20);
      setHistoryData(initialPoints);
    }
  }, [currentAircraft.id, activeSubsystem]);

  // Append live telemetry point when tick changes
  useEffect(() => {
    if (!currentAircraft) return;

    const reading = generateSubsystemSensorReading(currentAircraft, activeSubsystem, tick);
    const newPoint = {
      ...reading,
      time: new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setHistoryData(prev => {
      const slice = prev.length >= 25 ? prev.slice(1) : prev;
      return [...slice, newPoint];
    });
  }, [tick]);

  // Subsystem info
  const subData = currentAircraft.subsystems?.[activeSubsystem] || { health: 90, status: 'nominal' };

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'critical':
        return { label: 'CRITICAL', bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };
      case 'warning':
      case 'degraded':
        return { label: 'DEGRADED', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
      default:
        return { label: 'NOMINAL', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
    }
  };

  const currentStatusBadge = getStatusBadge(currentAircraft.status);
  const subStatusBadge = getStatusBadge(subData.status);

  // Active predictive alert for this airframe
  const airframeAlert = alerts.find(a => a.tailNumber === currentAircraft.tailNumber);

  // Trigger calibration test simulation
  const handleRunDiagnostics = () => {
    setTestRunning(true);
    setTestResult(null);
    setTimeout(() => {
      setTestRunning(false);
      setTestResult({
        timestamp: new Date().toLocaleTimeString(),
        passed: subData.status !== 'critical',
        message: subData.status === 'critical'
          ? `High frequency harmonic deviation detected in ${activeSubsystem}. Out of MIL-STD-1553 limit.`
          : `Subsystem ${activeSubsystem} passed 24-point BIT (Built-In-Test) matrix.`
      });
    }, 1200);
  };

  // Export telemetry as CSV
  const handleExportCSV = () => {
    const headers = 'Timestamp,Subsystem,Health,EGT,Vibration,OilPressure,HydraulicTemp,HydraulicPressure,AvionicsTemp\n';
    const rows = historyData.map(d => 
      `${d.time},${activeSubsystem},${d.subsystemHealth},${d.egt || ''},${d.vibration || ''},${d.oilPressure || ''},${d.hydraulicTemp || ''},${d.hydraulicPressure || ''},${d.avionicsTemp || ''}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Telemetry_${currentAircraft.tailNumber}_${activeSubsystem}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get current readings
  const latestTelemetry = historyData[historyData.length - 1] || {};

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card: Airframe Selector & Overview */}
      <div className="clean-card p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={onNavigateBack}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors mr-2 px-2.5 py-1 rounded-lg hover:bg-slate-100"
              >
                <ArrowLeft size={14} />
                <span>Return to Overview</span>
              </button>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                DIGITAL TWIN TELEMETRY
              </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
                {currentAircraft.tailNumber}
              </h1>
              <span className="text-sm font-semibold text-slate-600">
                {currentAircraft.type}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStatusBadge.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${currentStatusBadge.dot}`}></span>
                {currentStatusBadge.label}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Station: <strong className="text-slate-700">{currentAircraft.base}</strong> ({currentAircraft.command}) • Location: {currentAircraft.city}
            </p>
          </div>

          {/* Airframe Selector Dropdown & Quick Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 shrink-0">
                Select Airframe:
              </span>
              <select
                value={currentAircraft.id}
                onChange={(e) => setSelectedAircraftId(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {fleet.map((ac) => (
                  <option key={ac.id} value={ac.id}>
                    {ac.tailNumber} — {ac.base} ({ac.status.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-sm transition-colors"
              title="Download Telemetry as CSV"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Quick Parameters Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70">
            <div className="text-[11px] font-medium text-slate-500">Health Index</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold text-slate-900">{currentAircraft.healthScore}%</span>
              <span className="text-[11px] text-slate-400">nominal baseline</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70">
            <div className="text-[11px] font-medium text-slate-500">Flight Hours</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold text-slate-900 font-mono">{currentAircraft.flightHours}</span>
              <span className="text-[11px] text-slate-400">hrs ({currentAircraft.sortiesCount} sorties)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70">
            <div className="text-[11px] font-medium text-slate-500">Last Inspection</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-bold text-slate-800 font-mono">{currentAircraft.lastMaintenance}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Next: {currentAircraft.nextScheduledCheck}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70">
            <div className="text-[11px] font-medium text-slate-500">Data Bus Link</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-emerald-700">MIL-STD-1553B Online</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Telemetry latency: 12ms</div>
          </div>
        </div>
      </div>

      {/* Main Digital Twin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 2D Interactive Aircraft Schematic (5 Cols) */}
        <div className="lg:col-span-5 clean-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Crosshair size={16} className="text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  2D Airframe Schematic & Hotspots
                </h2>
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                Click zone to inspect
              </span>
            </div>

            {/* Interactive Vector Graphic Aircraft Container */}
            <div className="relative w-full aspect-[4/5] max-w-sm mx-auto my-4 bg-slate-50/60 rounded-2xl border border-slate-200/70 flex items-center justify-center p-4 overflow-hidden select-none">
              
              {/* Subtle background radar circles */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-64 h-64 rounded-full border border-dashed border-indigo-500"></div>
                <div className="absolute w-44 h-44 rounded-full border border-indigo-400"></div>
                <div className="absolute w-24 h-24 rounded-full border border-indigo-400"></div>
              </div>

              {/* 2D Fighter Jet SVG Blueprint */}
              <svg 
                viewBox="0 0 400 500" 
                className="w-full h-full max-h-[380px] drop-shadow-sm transition-all"
              >
                {/* Airframe Body Outlines */}
                <g fill="#ffffff" stroke="#94a3b8" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
                  {/* Main Fuselage & Radome */}
                  <path d="M200 40 C 190 70, 185 120, 185 180 L 140 250 L 140 280 L 180 270 L 180 380 L 170 410 L 185 410 L 190 390 L 210 390 L 215 410 L 230 410 L 220 380 L 220 270 L 260 280 L 260 250 L 215 180 C 215 120, 210 70, 200 40 Z" fill="#f8fafc" />
                  
                  {/* Delta Wings Left & Right */}
                  <path d="M185 210 L 60 320 L 60 350 L 140 330 L 180 320 Z" fill="#f1f5f9" />
                  <path d="M215 210 L 340 320 L 340 350 L 260 330 L 220 320 Z" fill="#f1f5f9" />
                  
                  {/* Canards (Forward Winglets) */}
                  <path d="M188 150 L 130 180 L 130 195 L 186 175 Z" fill="#e2e8f0" />
                  <path d="M212 150 L 270 180 L 270 195 L 214 175 Z" fill="#e2e8f0" />
                  
                  {/* Twin Vertical Stabilizers */}
                  <path d="M165 340 L 140 430 L 160 430 L 175 360 Z" fill="#cbd5e1" strokeWidth="2" />
                  <path d="M235 340 L 260 430 L 240 430 L 225 360 Z" fill="#cbd5e1" strokeWidth="2" />

                  {/* Cockpit Canopy */}
                  <ellipse cx="200" cy="115" rx="10" ry="32" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                  
                  {/* Port Engine Nacelle */}
                  <rect x="168" y="320" width="22" height="75" rx="8" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
                  
                  {/* Starboard Engine Nacelle */}
                  <rect x="210" y="320" width="22" height="75" rx="8" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
                </g>

                {/* Internal Structural Guide Lines */}
                <g stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3">
                  <line x1="200" y1="40" x2="200" y2="440" />
                  <line x1="60" y1="335" x2="340" y2="335" />
                  <line x1="130" y1="187" x2="270" y2="187" />
                </g>
              </svg>

              {/* Clickable Hotspots Overlay */}
              {hotspots.map((hs) => {
                const isSelected = activeSubsystem === hs.id;
                const hsSubData = currentAircraft.subsystems?.[hs.id] || { status: 'nominal', health: 95 };
                const hsStatus = hsSubData.status;

                let markerColor = 'bg-emerald-500 text-white';
                let ringColor = 'ring-emerald-200';
                if (hsStatus === 'critical') {
                  markerColor = 'bg-rose-500 text-white';
                  ringColor = 'ring-rose-200';
                } else if (hsStatus === 'warning' || hsStatus === 'degraded') {
                  markerColor = 'bg-amber-500 text-white';
                  ringColor = 'ring-amber-200';
                }

                return (
                  <button
                    key={hs.id}
                    onClick={() => setActiveSubsystem(hs.id)}
                    style={{ left: hs.x, top: hs.y }}
                    className={`
                      absolute -translate-x-1/2 -translate-y-1/2 group flex items-center justify-center transition-all z-20
                      ${isSelected ? 'scale-125' : 'hover:scale-110'}
                    `}
                    title={`${hs.name} (Health: ${hsSubData.health || 95}%)`}
                  >
                    {/* Pulsing ring */}
                    <span className={`absolute w-8 h-8 rounded-full ${markerColor} opacity-20 animate-ping`}></span>
                    
                    {/* Hotspot Core Pin */}
                    <span className={`
                      relative w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shadow-md
                      ${markerColor} ring-4 ${isSelected ? 'ring-indigo-400' : ringColor}
                    `}>
                      {hs.id === 'engine1' ? 'E1' : hs.id === 'engine2' ? 'E2' : hs.id === 'hydraulics' ? 'HY' : hs.id === 'avionics' ? 'AV' : 'LG'}
                    </span>

                    {/* Tooltip Badge */}
                    <span className={`
                      absolute left-1/2 -translate-x-1/2 bottom-8 hidden group-hover:block whitespace-nowrap
                      bg-slate-900 text-white text-[10px] font-semibold px-2 py-1 rounded shadow-md z-30 pointer-events-none
                    `}>
                      {hs.name} • {hsSubData.health || 95}%
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Hotspot Quick Select Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-2">
              {hotspots.map((hs) => {
                const isSelected = activeSubsystem === hs.id;
                const hsSub = currentAircraft.subsystems?.[hs.id] || { status: 'nominal', health: 95 };
                return (
                  <button
                    key={hs.id}
                    onClick={() => setActiveSubsystem(hs.id)}
                    className={`
                      px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all
                      ${isSelected 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'}
                    `}
                  >
                    <span className="truncate">{hs.shortName}</span>
                    <span className={`
                      w-2 h-2 rounded-full shrink-0
                      ${hsSub.status === 'critical' ? 'bg-rose-500' : hsSub.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}
                    `}></span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subsystem Health Indicator Card */}
          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div className="flex items-center justify-between text-slate-700 font-semibold mb-1">
              <span>Selected Component:</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${subStatusBadge.bg}`}>
                {subStatusBadge.label}
              </span>
            </div>
            <div className="text-slate-600 font-medium">
              {hotspots.find(h => h.id === activeSubsystem)?.name}
            </div>
          </div>
        </div>

        {/* Right: Subsystem Deep-Dive & Real-Time Telemetry (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Subsystem Status & RUL Header Card */}
          <div className="clean-card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-indigo-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    {hotspots.find(h => h.id === activeSubsystem)?.name} Telemetry
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Subsystem Health: <strong>{subData.health || 92}%</strong> • Continuous Live Sensor Stream
                </p>
              </div>

              {/* Remaining Useful Life (RUL) Gauge Pill */}
              <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <Gauge size={22} className={subData.rulHours < 80 ? 'text-rose-600' : 'text-indigo-600'} />
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Remaining Useful Life (RUL)
                  </div>
                  <div className="text-sm font-bold font-mono text-slate-900">
                    ~{subData.rulHours ? `${subData.rulHours} Flight Hours` : '1,200+ Nominal Hrs'}
                  </div>
                </div>
              </div>
            </div>

            {/* Instantaneous Sensor Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              
              {/* Metric 1 */}
              <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-500 block">
                  {activeSubsystem.startsWith('engine') ? 'Exhaust Gas Temp' : activeSubsystem === 'hydraulics' ? 'Line Pressure' : activeSubsystem === 'avionics' ? 'Core Temperature' : 'Actuator Load'}
                </span>
                <span className="text-lg font-bold text-slate-900 font-mono mt-0.5 block">
                  {activeSubsystem.startsWith('engine') 
                    ? `${latestTelemetry.egt || subData.egt || 648}°C` 
                    : activeSubsystem === 'hydraulics' 
                      ? `${latestTelemetry.hydraulicPressure || subData.pressure || 3000} psi`
                      : activeSubsystem === 'avionics'
                        ? `${latestTelemetry.avionicsTemp || subData.coreTemp || 44}°C`
                        : `${subData.actuatorLoad || 82}%`}
                </span>
                <span className="text-[10px] text-slate-400">
                  {activeSubsystem.startsWith('engine') ? 'Max limit: 800°C' : activeSubsystem === 'hydraulics' ? 'Nominal: 3000 psi' : 'Thermal envelope nominal'}
                </span>
              </div>

              {/* Metric 2 */}
              <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-500 block">
                  {activeSubsystem.startsWith('engine') ? 'Vibration Index' : activeSubsystem === 'hydraulics' ? 'Fluid Temp' : activeSubsystem === 'avionics' ? 'Bus Error Rate' : 'Brake Disc Wear'}
                </span>
                <span className="text-lg font-bold text-slate-900 font-mono mt-0.5 block">
                  {activeSubsystem.startsWith('engine') 
                    ? `${latestTelemetry.vibration || subData.vibration || 1.6} mm/s` 
                    : activeSubsystem === 'hydraulics' 
                      ? `${latestTelemetry.hydraulicTemp || subData.temp || 71}°C`
                      : activeSubsystem === 'avionics'
                        ? `${subData.busErrorRate || 0.01}%`
                        : `${subData.brakeWear || 18}%`}
                </span>
                <span className="text-[10px] text-slate-400">
                  {activeSubsystem.startsWith('engine') ? 'Warning threshold: 4.5' : 'Calibrated nominal'}
                </span>
              </div>

              {/* Metric 3 */}
              <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-500 block">
                  {activeSubsystem.startsWith('engine') ? 'Oil Pressure' : activeSubsystem === 'hydraulics' ? 'Flow Response' : activeSubsystem === 'avionics' ? 'Signal-to-Noise' : 'Strut Pressure'}
                </span>
                <span className="text-lg font-bold text-slate-900 font-mono mt-0.5 block">
                  {activeSubsystem.startsWith('engine') 
                    ? `${latestTelemetry.oilPressure || subData.oilPressure || 68} psi` 
                    : activeSubsystem === 'hydraulics' 
                      ? `${subData.responseTime || 120} ms`
                      : activeSubsystem === 'avionics'
                        ? `${subData.signalIntegrity || 99.8}%`
                        : `${subData.tirePressure || 198} psi`}
                </span>
                <span className="text-[10px] text-slate-400">
                  {activeSubsystem.startsWith('engine') ? 'Normal: 60-75 psi' : 'Spec certified'}
                </span>
              </div>

              {/* Metric 4 */}
              <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-500 block">
                  Telemetry Integrity
                </span>
                <span className="text-lg font-bold text-emerald-600 font-mono mt-0.5 block">
                  99.98%
                </span>
                <span className="text-[10px] text-slate-400">
                  0 packet drops
                </span>
              </div>

            </div>

            {/* Live-Updating Line Chart (Recharts) */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-800">
                    Live Telemetry Stream: {activeSubsystem.startsWith('engine') ? 'EGT (°C) & Vibration (mm/s)' : activeSubsystem === 'hydraulics' ? 'Hydraulic Fluid Temp & Pressure' : 'Thermal & Signal Integrity'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  Sample: 1.5s
                </span>
              </div>

              {/* Clean White Recharts Container */}
              <div className="w-full h-64 bg-slate-50/40 rounded-xl p-2 border border-slate-200/60">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 10, fill: '#94a3b8' }} 
                      stroke="#cbd5e1" 
                    />
                    <YAxis 
                      yAxisId="left"
                      tick={{ fontSize: 10, fill: '#94a3b8' }} 
                      stroke="#cbd5e1" 
                      domain={['auto', 'auto']}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      tick={{ fontSize: 10, fill: '#94a3b8' }} 
                      stroke="#cbd5e1" 
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        borderColor: '#e2e8f0', 
                        borderRadius: '0.75rem',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        fontSize: '11px',
                        color: '#1e293b'
                      }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    
                    {activeSubsystem.startsWith('engine') ? (
                      <>
                        <Line 
                          yAxisId="left" 
                          type="monotone" 
                          dataKey="egt" 
                          name="EGT (°C)" 
                          stroke="#4f46e5" 
                          strokeWidth={2} 
                          dot={false} 
                          isAnimationActive={false} 
                        />
                        <Line 
                          yAxisId="right" 
                          type="monotone" 
                          dataKey="vibration" 
                          name="Vibration (mm/s)" 
                          stroke="#f59e0b" 
                          strokeWidth={2} 
                          dot={false} 
                          isAnimationActive={false} 
                        />
                      </>
                    ) : activeSubsystem === 'hydraulics' ? (
                      <>
                        <Line 
                          yAxisId="left" 
                          type="monotone" 
                          dataKey="hydraulicPressure" 
                          name="Pressure (psi)" 
                          stroke="#0ea5e9" 
                          strokeWidth={2} 
                          dot={false} 
                          isAnimationActive={false} 
                        />
                        <Line 
                          yAxisId="right" 
                          type="monotone" 
                          dataKey="hydraulicTemp" 
                          name="Fluid Temp (°C)" 
                          stroke="#ec4899" 
                          strokeWidth={2} 
                          dot={false} 
                          isAnimationActive={false} 
                        />
                      </>
                    ) : (
                      <>
                        <Line 
                          yAxisId="left" 
                          type="monotone" 
                          dataKey="avionicsTemp" 
                          name="Temp (°C)" 
                          stroke="#6366f1" 
                          strokeWidth={2} 
                          dot={false} 
                          isAnimationActive={false} 
                        />
                        <Line 
                          yAxisId="right" 
                          type="monotone" 
                          dataKey="subsystemHealth" 
                          name="Health (%)" 
                          stroke="#10b981" 
                          strokeWidth={2} 
                          dot={false} 
                          isAnimationActive={false} 
                        />
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Diagnostic Commentary & Action Bar */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                {subData.status === 'critical' ? (
                  <span className="text-rose-700 font-semibold flex items-center gap-1.5">
                    <AlertOctagon size={15} />
                    Critical anomaly detected! Component scheduled for immediate replacement.
                  </span>
                ) : subData.status === 'warning' ? (
                  <span className="text-amber-700 font-semibold flex items-center gap-1.5">
                    <AlertTriangle size={15} />
                    Degradation trend active. Predictive intervention planned within ~{subData.rulHours} hrs.
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 size={15} />
                    Telemetry within nominal tolerances. Next routine check in 18 days.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunDiagnostics}
                  disabled={testRunning}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={13} className={testRunning ? 'animate-spin' : ''} />
                  <span>{testRunning ? 'Running BIT...' : 'Run Diagnostics BIT'}</span>
                </button>

                {airframeAlert && (
                  <button
                    onClick={() => createWorkOrder(airframeAlert)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <Wrench size={13} />
                    <span>Create Work Order</span>
                  </button>
                )}
              </div>
            </div>

            {/* Diagnostic Result Banner if executed */}
            {testResult && (
              <div className={`mt-3 p-3 rounded-xl text-xs border ${testResult.passed ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
                <strong>BIT Diagnostic Run ({testResult.timestamp}):</strong> {testResult.message}
              </div>
            )}
          </div>

          {/* Maintenance Records & Anomaly History */}
          <div className="clean-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Recent Subsystem Technical Log Entries
              </h3>
              <span className="text-[11px] text-slate-400">
                Source: e-Logbook System
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-800">
                    Sortie #312 Post-Flight Telemetry Validation
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Engine vibration peaks remained under 2.4 mm/s during supersonic cruise phase.
                  </div>
                </div>
                <span className="font-mono text-[10px] text-slate-400 shrink-0">
                  2026-10-02
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-800">
                    Hydraulic System B Pressure Bleed & Filter Sweep
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Replaced primary line filter element HF-502. Line pressure stabilized at 3,000 psi nominal.
                  </div>
                </div>
                <span className="font-mono text-[10px] text-slate-400 shrink-0">
                  2026-09-18
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

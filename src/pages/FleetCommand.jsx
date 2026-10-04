import React, { useState } from 'react';
import { 
  Plane, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  AlertOctagon, 
  ChevronRight, 
  Activity, 
  Shield, 
  Building2, 
  MapPin, 
  CheckCircle2,
  Boxes
} from 'lucide-react';
import { useFleet } from '../context/FleetContext';
import { AlertTicker } from '../components/layout/AlertTicker';
import { IAF_COMMANDS } from '../data/iafAirStationsData';

export function FleetCommand({ onNavigateToTwin, onNavigateToAlerts, onNavigateToStations, onNavigateToMatrix }) {
  const { 
    fleet, 
    kpis, 
    selectedAircraftId, 
    setSelectedAircraftId,
    selectedAircraft,
    isScheduleOptimized 
  } = useFleet();

  const [activeTab, setActiveTab] = useState('sensors');

  // Key IAF Operational Stations
  const popularStations = [
    { code: 'AMB', name: 'Ambala AFS', command: 'WAC', type: 'Rafale Hub' },
    { code: 'HSM', name: 'Hasimara AFS', command: 'EAC', type: '101 Sqn' },
    { code: 'HLW', name: 'Halwara AFS', command: 'WAC', type: 'Su-30MKI' },
    { code: 'JOD', name: 'Jodhpur AFS', command: 'SWAC', type: 'Desert Shield' },
    { code: 'SLR', name: 'Sulur AFS', command: 'SAC', type: 'Tejas LCA' },
    { code: 'GWL', name: 'Gwalior AFS', command: 'CAC', type: 'Mirage 2000' },
    { code: 'LEH', name: 'Leh AFS', command: 'WAC', type: 'High Altitude' },
    { code: 'OJH', name: 'Ojhar AFS', command: 'TMC', type: '11 BRD Depot' }
  ];

  const handleStationClick = (stationName) => {
    const ac = fleet.find(a => a.base === stationName);
    if (ac) {
      setSelectedAircraftId(ac.id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Card (matching Help Me To... in reference image) */}
      <div className="clean-card p-5 space-y-4">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Fleet Management
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              <span className="text-xs font-medium text-slate-600">
                MoD Smart India Hackathon PS 26249
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">Readiness:</span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                {kpis.availabilityPercentage}% Available
              </span>
            </div>
          </div>

          {/* Action Segment Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-700 mr-1">
              Command Views:
            </span>

            <button
              onClick={() => onNavigateToMatrix && onNavigateToMatrix()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition-colors"
            >
              <Boxes size={14} />
              <span>Browse All 24 Airframes</span>
            </button>

            <button
              onClick={() => onNavigateToStations && onNavigateToStations()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
            >
              <Building2 size={14} />
              <span>Explore 70 IAF Stations</span>
            </button>

            <span className="text-slate-400 text-xs px-1">or</span>

            <button
              onClick={() => onNavigateToAlerts && onNavigateToAlerts()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
            >
              <AlertTriangle size={14} className="text-amber-600" />
              <span>Predictive Alerts ({kpis.predictedFailuresCount})</span>
            </button>

            <button
              onClick={() => onNavigateToTwin && onNavigateToTwin()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
            >
              <Activity size={14} className="text-indigo-600" />
              <span>Digital Twin ({selectedAircraftId})</span>
            </button>
          </div>
        </div>

        {/* Operational Stations Quick Strip */}
        <div className="pt-3 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-500 mb-2">
            Key Operational Stations
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {popularStations.map((st) => (
              <button
                key={st.code}
                onClick={() => handleStationClick(st.name)}
                className="px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 text-xs font-medium text-slate-700 transition-colors flex items-center gap-1.5"
              >
                <span className="font-bold text-indigo-600 font-mono">{st.code}</span>
                <span>- {st.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Health Telemetry Feed */}
      <AlertTicker 
        onSelectAircraft={(tail) => setSelectedAircraftId(tail)}
        onNavigateAlerts={onNavigateToAlerts}
      />

      {/* 4 Clean Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="clean-card p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Fleet Availability
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {kpis.availabilityPercentage}%
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              +13.4% target
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${kpis.availabilityPercentage}%` }}
            ></div>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>Operational: {kpis.operationalCount}/24</span>
            <span>Degraded: {kpis.degradedCount}</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="clean-card p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Aircraft Grounded
            </span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <AlertOctagon size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold tracking-tight ${kpis.groundedCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {kpis.groundedCount}
            </span>
            <span className="text-xs text-slate-500">
              units in depot
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Ambala (1) • Jodhpur (1) • Chabua (1)</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>Depot Spares: Staged</span>
            <span>Turnaround: 24h</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="clean-card p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Predicted Failures (7d)
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-600 tracking-tight">
              {kpis.predictedFailuresCount}
            </span>
            <span className="text-xs font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              AI Pre-empted
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Clock size={13} className="text-amber-600" />
            <span>Avg Advance Notice: 48.2 hrs</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>Bearings: 2</span>
            <span>Hydraulics: 2</span>
            <span>Avionics: 1</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="clean-card p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Downtime Saved
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-600 tracking-tight">
              {kpis.downtimeSaved} <span className="text-lg font-medium text-slate-500">hrs</span>
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <CheckCircle size={13} className="text-emerald-600" />
            <span>₹4.2 Cr Mission Cost Avoided</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>Mean MTTR: -38%</span>
            <span>Asset Utility: 89%</span>
          </div>
        </div>
      </div>

      {/* Selected Airframe Spotlight (styled exactly like Selected Airport in reference image) */}
      <div className="clean-card p-6 space-y-4">
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Selected Airframe Spotlight
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {selectedAircraft.tailNumber} ({selectedAircraft.type})
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {selectedAircraft.commandCode}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  selectedAircraft.status === 'operational' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  selectedAircraft.status === 'degraded' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                  'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  Health: {selectedAircraft.healthScore}%
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <MapPin size={12} className="text-slate-400" />
                <span>Stationed at <strong>{selectedAircraft.base}</strong> ({selectedAircraft.city})</span>
                <span>• Sorties: {selectedAircraft.sortiesCount}</span>
                <span>• Flight Hours: {selectedAircraft.flightHours} hrs</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTwin && onNavigateToTwin()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors shrink-0 shadow-sm self-start sm:self-auto"
            >
              <Activity size={14} />
              <span>Launch 2D Digital Twin</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Quick Telemetry Row */}
        <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-xs font-medium text-slate-500">ENGINE 1 EGT</div>
            <div className="text-base font-bold text-slate-800 font-mono mt-0.5">
              {selectedAircraft.subsystems.engine1.egt}°C
            </div>
            <div className="text-[10px] text-slate-400">Baseline 648°C</div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-500">ENGINE 2 EGT</div>
            <div className={`text-base font-bold font-mono mt-0.5 ${
              selectedAircraft.subsystems.engine2.egt > 720 ? 'text-amber-600' : 'text-slate-800'
            }`}>
              {selectedAircraft.subsystems.engine2.egt}°C
            </div>
            <div className="text-[10px] text-slate-400">
              {selectedAircraft.subsystems.engine2.status === 'warning' ? 'Thermal Anomaly' : 'Nominal'}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-500">E2 VIBRATION</div>
            <div className={`text-base font-bold font-mono mt-0.5 ${
              selectedAircraft.subsystems.engine2.vibration > 4.0 ? 'text-amber-600' : 'text-slate-800'
            }`}>
              {selectedAircraft.subsystems.engine2.vibration} mm/s
            </div>
            <div className="text-[10px] text-slate-400">Limit: 5.0 mm/s</div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-500">HYD PRESSURE</div>
            <div className={`text-base font-bold font-mono mt-0.5 ${
              selectedAircraft.subsystems.hydraulics.pressure < 2800 ? 'text-rose-600' : 'text-slate-800'
            }`}>
              {selectedAircraft.subsystems.hydraulics.pressure} psi
            </div>
            <div className="text-[10px] text-slate-400">Target 3000 psi</div>
          </div>

          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <div className="text-xs font-medium text-slate-500">REMAINING LIFE</div>
            <div className={`text-base font-bold font-mono mt-0.5 ${
              selectedAircraft.subsystems.engine2.rulHours < 100 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {selectedAircraft.subsystems.engine2.rulHours} hrs
            </div>
            <div className="text-[10px] text-slate-400">Calculated RUL</div>
          </div>
        </div>

        {/* Sub-tabs row */}
        <div>
          <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
            {[
              { id: 'sensors', label: 'Telemetry Diagnostics' },
              { id: 'anomaly', label: 'AI Anomaly Analysis' },
              { id: 'orders', label: 'Maintenance Schedule' },
              { id: 'station', label: 'Station Logistics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sub-tab content */}
          <div className="pt-3 text-xs text-slate-600">
            {activeTab === 'sensors' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="font-semibold text-slate-800 mb-1">Avionics System</div>
                  <div className="text-slate-600">Core Temp: {selectedAircraft.subsystems.avionics.coreTemp}°C</div>
                  <div className="text-slate-600">MIL-STD-1553 Bus Error Rate: {selectedAircraft.subsystems.avionics.busErrorRate}%</div>
                  <div className="text-emerald-700 font-medium mt-1">Status: Nominal</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="font-semibold text-slate-800 mb-1">Hydraulics Assembly</div>
                  <div className="text-slate-600">System Temp: {selectedAircraft.subsystems.hydraulics.temp}°C</div>
                  <div className="text-slate-600">Valve Response Time: {selectedAircraft.subsystems.hydraulics.responseTime} ms</div>
                  <div className="text-slate-600">Filter DP: Nominal</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="font-semibold text-slate-800 mb-1">Landing Gear Assembly</div>
                  <div className="text-slate-600">Brake Carbon Wear: {selectedAircraft.subsystems.landingGear.brakeWear}%</div>
                  <div className="text-slate-600">Tire Pressure: {selectedAircraft.subsystems.landingGear.tirePressure} psi</div>
                  <div className="text-slate-600">Actuator Load: {selectedAircraft.subsystems.landingGear.actuatorLoad}%</div>
                </div>
              </div>
            )}

            {activeTab === 'anomaly' && (
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle size={15} className="text-amber-600" />
                  <span>AI Predictive Flag: {selectedAircraft.activeAlert || 'No active critical alerts for this airframe'}</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  LSTM Telemetry Anomaly Detector identified subtle non-linear drift in Engine 2 high-frequency harmonic vibration. Recommended preventive borescope check and bearing race inspection within next 42 flight hours.
                </p>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Next Scheduled A-Check Inspection</div>
                  <div className="text-slate-500">Date: {selectedAircraft.nextScheduledCheck} • Lead Depot: {selectedAircraft.base} Hangar Bay 2</div>
                </div>
                <button
                  onClick={() => onNavigateToAlerts && onNavigateToAlerts()}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs"
                >
                  Create Work Order
                </button>
              </div>
            )}

            {activeTab === 'station' && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Base Logistics Node: {selectedAircraft.base}</div>
                  <div className="text-slate-500">Command: {selectedAircraft.command} • Location: {selectedAircraft.city}</div>
                </div>
                <button
                  onClick={() => onNavigateToStations && onNavigateToStations()}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  View Station Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Command Readiness Overview Section */}
      <div className="clean-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Shield size={16} className="text-indigo-600" />
              IAF Operational Command Readiness
            </h3>
            <p className="text-xs text-slate-500">
              Fleet availability and active station status across all 6 defense commands
            </p>
          </div>
          <button
            onClick={() => onNavigateToStations && onNavigateToStations()}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All 70 Stations</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {IAF_COMMANDS.map((cmd) => (
            <div key={cmd.code} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-900">{cmd.code}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-700">
                  {cmd.count} AFS
                </span>
              </div>
              <div className="text-[11px] text-slate-600 font-medium truncate">
                {cmd.name.replace(' Air Command', '')}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                92% Readiness
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Plane, 
  AlertTriangle, 
  Search, 
  ChevronRight, 
  MapPin, 
  Activity, 
  Filter,
  CheckCircle2,
  AlertOctagon,
  ArrowRight
} from 'lucide-react';
import { useFleet } from '../context/FleetContext';

export function AirframeMatrix({ onNavigateToTwin }) {
  const { fleet, selectedAircraftId, setSelectedAircraftId } = useFleet();
  const [commandFilter, setCommandFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter fleet
  const filteredFleet = fleet.filter((ac) => {
    const matchesCommand = commandFilter === 'ALL' || ac.commandCode === commandFilter;
    const matchesStatus = statusFilter === 'ALL' || ac.status === statusFilter;
    const matchesSearch = 
      ac.tailNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ac.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ac.base.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ac.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCommand && matchesStatus && matchesSearch;
  });

  const handleTileClick = (aircraft) => {
    setSelectedAircraftId(aircraft.id);
  };

  const handleInspect = (aircraftId) => {
    setSelectedAircraftId(aircraftId);
    if (onNavigateToTwin) {
      onNavigateToTwin();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Card */}
      <div className="clean-card p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-200/60">
                IAF ACTIVE INVENTORY
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-xs">
                24 Monitored Combat Airframes
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Airframe Fleet Matrix
            </h1>
            
            <p className="text-sm text-slate-500 max-w-3xl leading-relaxed">
              Complete status, real-time sensor parameters, and health degradation indicators for all 24 deployed fighter aircraft across Western, Eastern, South Western, Central, and Southern Commands.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>17 Operational • 4 Degraded • 3 Grounded</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar (matching NextSimFlight clean input + pill buttons) */}
      <div className="clean-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search airframe (e.g. KA-2417), type (Rafale, Su-30), base (Ambala, Hasimara)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Status Pill Filters */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs shrink-0 self-start md:self-auto">
            {[
              { id: 'ALL', label: 'All Status' },
              { id: 'operational', label: 'Operational' },
              { id: 'degraded', label: 'Degraded' },
              { id: 'critical', label: 'Grounded' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  statusFilter === st.id
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Command Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mr-1">
            COMMAND:
          </span>
          {[
            { id: 'ALL', label: 'All Commands (24)' },
            { id: 'WAC', label: 'Western (8)' },
            { id: 'SWAC', label: 'South Western (8)' },
            { id: 'EAC', label: 'Eastern (4)' },
            { id: 'CAC', label: 'Central (2)' },
            { id: 'SAC', label: 'Southern (2)' }
          ].map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => setCommandFilter(cmd.id)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                commandFilter === cmd.id
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium'
              }`}
            >
              {cmd.label}
            </button>
          ))}
        </div>
      </div>

      {/* 24 Airframe Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredFleet.map((aircraft) => {
          const isSelected = selectedAircraftId === aircraft.id;

          // Health Status Badge Style
          let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          let statusText = 'Optimal';
          if (aircraft.status === 'degraded') {
            badgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
            statusText = 'Degraded';
          } else if (aircraft.status === 'critical') {
            badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
            statusText = 'Grounded';
          }

          return (
            <div
              key={aircraft.id}
              onClick={() => handleTileClick(aircraft)}
              className={`
                bg-white rounded-2xl border p-4 cursor-pointer transition-all duration-200 shadow-sm relative
                ${isSelected 
                  ? 'border-indigo-400 ring-2 ring-indigo-100 bg-indigo-50/15' 
                  : 'border-slate-200/90 hover:border-indigo-200 hover:shadow-card-hover'}
              `}
            >
              {/* Header: Tail Number + Base + Health Pill */}
              <div className="flex items-start justify-between mb-1">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-slate-900 tracking-tight">
                      {aircraft.tailNumber}
                    </span>
                    <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.2 rounded-md">
                      {aircraft.commandCode}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mt-0.5 flex items-center gap-1">
                    <MapPin size={11} className="text-slate-400 shrink-0" />
                    <span className="truncate">{aircraft.base}</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 truncate">
                    {aircraft.type}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
                    {aircraft.healthScore}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {statusText}
                  </span>
                </div>
              </div>

              {/* Subsystem Tags Row (like DEL, GND, TWR pills) */}
              <div className="flex items-center gap-1.5 my-3 flex-wrap">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  aircraft.subsystems.engine1.status === 'nominal' ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  ENG 1
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  aircraft.subsystems.engine2.status === 'nominal' ? 'bg-indigo-50 text-indigo-700' :
                  aircraft.subsystems.engine2.status === 'warning' ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-700'
                }`}>
                  ENG 2
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  aircraft.subsystems.hydraulics.status === 'nominal' ? 'bg-indigo-50 text-indigo-700' :
                  aircraft.subsystems.hydraulics.status === 'warning' ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-700'
                }`}>
                  HYD
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  AVIO
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  GEAR
                </span>
              </div>

              {/* 3-Column Clean Stats Box */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 grid grid-cols-3 gap-2 text-center text-xs mb-3">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">E1 EGT</div>
                  <div className="font-semibold text-slate-800 font-mono">
                    {aircraft.subsystems.engine1.egt}°C
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">E2 VIB</div>
                  <div className={`font-semibold font-mono ${
                    aircraft.subsystems.engine2.vibration > 4.0 ? 'text-amber-600' : 'text-slate-800'
                  }`}>
                    {aircraft.subsystems.engine2.vibration}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">HYD PSI</div>
                  <div className={`font-semibold font-mono ${
                    aircraft.subsystems.hydraulics.pressure < 2800 ? 'text-rose-600' : 'text-slate-800'
                  }`}>
                    {aircraft.subsystems.hydraulics.pressure}
                  </div>
                </div>
              </div>

              {/* Warning message if degraded or critical */}
              {aircraft.activeAlert && (
                <div className="p-2 rounded-lg bg-amber-50/90 border border-amber-200 text-[11px] text-amber-800 font-medium mb-3 flex items-start gap-1.5">
                  <AlertTriangle size={13} className="text-amber-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 leading-tight">{aircraft.activeAlert}</span>
                </div>
              )}

              {/* Bottom Action Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400 font-medium">
                  {aircraft.flightHours} Flight Hrs
                </span>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInspect(aircraft.id);
                  }}
                  className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                >
                  <span>Digital Twin</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

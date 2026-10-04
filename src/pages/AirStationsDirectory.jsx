import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Compass, 
  Search, 
  Filter, 
  ExternalLink, 
  Plane, 
  Shield, 
  ChevronRight,
  Info,
  Navigation
} from 'lucide-react';
import { IAF_AIR_STATIONS, IAF_COMMANDS } from '../data/iafAirStationsData';
import { useFleet } from '../context/FleetContext';

export function AirStationsDirectory({ onSelectStation, onNavigateToFleet }) {
  const { fleet, setSelectedAircraftId } = useFleet();
  const [selectedCommand, setSelectedCommand] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);

  // Filter stations
  const filteredStations = IAF_AIR_STATIONS.filter(station => {
    const matchesCommand = selectedCommand === 'ALL' || station.commandCode === selectedCommand;
    const matchesSearch = 
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.command.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCommand && matchesSearch;
  });

  // Calculate fleet deployment per station
  const getDeployedAirframes = (stationName) => {
    return fleet.filter(ac => ac.base === stationName);
  };

  const handleStationClick = (station) => {
    setSelectedStation(station);
    if (onSelectStation) {
      onSelectStation(station.name);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="clean-card p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-200/60 flex items-center gap-1.5">
                <Shield size={12} className="text-indigo-600" />
                INDIAN AIR FORCE BASE DIRECTORY
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-xs">
                70 Official Stations Across 6 Commands
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Indian Air Force Operational Commands & Air Stations
            </h1>
            
            <p className="text-sm text-slate-500 max-w-3xl leading-relaxed">
              Complete geo-spatial directory of all 70 IAF Air Force Stations categorized by operational command with coordinates, active wings, and assigned fleet assets.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium flex items-center gap-2">
              <Navigation size={14} className="text-indigo-600" />
              <span>Coordinated Defence Grid: <strong>70 AFS Active</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Command Summary Cards (6 Commands) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {IAF_COMMANDS.map((cmd) => (
          <button
            key={cmd.code}
            onClick={() => setSelectedCommand(selectedCommand === cmd.code ? 'ALL' : cmd.code)}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              selectedCommand === cmd.code
                ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-100 shadow-sm'
                : 'bg-white border-slate-200/90 hover:border-indigo-200 hover:shadow-card'
            }`}
          >
            <div className="text-xs font-bold text-slate-900 mb-0.5 flex items-center justify-between">
              <span>{cmd.code}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${cmd.color}`}>
                {cmd.count}
              </span>
            </div>
            <div className="text-[11px] font-medium text-slate-700 truncate">
              {cmd.name.replace(' Air Command', '').replace(' Commands', '')}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">
              HQ: {cmd.hq}
            </div>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="clean-card p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Command Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
            COMMAND:
          </span>
          <button
            onClick={() => setSelectedCommand('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedCommand === 'ALL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Commands (70)
          </button>
          {IAF_COMMANDS.map((cmd) => (
            <button
              key={cmd.code}
              onClick={() => setSelectedCommand(cmd.code)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCommand === cmd.code
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cmd.code} ({cmd.count})
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search station, city, state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Air Stations Grid matching the VATSIM reference style */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 size={16} className="text-indigo-600" />
              Air Force Stations ({filteredStations.length} Showing)
            </h2>
            <span className="text-xs text-slate-500 hidden sm:inline">
              • Official IAF stations with latitude & longitude coordinates
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStations.map((station) => {
            const deployedAirframes = getDeployedAirframes(station.name);
            const isSelected = selectedStation?.id === station.id;

            return (
              <div
                key={station.id}
                onClick={() => handleStationClick(station)}
                className={`clean-card p-4 hover:shadow-card-hover transition-all cursor-pointer ${
                  isSelected ? 'border-indigo-400 ring-2 ring-indigo-100 bg-indigo-50/10' : ''
                }`}
              >
                {/* Header: Station Name + Command Badge */}
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                      <MapPin size={15} className="text-indigo-600 shrink-0" />
                      {station.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {station.city}, {station.state}
                    </p>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {station.commandCode}
                  </span>
                </div>

                {/* Command & Wings Row */}
                <div className="my-2.5 text-xs text-slate-600 flex items-center justify-between">
                  <span className="font-medium text-slate-700 truncate pr-2">
                    {station.activeWings}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    Rwy: {station.runways}
                  </span>
                </div>

                {/* 2-Column Coordinates Box */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 grid grid-cols-2 gap-2 text-xs mb-3 font-mono">
                  <div>
                    <div className="text-[10px] text-slate-400 font-sans font-medium">LATITUDE (DMS)</div>
                    <div className="font-semibold text-slate-800 text-[11px] truncate">
                      {station.dmsLat}
                    </div>
                    <div className="text-[10px] text-indigo-600 font-medium">
                      {station.lat.toFixed(4)}°
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-sans font-medium">LONGITUDE (DMS)</div>
                    <div className="font-semibold text-slate-800 text-[11px] truncate">
                      {station.dmsLon}
                    </div>
                    <div className="text-[10px] text-indigo-600 font-medium">
                      {station.lon.toFixed(4)}°
                    </div>
                  </div>
                </div>

                {/* Bottom Footer: Assigned Fleet Asset count & Action */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  {deployedAirframes.length > 0 ? (
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] flex items-center gap-1">
                      <Plane size={11} />
                      {deployedAirframes.length} Airframe{deployedAirframes.length > 1 ? 's' : ''} Active
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">
                      Operational Grid Node
                    </span>
                  )}

                  {deployedAirframes.length > 0 && onNavigateToFleet && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAircraftId(deployedAirframes[0].id);
                        onNavigateToFleet();
                      }}
                      className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 text-xs"
                    >
                      <span>View Fleet</span>
                      <ChevronRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

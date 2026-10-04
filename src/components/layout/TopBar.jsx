import React, { useState, useEffect } from 'react';
import { Clock, Bell, Menu, X, Plane, LayoutGrid } from 'lucide-react';
import { useFleet } from '../../context/FleetContext';

export function TopBar({ sidebarOpen, setSidebarOpen, activePage, setActivePage }) {
  const [time, setTime] = useState(new Date());
  const { kpis } = useFleet();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatMilitaryTime = (date) => {
    return date.toLocaleTimeString('en-GB', { hour12: false });
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Toggle & Brand (Clean NextSimFlight Style) */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-indigo-600 transition-colors"
          aria-label="Toggle Navigation"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <button 
          onClick={() => setActivePage('fleet')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                Aero<span className="text-indigo-600">Sense</span>
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 hidden sm:inline">
                IAF PS 26249
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden md:block">
              Predictive Maintenance & Fleet Availability • Ministry of Defence
            </p>
          </div>
        </button>
      </div>

      {/* Center & Right Navigation Links */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Navigation Tabs */}
        <div className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-600">
          <button
            onClick={() => setActivePage('fleet')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activePage === 'fleet' ? 'text-indigo-600 font-semibold bg-indigo-50' : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Command Overview
          </button>
          <button
            onClick={() => setActivePage('matrix')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activePage === 'matrix' ? 'text-indigo-600 font-semibold bg-indigo-50' : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Airframe Matrix (24)
          </button>
          <button
            onClick={() => setActivePage('stations')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activePage === 'stations' ? 'text-indigo-600 font-semibold bg-indigo-50' : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            70 IAF Stations
          </button>
          <button
            onClick={() => setActivePage('alerts')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activePage === 'alerts' ? 'text-indigo-600 font-semibold bg-indigo-50' : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            AI Alerts ({kpis.predictedFailuresCount})
          </button>
        </div>

        {/* Primary Hub Pill Button */}
        <button
          onClick={() => setActivePage('fleet')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-colors"
        >
          <LayoutGrid size={14} />
          <span>Fleet Hub</span>
        </button>

        {/* Clean Clock */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
          <Clock size={13} className="text-slate-400" />
          <span className="font-semibold">{formatMilitaryTime(time)}</span>
          <span className="text-[10px] text-slate-400 font-sans">IST</span>
        </div>

        {/* Predictive Alert Quick Button */}
        <button
          onClick={() => setActivePage('alerts')}
          className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-600 transition-colors"
          title="View AI Predictive Alerts"
        >
          <Bell size={17} />
          {kpis.predictedFailuresCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
              {kpis.predictedFailuresCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

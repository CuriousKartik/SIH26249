import React, { useState } from 'react';
import { 
  CalendarRange, 
  ArrowLeft, 
  Sparkles, 
  Wrench, 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Building2, 
  TrendingUp, 
  ChevronRight, 
  Search, 
  Filter, 
  Plus, 
  RotateCcw,
  Check
} from 'lucide-react';
import { useFleet } from '../context/FleetContext';

export function MaintenancePlanner({ onNavigateBack }) {
  const { 
    isScheduleOptimized, 
    toggleOptimizeSchedule, 
    kpis, 
    spares, 
    setSpares, 
    schedule, 
    workOrders 
  } = useFleet();

  const [activeTab, setActiveTab] = useState('gantt'); // 'gantt' | 'spares' | 'orders'
  const [sparesSearch, setSparesSearch] = useState('');
  const [sparesCategory, setSparesCategory] = useState('ALL');
  const [restockedPartId, setRestockedPartId] = useState(null);

  // Filtered spares
  const filteredSpares = spares.filter(part => {
    const matchesCategory = sparesCategory === 'ALL' || part.category.toLowerCase() === sparesCategory.toLowerCase();
    const matchesSearch = 
      part.partNumber.toLowerCase().includes(sparesSearch.toLowerCase()) ||
      part.name.toLowerCase().includes(sparesSearch.toLowerCase()) ||
      part.category.toLowerCase().includes(sparesSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle re-stock action simulation
  const handleRestock = (partId) => {
    setSpares(prev => prev.map(p => {
      if (p.id === partId) {
        return {
          ...p,
          baseCharlieStock: p.baseCharlieStock + 2,
          baseAlphaStock: p.baseAlphaStock + 2,
          status: 'nominal'
        };
      }
      return p;
    }));
    setRestockedPartId(partId);
    setTimeout(() => setRestockedPartId(null), 2000);
  };

  // Schedule task item rendering helper
  // When isScheduleOptimized is true, shift task bars to simulate AI-solved non-conflicting schedule
  const getOptimizedTask = (task) => {
    if (!isScheduleOptimized) return task;

    // AI solver adjustments: shorten duration by 1 day or shift start to remove bottlenecks
    if (task.id === 'MS-01') {
      return { ...task, startDay: 1, durationDays: 2, status: 'in-progress' };
    }
    if (task.id === 'MS-02') {
      return { ...task, startDay: 3, durationDays: 2, status: 'scheduled' };
    }
    if (task.id === 'MS-03') {
      return { ...task, startDay: 1, durationDays: 3, status: 'in-progress' };
    }
    if (task.id === 'MS-05') {
      return { ...task, startDay: 1, durationDays: 2, status: 'in-progress' };
    }
    if (task.id === 'MS-06') {
      return { ...task, startDay: 3, durationDays: 2, status: 'scheduled' };
    }
    return task;
  };

  const scheduleDays = ['Day 1 (Mon)', 'Day 2 (Tue)', 'Day 3 (Wed)', 'Day 4 (Thu)', 'Day 5 (Fri)', 'Day 6 (Sat)', 'Day 7 (Sun)'];

  const bases = [
    { name: 'AFS Ambala (Western Air Command)', code: 'Base Alpha', bays: ['Bay Alpha-1', 'Bay Alpha-2'] },
    { name: 'AFS Bareilly (Central Air Command)', code: 'Base Bravo', bays: ['Bay Bravo-1', 'Bay Bravo-2'] },
    { name: 'AFS Hasimara (Eastern Air Command)', code: 'Base Charlie', bays: ['Bay Charlie-1', 'Bay Charlie-2'] }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & AI Optimization Engine */}
      <div className="clean-card p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
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
                INTEGRATED MAINTENANCE & SPARES PLANNER
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Dynamic Hangar Scheduling & Ordnance Logistics
            </h1>
            <p className="text-xs text-slate-500">
              Multi-base Gantt timeline across 3 Commands with AI Constraint Solver to maximize combat air availability.
            </p>
          </div>

          {/* AI Optimise Schedule Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleOptimizeSchedule}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-sm
                ${isScheduleOptimized 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'}
              `}
            >
              <Sparkles size={15} />
              <span>{isScheduleOptimized ? 'AI Optimized Schedule Active (84%)' : 'Optimise Schedule (AI Engine)'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Availability Transformation Banner */}
        <div className="mt-5 p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-white border border-indigo-200/80 shadow-sm shrink-0">
              <TrendingUp size={24} className="text-indigo-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-700">
                Projected Combat Fleet Availability
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-extrabold font-mono text-slate-900">
                  {kpis.availabilityPercentage}%
                </span>
                <span className="text-xs font-semibold text-indigo-700">
                  {isScheduleOptimized ? '(+13.4% AI Boost Activated)' : '(Baseline 70.8%)'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px]">DOWNTIME SAVED</span>
              <strong className="text-slate-800 font-mono text-sm">{kpis.downtimeSaved} Hours</strong>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px]">ACTIVE HANGAR BAYS</span>
              <strong className="text-slate-800 font-mono text-sm">{isScheduleOptimized ? '5 / 12' : '8 / 12'} Occupied</strong>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px]">CRITICAL SPARES</span>
              <strong className="text-emerald-700 font-mono text-sm">{isScheduleOptimized ? '98.1%' : '92.4%'} Ready</strong>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('gantt')}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${activeTab === 'gantt' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}
            `}
          >
            <CalendarRange size={14} />
            <span>3-Base Gantt Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('spares')}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${activeTab === 'spares' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}
            `}
          >
            <Package size={14} />
            <span>Spares & Ordnance Inventory ({spares.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${activeTab === 'orders' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}
            `}
          >
            <Wrench size={14} />
            <span>Work Orders ({workOrders.length})</span>
          </button>
        </div>
      </div>

      {/* View 1: 3-Base Interactive Gantt Chart */}
      {activeTab === 'gantt' && (
        <div className="clean-card p-5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Operational Maintenance Schedule: 7-Day Horizon
              </h2>
              <p className="text-xs text-slate-500">
                {isScheduleOptimized 
                  ? 'Showing AI-Optimized Sequence: Parallel task staging, eliminated bay clashes, turnaround compressed.'
                  : 'Showing Baseline Schedule: High bay occupancy with sequential bottleneck at Base Alpha & Charlie.'}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500"></span>
                <span className="text-slate-600 font-medium">Unscheduled Critical</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-indigo-600"></span>
                <span className="text-slate-600 font-medium">Predictive Scheduled</span>
              </div>
            </div>
          </div>

          {/* Gantt Timeline Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              
              {/* Day Headers */}
              <div className="grid grid-cols-8 gap-2 pb-2 border-b border-slate-200 text-xs font-semibold text-slate-500">
                <div className="col-span-1 text-slate-400 font-mono uppercase text-[11px]">
                  Hangar Bay
                </div>
                {scheduleDays.map((d, idx) => (
                  <div key={idx} className="col-span-1 text-center font-mono text-[11px] text-slate-700">
                    {d}
                  </div>
                ))}
              </div>

              {/* Schedule per Base */}
              <div className="space-y-6 pt-4">
                {bases.map((base) => (
                  <div key={base.code} className="space-y-2">
                    {/* Base Header */}
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                      <Building2 size={14} />
                      <span>{base.name}</span>
                    </div>

                    {/* Bays */}
                    {base.bays.map((bay) => {
                      // Find tasks assigned to this bay
                      const rawTask = schedule.find(t => t.base === base.code && t.bay === bay);
                      const task = rawTask ? getOptimizedTask(rawTask) : null;

                      return (
                        <div key={bay} className="grid grid-cols-8 gap-2 items-center py-2 bg-slate-50/60 rounded-xl px-2 border border-slate-100">
                          {/* Bay Name */}
                          <div className="col-span-1 text-xs font-medium font-mono text-slate-600">
                            {bay}
                          </div>

                          {/* 7 Days Slots */}
                          <div className="col-span-7 grid grid-cols-7 gap-1.5 relative h-10 items-center">
                            {task ? (
                              <div
                                style={{
                                  gridColumnStart: task.startDay,
                                  gridColumnEnd: task.startDay + task.durationDays
                                }}
                                className={`
                                  h-8 rounded-lg px-2.5 py-1 text-white text-xs font-medium flex items-center justify-between shadow-sm transition-all
                                  ${task.type === 'Unscheduled Critical' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'}
                                `}
                                title={`${task.tailNumber} - ${task.task} (${task.technicianTeam})`}
                              >
                                <div className="truncate flex items-center gap-1.5">
                                  <strong className="font-mono text-[11px] bg-black/20 px-1 rounded">{task.tailNumber}</strong>
                                  <span className="truncate text-[11px]">{task.task}</span>
                                </div>
                                <span className="text-[10px] opacity-80 shrink-0 font-mono hidden sm:inline">
                                  {task.durationDays}d
                                </span>
                              </div>
                            ) : (
                              <div className="col-span-7 text-center text-xs text-slate-300 font-mono py-1">
                                [ Available for Sortie Turnaround ]
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* View 2: Spares Inventory & Logistics */}
      {activeTab === 'spares' && (
        <div className="clean-card p-5 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Critical Spares & Line-Replaceable Units (LRU)
              </h2>
              <p className="text-xs text-slate-500">
                Centralized ordnance inventory synced with 3 BRD (Chandigarh) & 11 BRD (Ojhar).
              </p>
            </div>

            {/* Search & Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search part..."
                  value={sparesSearch}
                  onChange={(e) => setSparesSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <select
                value={sparesCategory}
                onChange={(e) => setSparesCategory(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="Propulsion">Propulsion</option>
                <option value="Hydraulics">Hydraulics</option>
                <option value="Avionics">Avionics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Consumables">Consumables</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Part Number & Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-center">Ambala</th>
                  <th className="py-2.5 px-3 text-center">Bareilly</th>
                  <th className="py-2.5 px-3 text-center">Hasimara</th>
                  <th className="py-2.5 px-3 text-center">Min Req</th>
                  <th className="py-2.5 px-3">Lead Time</th>
                  <th className="py-2.5 px-3">Unit Cost</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSpares.map((part) => {
                  const isRestocked = restockedPartId === part.id;
                  let statusBadge = { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'IN STOCK' };
                  if (part.status === 'critical') {
                    statusBadge = { bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'DEPLETED' };
                  } else if (part.status === 'low' || part.status === 'warning') {
                    statusBadge = { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'LOW' };
                  }

                  return (
                    <tr key={part.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-slate-800">{part.partNumber}</div>
                        <div className="text-slate-500 text-[11px]">{part.name}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-600">
                        {part.category}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                        {part.baseAlphaStock}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                        {part.baseBravoStock}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                        {part.baseCharlieStock}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-500">
                        {part.minRequired}
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-mono">
                        {part.leadTimeDays} days
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-800">
                        {part.unitCost}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge.bg}`}>
                          {statusBadge.text}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleRestock(part.id)}
                          className={`
                            px-2.5 py-1 rounded-lg text-xs font-semibold transition-all
                            ${isRestocked 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'}
                          `}
                        >
                          {isRestocked ? 'Restocked!' : '+ Restock'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 3: Active Work Orders */}
      {activeTab === 'orders' && (
        <div className="clean-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Dispatched Maintenance Work Orders ({workOrders.length})
              </h2>
              <p className="text-xs text-slate-500">
                Real-time tracking of technician crews and allocated LRU assemblies.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workOrders.map((wo) => (
              <div key={wo.id} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {wo.id}
                    </span>
                    <strong className="text-slate-800">{wo.tailNumber}</strong>
                  </div>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {wo.status}
                  </span>
                </div>

                <div className="font-semibold text-slate-900 text-sm">
                  {wo.title}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                  <div>Base: <strong className="text-slate-700">{wo.base}</strong></div>
                  <div>Assigned: <strong className="text-slate-700">{wo.assignedTo}</strong></div>
                  <div>Created: <strong className="text-slate-700 font-mono">{wo.createdDate}</strong></div>
                  <div>Spares: <strong className="text-slate-700 font-mono">{wo.sparesUsed?.join(', ') || 'Standard Kit'}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft, 
  Search, 
  Filter, 
  Wrench, 
  ShieldAlert, 
  Clock, 
  Sparkles, 
  Check, 
  BarChart3, 
  Info,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useFleet } from '../context/FleetContext';

export function PredictiveAlerts({ onNavigateBack }) {
  const { alerts, acknowledgeAlert, createWorkOrder, workOrders } = useFleet();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [componentFilter, setComponentFilter] = useState('ALL');
  const [expandedAlertId, setExpandedAlertId] = useState(null);

  // Derived counts
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const highCount = alerts.filter(a => a.severity === 'high').length;
  const acknowledgedCount = alerts.filter(a => a.acknowledged).length;
  const pendingCount = alerts.length - acknowledgedCount;
  const dispatchedWOs = alerts.filter(a => a.workOrderId !== null).length;

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSeverity = severityFilter === 'ALL' || alert.severity.toLowerCase() === severityFilter.toLowerCase();
      const matchesComponent = componentFilter === 'ALL' || alert.component.toLowerCase().includes(componentFilter.toLowerCase());
      const matchesSearch = 
        alert.tailNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.base.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.component.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSeverity && matchesComponent && matchesSearch;
    });
  }, [alerts, severityFilter, componentFilter, searchQuery]);

  // Severity style helper
  const getSeverityBadge = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return {
          label: 'CRITICAL HAZARD',
          pill: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          border: 'border-l-4 border-l-rose-500'
        };
      case 'high':
        return {
          label: 'HIGH PROBABILITY',
          pill: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          border: 'border-l-4 border-l-amber-500'
        };
      case 'medium':
        return {
          label: 'MEDIUM WEAR',
          pill: 'bg-yellow-50 text-yellow-800 border-yellow-200',
          dot: 'bg-yellow-500',
          border: 'border-l-4 border-l-yellow-400'
        };
      default:
        return {
          label: 'EARLY ADVISORY',
          pill: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          border: 'border-l-4 border-l-slate-300'
        };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & KPI Row */}
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
                AI PREDICTIVE MAINTENANCE ENGINE
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              12 AI Failure Predictions & SHAP Explainability
            </h1>
            <p className="text-xs text-slate-500">
              Machine learning anomaly detection, remaining useful life (RUL) projections, and transparent feature attribution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Algorithm:</span>
            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
              XGBoost + TreeSHAP (v4.2)
            </span>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70">
            <div className="text-[11px] font-medium text-slate-500">Total Predictions</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold text-slate-900">{alerts.length}</span>
              <span className="text-[11px] text-slate-400">monitored</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70">
            <div className="text-[11px] font-medium text-slate-500">Critical Hazards</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold text-rose-600 font-mono">{criticalCount}</span>
              <span className="text-[11px] text-slate-400">(&lt; 40 hrs RUL)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70">
            <div className="text-[11px] font-medium text-slate-500">Pending Review</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold text-amber-600 font-mono">{pendingCount}</span>
              <span className="text-[11px] text-slate-400">unacknowledged</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70">
            <div className="text-[11px] font-medium text-slate-500">Work Orders Dispatched</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold text-emerald-600 font-mono">{dispatchedWOs}</span>
              <span className="text-[11px] text-slate-400">to base hangars</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="clean-card p-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by tail (e.g. KA-2417), subsystem, base or issue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Filter size={13} />
              <span>Severity:</span>
            </span>

            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`
                  px-2.5 py-1 rounded-lg text-xs font-semibold transition-all
                  ${severityFilter === sev 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}
                `}
              >
                {sev}
              </button>
            ))}

            <span className="text-slate-300">|</span>

            <select
              value={componentFilter}
              onChange={(e) => setComponentFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 focus:outline-none"
            >
              <option value="ALL">All Subsystems</option>
              <option value="Engine">Propulsion / Engines</option>
              <option value="Hydraulics">Hydraulic Systems</option>
              <option value="Landing Gear">Landing Gear</option>
              <option value="Avionics">Avionics & Cooling</option>
            </select>
          </div>
        </div>
      </div>

      {/* 12 AI Prediction Cards List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="clean-card p-12 text-center text-slate-500">
            <ShieldAlert size={36} className="mx-auto mb-2 text-slate-400" />
            <p className="text-sm font-semibold">No alerts match your filter criteria.</p>
            <button
              onClick={() => { setSeverityFilter('ALL'); setComponentFilter('ALL'); setSearchQuery(''); }}
              className="mt-3 text-xs text-indigo-600 hover:underline font-semibold"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const sev = getSeverityBadge(alert.severity);
            const isDispatched = alert.workOrderId !== null;

            return (
              <div 
                key={alert.id}
                className={`clean-card p-5 transition-all ${sev.border} hover:shadow-md`}
              >
                {/* Alert Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Tail Number Badge */}
                    <span className="font-mono text-sm font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200/60">
                      {alert.tailNumber}
                    </span>

                    {/* Subsystem & Base Tag */}
                    <span className="text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {alert.component}
                    </span>

                    <span className="text-xs text-slate-500">
                      {alert.base}
                    </span>

                    <span className="text-[11px] text-slate-400">
                      • {alert.timestamp}
                    </span>
                  </div>

                  {/* Severity Badge & RUL */}
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${sev.pill}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`}></span>
                      {sev.label}
                    </span>

                    <span className="text-xs font-mono font-bold text-slate-800 bg-slate-50 px-2.5 py-0.5 rounded-lg border border-slate-200">
                      ~{alert.rulHours}h RUL ({alert.failureProbability}% prob)
                    </span>
                  </div>
                </div>

                {/* Primary Issue Statement */}
                <div className="my-3">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {alert.issue}
                  </h3>
                </div>

                {/* SHAP Feature Attribution Panel ("Why Flagged?") */}
                <div className="mt-3 p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-indigo-600" />
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Why Flagged? Explainable AI (SHAP Feature Attribution)
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Marginal anomaly contribution score
                    </span>
                  </div>

                  {/* Horizontal SHAP Attribution Bars */}
                  <div className="space-y-2">
                    {alert.shapFactors?.map((factor, fIdx) => {
                      const isRiskIncrease = factor.direction === 'increase';
                      const pctWidth = Math.min(100, Math.round(Math.abs(factor.impact) * 100));

                      return (
                        <div key={fIdx} className="text-xs">
                          <div className="flex items-center justify-between text-[11px] mb-0.5">
                            <span className="font-medium text-slate-700">
                              {factor.feature}
                            </span>
                            <span className={`font-mono font-bold ${isRiskIncrease ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {isRiskIncrease ? `+${(factor.impact * 100).toFixed(0)}% risk` : `${(factor.impact * 100).toFixed(0)}% mitigating`}
                            </span>
                          </div>

                          {/* Attribution Progress Bar */}
                          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                            {isRiskIncrease ? (
                              <div 
                                style={{ width: `${pctWidth}%` }} 
                                className="h-full bg-rose-500 rounded-full transition-all"
                              />
                            ) : (
                              <div 
                                style={{ width: `${pctWidth}%` }} 
                                className="h-full bg-emerald-500 rounded-full transition-all"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommended Engineering Action */}
                <div className="mt-3 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2">
                  <Info size={15} className="text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-indigo-900">Recommended Maintenance Action: </strong>
                    <span>{alert.recommendedAction}</span>
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {alert.acknowledged ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <Check size={14} />
                        <span>Acknowledged by Operations</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        Acknowledge Alert
                      </button>
                    )}

                    {isDispatched && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 font-mono">
                        <Wrench size={13} />
                        <span>Order #{alert.workOrderId} Active</span>
                      </span>
                    )}
                  </div>

                  <div>
                    {!isDispatched ? (
                      <button
                        onClick={() => createWorkOrder(alert)}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
                      >
                        <Wrench size={14} />
                        <span>Create & Dispatch Work Order</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">
                        Depot repair team mobilized
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

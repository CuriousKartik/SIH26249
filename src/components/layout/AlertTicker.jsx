import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, Radio, ChevronDown, ChevronUp, Bell } from 'lucide-react';
import { useFleet } from '../../context/FleetContext';

export function AlertTicker({ onSelectAircraft, onNavigateAlerts }) {
  const { liveTickerAlerts } = useFleet();
  const [isExpanded, setIsExpanded] = useState(false);

  const getAlertBadge = (type) => {
    switch (type) {
      case 'critical':
        return {
          icon: <AlertCircle size={15} className="text-rose-600 shrink-0" />,
          pill: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={15} className="text-amber-600 shrink-0" />,
          pill: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500'
        };
      case 'success':
        return {
          icon: <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />,
          pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500'
        };
      default:
        return {
          icon: <Info size={15} className="text-indigo-600 shrink-0" />,
          pill: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-500'
        };
    }
  };

  const latestAlert = liveTickerAlerts[0] || {
    tail: 'KA-2417',
    text: 'AeroSense IoT Edge Telemetry gateway active and online',
    type: 'info',
    timestamp: 'NOW'
  };

  const latestStyle = getAlertBadge(latestAlert.type);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-6">
      {/* Top Banner Ticker Line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:px-4 sm:py-3 bg-white gap-2.5">
        
        {/* Stream Status Tag */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-200/60">
            <Radio size={13} className="text-indigo-600 shrink-0" />
            <span>Telemetry Feed</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Auto-Sync 25s
          </span>
        </div>

        {/* Latest Incoming Alert Content */}
        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden py-0.5 sm:py-0">
          <div className="shrink-0">{latestStyle.icon}</div>
          <button
            onClick={() => onSelectAircraft && onSelectAircraft(latestAlert.tail)}
            className="font-bold text-xs text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-200/50 shrink-0 font-mono transition-colors"
          >
            {latestAlert.tail}
          </button>
          <span className="text-xs font-medium text-slate-700 truncate">
            {latestAlert.text}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {onNavigateAlerts && (
            <button
              onClick={onNavigateAlerts}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 transition-colors flex items-center gap-1"
            >
              <Bell size={12} />
              <span>All Alerts</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
          >
            <span>{isExpanded ? 'Hide' : 'Log'}</span>
            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* Expandable Dropdown with Recent Ticker Events */}
      {isExpanded && (
        <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 bg-slate-50/60 p-2 border-t border-slate-100">
          {liveTickerAlerts.map((item, idx) => {
            const style = getAlertBadge(item.type);
            return (
              <div 
                key={item.id || idx}
                className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-white transition-colors text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {style.icon}
                  <button
                    onClick={() => onSelectAircraft && onSelectAircraft(item.tail)}
                    className="font-bold text-indigo-600 hover:underline font-mono"
                  >
                    [{item.tail}]
                  </button>
                  <span className="text-slate-700 truncate font-medium">
                    {item.text}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 shrink-0 font-mono">
                  {item.timestamp || 'Stream'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

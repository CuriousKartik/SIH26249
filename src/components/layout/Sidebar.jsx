import React from 'react';
import { 
  LayoutDashboard, 
  Crosshair, 
  AlertTriangle, 
  CalendarRange, 
  DatabaseZap, 
  ChevronLeft, 
  Menu, 
  MapPin, 
  ShieldCheck, 
  Building2,
  Plane
} from 'lucide-react';
import { useFleet } from '../../context/FleetContext';

export function Sidebar({ activePage, setActivePage, sidebarOpen, setSidebarOpen, isCollapsed, setIsCollapsed }) {
  const { kpis, fleet } = useFleet();

  const primaryNavItems = [
    {
      id: 'fleet',
      label: 'Fleet Command',
      icon: LayoutDashboard,
      badge: `${fleet.length} Units`,
      badgeColor: 'bg-indigo-100 text-indigo-700'
    },
    {
      id: 'twin',
      label: 'Digital Twin',
      icon: Crosshair,
      badge: 'Interactive',
      badgeColor: 'bg-slate-100 text-slate-700'
    },
    {
      id: 'stations',
      label: 'IAF Air Stations',
      icon: Building2,
      badge: '70 AFS',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'alerts',
      label: 'Predictive Alerts',
      icon: AlertTriangle,
      badge: `${kpis.predictedFailuresCount} AI`,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'planner',
      label: 'Maint & Spares',
      icon: CalendarRange,
      badge: 'Depots',
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'hub',
      label: 'Data Integration',
      icon: DatabaseZap,
      badge: 'Live',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    }
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity"
        />
      )}

      {/* Clean Floating Sidebar matching reference image */}
      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-40
        ${isCollapsed ? 'w-20' : 'w-72'} 
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        p-3 flex flex-col shrink-0
      `}>
        <div className="h-full bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between overflow-hidden">
          
          {/* Top Bar inside Sidebar */}
          <div>
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="text-slate-500 hover:text-indigo-600 transition-colors p-1"
                  title="Toggle menu"
                >
                  <Menu size={20} />
                </button>
                {!isCollapsed && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-lg text-slate-900 tracking-tight">
                      Aero<span className="text-indigo-600">Sense</span>
                    </span>
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      IAF 26249
                    </span>
                  </div>
                )}
              </div>

              {/* Collapse Arrow pill button like reference image */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex items-center justify-center w-6 h-6 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors shadow-sm"
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <ChevronLeft size={16} className={`transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="p-3 space-y-1">
              {!isCollapsed && (
                <div className="px-3 pt-3 pb-1.5 text-[10px] font-bold tracking-wider text-indigo-600 uppercase">
                  OPERATIONAL MODULES
                </div>
              )}

              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group
                      ${isActive 
                        ? 'bg-indigo-50/80 text-indigo-700 font-semibold' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'}
                    `}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon 
                        size={19} 
                        className={`shrink-0 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} 
                      />
                      {!isCollapsed && (
                        <span className="text-sm truncate">
                          {item.label}
                        </span>
                      )}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Secondary Category Section: Prominent IAF Bases */}
              {!isCollapsed && (
                <>
                  <div className="pt-4 px-3 pb-1.5 text-[10px] font-bold tracking-wider text-indigo-600 uppercase flex items-center justify-between">
                    <span>KEY FORWARD BASES</span>
                    <button 
                      onClick={() => handleNavClick('stations')}
                      className="text-[10px] font-medium text-slate-400 hover:text-indigo-600"
                    >
                      All 70 →
                    </button>
                  </div>
                  
                  <div className="space-y-1">
                    <button 
                      onClick={() => { setActivePage('fleet'); }}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className="font-medium text-slate-700 truncate">Ambala AFS (WAC)</span>
                      </div>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full text-[10px] shrink-0">
                        Rafale
                      </span>
                    </button>

                    <button 
                      onClick={() => { setActivePage('fleet'); }}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className="font-medium text-slate-700 truncate">Hasimara AFS (EAC)</span>
                      </div>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full text-[10px] shrink-0">
                        101 Sqn
                      </span>
                    </button>

                    <button 
                      onClick={() => { setActivePage('fleet'); }}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                        <span className="font-medium text-slate-700 truncate">Jodhpur AFS (SWAC)</span>
                      </div>
                      <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.2 rounded-full text-[10px] shrink-0">
                        Su-30MKI
                      </span>
                    </button>

                    <button 
                      onClick={() => { setActivePage('fleet'); }}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className="font-medium text-slate-700 truncate">Sulur AFS (SAC)</span>
                      </div>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full text-[10px] shrink-0">
                        Tejas LCA
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bottom Card Footer */}
          {!isCollapsed && (
            <div className="p-3 m-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
              <div className="flex items-center justify-between text-slate-700 font-semibold mb-1">
                <span>IAF Telemetry Grid</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                70 IAF Stations linked • 6 Air Commands Active
              </p>
            </div>
          )}

        </div>
      </aside>
    </>
  );
}

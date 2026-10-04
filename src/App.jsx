import React, { useState, useEffect } from 'react';
import { FleetProvider } from './context/FleetContext';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { FleetCommand } from './pages/FleetCommand';
import { AirframeMatrix } from './pages/AirframeMatrix';
import { AirStationsDirectory } from './pages/AirStationsDirectory';
import { AircraftDetail } from './pages/AircraftDetail';
import { PredictiveAlerts } from './pages/PredictiveAlerts';
import { MaintenancePlanner } from './pages/MaintenancePlanner';
import { DataIntegrationHub } from './pages/DataIntegrationHub';
import { Cpu, Activity, Shield, Building2 } from 'lucide-react';

function DashboardContent() {
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#', '');
    if (['fleet', 'matrix', 'stations', 'twin', 'alerts', 'planner', 'hub'].includes(hash)) {
      return hash;
    }
    return 'fleet';
  };

  const [activePage, setActivePage] = useState(getInitialPage);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sync hash with activePage
  const handlePageChange = (page) => {
    setActivePage(page);
    window.location.hash = page;
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['fleet', 'matrix', 'stations', 'twin', 'alerts', 'planner', 'hub'].includes(hash)) {
        setActivePage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header Bar */}
      <TopBar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        activePage={activePage}
        setActivePage={handlePageChange}
      />

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar matching user's reference image */}
        <Sidebar 
          activePage={activePage} 
          setActivePage={handlePageChange} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Central Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-7xl mx-auto w-full">
          {activePage === 'fleet' && (
            <FleetCommand 
              onNavigateToTwin={() => handlePageChange('twin')} 
              onNavigateToAlerts={() => handlePageChange('alerts')} 
              onNavigateToStations={() => handlePageChange('stations')}
              onNavigateToMatrix={() => handlePageChange('matrix')}
            />
          )}

          {activePage === 'matrix' && (
            <AirframeMatrix 
              onNavigateToTwin={() => handlePageChange('twin')}
            />
          )}

          {activePage === 'stations' && (
            <AirStationsDirectory 
              onNavigateToFleet={() => handlePageChange('matrix')} 
            />
          )}

          {activePage === 'twin' && (
            <AircraftDetail onNavigateBack={() => handlePageChange('fleet')} />
          )}

          {activePage === 'alerts' && (
            <PredictiveAlerts onNavigateBack={() => handlePageChange('fleet')} />
          )}

          {activePage === 'planner' && (
            <MaintenancePlanner onNavigateBack={() => handlePageChange('fleet')} />
          )}

          {activePage === 'hub' && (
            <DataIntegrationHub onNavigateBack={() => handlePageChange('fleet')} />
          )}

          {/* Defense Solution Pillars Info Footer (Clean modern cards) */}
          <footer className="mt-12 pt-6 border-t border-slate-200/80 text-slate-500 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="text-indigo-600 font-bold mb-1 flex items-center gap-1.5">
                  <Cpu size={15} />
                  <span>1. AI / ML Prediction</span>
                </div>
                <p className="text-xs text-slate-500">
                  SHAP feature attribution & XGBoost early failure prediction models.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="text-indigo-600 font-bold mb-1 flex items-center gap-1.5">
                  <Activity size={15} />
                  <span>2. IoT Health Monitoring</span>
                </div>
                <p className="text-xs text-slate-500">
                  Real-time telemetry streaming across 70 IAF stations with drift & noise synthesis.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="text-indigo-600 font-bold mb-1 flex items-center gap-1.5">
                  <Shield size={15} />
                  <span>3. Digital Twin</span>
                </div>
                <p className="text-xs text-slate-500">
                  Interactive airframe hotspots with subsystem degradation mapping & RUL.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="text-indigo-600 font-bold mb-1 flex items-center gap-1.5">
                  <Building2 size={15} />
                  <span>4. 70 IAF Air Stations Grid</span>
                </div>
                <p className="text-xs text-slate-500">
                  Complete geospatial registry across WAC, SWAC, EAC, CAC, SAC & TMC.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 pb-6">
              <span>
                AeroSense • Smart India Hackathon Problem Statement 26249 • Ministry of Defence
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Clean Enterprise Flight Operations Dashboard
              </span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <FleetProvider>
      <DashboardContent />
    </FleetProvider>
  );
}

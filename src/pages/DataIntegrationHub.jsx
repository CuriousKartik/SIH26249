import React, { useState, useEffect } from 'react';
import { 
  DatabaseZap, 
  ArrowLeft, 
  Activity, 
  FileText, 
  Package, 
  Wrench, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  ArrowRight, 
  Sparkles,
  Server,
  Lock,
  Radio,
  FileCheck2
} from 'lucide-react';
import { useFleet } from '../context/FleetContext';

export function DataIntegrationHub({ onNavigateBack }) {
  const { tick } = useFleet();
  const [pipelineActiveStep, setPipelineActiveStep] = useState(0);
  const [syncSeconds, setSyncSeconds] = useState({ hums: 1, records: 2, spares: 3, agencies: 2 });

  // Update sync timestamps
  useEffect(() => {
    setSyncSeconds({
      hums: (tick % 3) + 1,
      records: (tick % 4) + 1,
      spares: (tick % 5) + 2,
      agencies: (tick % 3) + 1
    });

    setPipelineActiveStep(tick % 5);
  }, [tick]);

  // 4 Core Defense Data Source Tiles
  const dataSources = [
    {
      id: 'hums',
      name: 'Health Monitoring Systems (HUMS)',
      sub: 'Onboard IoT & Flight Data Telemetry',
      icon: Activity,
      syncTime: `${syncSeconds.hums}s ago`,
      syncStatus: 'Active Stream',
      statusColor: 'emerald',
      metrics: [
        { label: 'Ingest Rate', value: '142,500 pts/sec' },
        { label: 'Protocols', value: 'MIL-STD-1553B / ARINC 429' },
        { label: 'Data Quality', value: '99.98% clean' },
        { label: 'Active Feeds', value: '24 Airframes Streaming' }
      ]
    },
    {
      id: 'records',
      name: 'Technical Records (e-Logbooks)',
      sub: 'Flight Debriefs & Unscheduled Snags',
      icon: FileText,
      syncTime: `${syncSeconds.records}s ago`,
      syncStatus: 'Verified Sync',
      statusColor: 'emerald',
      metrics: [
        { label: 'Daily Sorties', value: '412 logged' },
        { label: 'Debrief Records', value: '100% digitalized' },
        { label: 'Unmapped Snags', value: '0 unresolved' },
        { label: 'Discrepancy Lag', value: '< 2 minutes' }
      ]
    },
    {
      id: 'spares',
      name: 'Spares & Ordnance ERP',
      sub: 'Central Air Force Depot Logistics',
      icon: Package,
      syncTime: `${syncSeconds.spares}s ago`,
      syncStatus: 'Synchronized',
      statusColor: 'emerald',
      metrics: [
        { label: 'Tracked Line Items', value: '8,420 LRUs' },
        { label: 'Depot Links', value: '3 BRD & 11 BRD' },
        { label: 'Buffer Health', value: '94.2% available' },
        { label: 'Consignment Transit', value: '12 active shipments' }
      ]
    },
    {
      id: 'agencies',
      name: 'Maintenance Agencies (BRD / HAL)',
      sub: 'Overhaul Depots & Squadron Technicians',
      icon: Wrench,
      syncTime: `${syncSeconds.agencies}s ago`,
      syncStatus: 'Operational',
      statusColor: 'emerald',
      metrics: [
        { label: 'Hangar Capacity', value: '12 active bays' },
        { label: 'Assigned Crews', value: '48 Certified Techs' },
        { label: 'Turnaround Avg', value: '18.4 hrs (compressed)' },
        { label: 'Quality Audit', value: 'Level 1 Defence Cert' }
      ]
    }
  ];

  // 5 Pipeline Stages
  const pipelineStages = [
    {
      step: 1,
      title: 'Data Ingestion',
      desc: 'High-throughput Kafka & MQTT streaming from aircraft transducers, FDR memory pods, and tactical RF links.',
      rate: '142.5k events/s',
      tag: 'Raw Telemetry'
    },
    {
      step: 2,
      title: 'Cleaning & Normalization',
      desc: 'Kalman filtering, baseline detrending, sensor spike elimination, and time-synchronization across unscheduled logs.',
      rate: 'Latency < 4ms',
      tag: 'Validated Vectors'
    },
    {
      step: 3,
      title: 'Feature Engineering',
      desc: 'FFT harmonic spectral decomposition, thermal gradient cross-correlation, and high-frequency vibration extraction.',
      rate: '64 Engineered Signals',
      tag: 'Harmonic Vectors'
    },
    {
      step: 4,
      title: 'ML Model Inference',
      desc: 'XGBoost anomaly classifier and LSTM Remaining Useful Life (RUL) regression with TreeSHAP explainability.',
      rate: 'Inference 12ms',
      tag: '94.6% Accuracy'
    },
    {
      step: 5,
      title: 'Prescriptive Action',
      desc: 'Automated work order creation, dynamic hangar bay allocation, and proactive parts dispatch to forward bases.',
      rate: '+13.4% Availability',
      tag: 'Decision Matrix'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
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
                SIH PS 26249 CORE SOLUTION
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Integrated Defense Maintenance Data Hub
            </h1>
            <p className="text-xs text-slate-500">
              Bridging the gap between fragmented IoT sensors, pilot debrief logs, central ordnance ERP, and base repair depots.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              All 4 Data Silos Unified
            </span>
          </div>
        </div>

        {/* SIH Problem Statement Resolution Card */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <strong className="text-slate-900 font-semibold block mb-1">
            Problem Solved: Eliminating Fragmented & Reactive Fleet Maintenance
          </strong>
          Previously, low aircraft availability was caused by disconnected systems: health telemetry lived on FDRs, technical records remained in paper logbooks, and spares were siloed in ERPs. AeroSense unifies all 4 streams into a single real-time data spine.
        </div>
      </div>

      {/* 4 Unified Data Source Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dataSources.map((source) => {
          const Icon = source.icon;
          return (
            <div key={source.id} className="clean-card p-5 space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/80">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      {source.name}
                    </h2>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {source.sub}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Synced {source.syncTime}</span>
                </div>
              </div>

              {/* Metric Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {source.metrics.map((m, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                    <div className="text-[10px] font-medium text-slate-400">
                      {m.label}
                    </div>
                    <div className="text-xs font-bold text-slate-800 font-mono mt-0.5">
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Animated End-to-End Analytics Pipeline */}
      <div className="clean-card p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Cpu size={18} className="text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">
                AeroSense Data Processing & Predictive Pipeline
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Continuous 5-stage transformation from raw transducer pulse to automated depot work order.
            </p>
          </div>

          <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            Pipeline Latency: 14ms
          </span>
        </div>

        {/* 5-Step Pipeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {pipelineStages.map((stage, idx) => {
            const isPulse = pipelineActiveStep === idx;
            return (
              <div 
                key={stage.step}
                className={`
                  p-4 rounded-xl border transition-all flex flex-col justify-between
                  ${isPulse 
                    ? 'bg-indigo-50/80 border-indigo-300 shadow-sm scale-102 ring-2 ring-indigo-200' 
                    : 'bg-slate-50/70 border-slate-200'}
                `}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-xs font-mono text-indigo-700">
                      {stage.step}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {stage.tag}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 mb-1">
                    {stage.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className="font-mono font-bold text-indigo-700">
                    {stage.rate}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Defense Architecture & Security Standards */}
      <div className="clean-card p-5">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Military Sovereign Deployment & Protocol Compliance
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Air-Gapped Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-800 mb-0.5">MIL-STD-1553B & 1760</div>
            <div className="text-slate-500 text-[11px]">
              Direct dual-redundant digital avionics data bus mapping for Su-30MKI, Rafale and Tejas.
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-800 mb-0.5">Quantum-Safe AES-256</div>
            <div className="text-slate-500 text-[11px]">
              End-to-end tactical tunnel telemetry encryption between forward air bases and Base Repair Depots.
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-800 mb-0.5">On-Premises AI Edge</div>
            <div className="text-slate-500 text-[11px]">
              Complete inference operates on local ruggedized server racks without cloud dependency.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

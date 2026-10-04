// Mock Spares and Maintenance Data for AeroSense

export const INITIAL_SPARES = [
  { id: 'SP-101', partNumber: 'BRG-AL31-77', name: 'High-Pressure Turbine Bearing Set', category: 'Propulsion', baseAlphaStock: 4, baseBravoStock: 2, baseCharlieStock: 1, minRequired: 3, unitCost: '₹14,50,000', leadTimeDays: 4, status: 'low' },
  { id: 'SP-102', partNumber: 'HYD-ACT-NLG4', name: 'Nose Landing Gear Actuator Cylinder', category: 'Hydraulics', baseAlphaStock: 3, baseBravoStock: 3, baseCharlieStock: 0, minRequired: 2, unitCost: '₹8,20,000', leadTimeDays: 6, status: 'critical' },
  { id: 'SP-103', partNumber: 'FLTR-HYD-502', name: 'Hydraulic High-Pressure Inline Filter', category: 'Hydraulics', baseAlphaStock: 18, baseBravoStock: 12, baseCharlieStock: 9, minRequired: 8, unitCost: '₹45,000', leadTimeDays: 2, status: 'nominal' },
  { id: 'SP-104', partNumber: 'FAN-AVIO-CF12', name: 'Avionics Rack Modular Cooling Blower', category: 'Avionics', baseAlphaStock: 6, baseBravoStock: 1, baseCharlieStock: 4, minRequired: 3, unitCost: '₹3,10,000', leadTimeDays: 5, status: 'warning' },
  { id: 'SP-105', partNumber: 'BRK-CRBN-M30', name: 'Main Gear Carbon Brake Disc Rotor', category: 'Mechanical', baseAlphaStock: 8, baseBravoStock: 10, baseCharlieStock: 6, minRequired: 5, unitCost: '₹5,80,000', leadTimeDays: 3, status: 'nominal' },
  { id: 'SP-106', partNumber: 'SEN-CHIP-DET', name: 'Magnetic Chip Detector Probe Sensor', category: 'Sensors', baseAlphaStock: 12, baseBravoStock: 8, baseCharlieStock: 7, minRequired: 4, unitCost: '₹95,000', leadTimeDays: 2, status: 'nominal' },
  { id: 'SP-107', partNumber: 'SEAL-KIT-SK84', name: 'Hydraulic Actuator Fluoropolymer Seal Kit', category: 'Consumables', baseAlphaStock: 22, baseBravoStock: 14, baseCharlieStock: 2, minRequired: 8, unitCost: '₹38,000', leadTimeDays: 1, status: 'low' },
  { id: 'SP-108', partNumber: 'FADEC-ECU-24', name: 'Full Authority Digital Engine Controller', category: 'Avionics', baseAlphaStock: 2, baseBravoStock: 1, baseCharlieStock: 1, minRequired: 2, unitCost: '₹32,00,000', leadTimeDays: 12, status: 'warning' }
];

export const INITIAL_MAINTENANCE_SCHEDULE = [
  { id: 'MS-01', tailNumber: 'KA-2404', base: 'Base Alpha', type: 'Unscheduled Critical', task: 'E-1 Bearing Core Inspection & Replacement', bay: 'Bay Alpha-1', startDay: 1, durationDays: 3, status: 'in-progress', technicianTeam: 'Team Eagle' },
  { id: 'MS-02', tailNumber: 'KA-2402', base: 'Base Alpha', type: 'Predictive Intervention', task: 'Turbine Combustor & Nozzle Calibrate', bay: 'Bay Alpha-2', startDay: 2, durationDays: 2, status: 'scheduled', technicianTeam: 'Team Falcon' },
  { id: 'MS-03', tailNumber: 'KA-2410', base: 'Base Bravo', type: 'Unscheduled Critical', task: 'Hydraulic Manifold Overhaul & Flush', bay: 'Bay Bravo-1', startDay: 1, durationDays: 4, status: 'in-progress', technicianTeam: 'Team Cobra' },
  { id: 'MS-04', tailNumber: 'KA-2412', base: 'Base Bravo', type: 'Predictive Intervention', task: 'Avionics Cooling Duct Mesh & Blower Replace', bay: 'Bay Bravo-2', startDay: 3, durationDays: 2, status: 'scheduled', technicianTeam: 'Team Raptor' },
  { id: 'MS-05', tailNumber: 'KA-2420', base: 'Base Charlie', type: 'Unscheduled Critical', task: 'Nose Landing Gear Cylinder Overhaul', bay: 'Bay Charlie-1', startDay: 1, durationDays: 3, status: 'in-progress', technicianTeam: 'Team Tiger' },
  { id: 'MS-06', tailNumber: 'KA-2417', base: 'Base Charlie', type: 'Predictive Intervention', task: 'Engine 2 Bearing Replace (Preventive)', bay: 'Bay Charlie-2', startDay: 2, durationDays: 3, status: 'scheduled', technicianTeam: 'Team Cheetah' }
];

export const INITIAL_WORK_ORDERS = [
  { id: 'WO-8821', tailNumber: 'KA-2410', priority: 'Critical', base: 'Base Bravo', title: 'Hydraulic Manifold Overhaul', assignedTo: 'Chief Eng. Sharma', createdDate: '2026-10-04', status: 'In Progress', sparesUsed: ['SP-103', 'SP-107'] },
  { id: 'WO-8819', tailNumber: 'KA-2412', priority: 'Medium', base: 'Base Bravo', title: 'Avionics Duct Cleaning & Fan Upgrade', assignedTo: 'Tech Lead Verma', createdDate: '2026-10-04', status: 'Pending Spares', sparesUsed: ['SP-104'] }
];

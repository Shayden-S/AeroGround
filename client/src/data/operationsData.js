export const flights = [
  { id: 'AG204', aircraft: 'Airbus A320', gate: 'A2', arrival: '14:00', departure: '15:10', required: ['Pushback Tug', 'Ground Power', 'Belt Loader', 'Baggage Tractor', 'Passenger Bus'] },
  { id: 'BA249', aircraft: 'Boeing 777', gate: 'A1', arrival: '14:25', departure: '16:05', required: ['Pushback Tug', 'Ground Power', 'Belt Loader', 'Baggage Tractor', 'Catering Truck'] },
  { id: 'LH404', aircraft: 'Airbus A321', gate: 'A3', arrival: '15:10', departure: '16:20', required: ['Pushback Tug', 'Ground Power', 'Belt Loader', 'Baggage Tractor'] },
  { id: 'SQ318', aircraft: 'Boeing 787', gate: 'A5', arrival: '16:00', departure: '17:35', required: ['Pushback Tug', 'Ground Power', 'Belt Loader', 'Passenger Bus'] }
];
export const inspectionChecks = ['Brakes', 'Tyres', 'Hydraulic System', 'Lights', 'Warning Indicators', 'Battery', 'Emergency Stop', 'Fluid Leakage', 'External Damage'];
export const initialInspections = [
  { id: 'INS-2311', equipmentId: 'TUG-014', type: 'Pre-use', inspector: 'A. Patel', date: '2026-09-28', result: 'Pass', status: 'Completed', checks: {} },
  { id: 'INS-2310', equipmentId: 'BL-011', type: 'Pre-use', inspector: 'K. Tan', date: '2026-09-28', result: 'Needs Attention', status: 'Completed', checks: {} },
  { id: 'INS-2309', equipmentId: 'BUS-021', type: 'Safety', inspector: 'D. Kalu', date: '2026-09-28', result: 'Fail', status: 'Completed', checks: {} },
  { id: 'INS-2312', equipmentId: 'GPU-006', type: 'Pre-use', inspector: 'Unassigned', date: '2026-09-28', result: 'Pending', status: 'Pending', checks: {} },
  { id: 'INS-2308', equipmentId: 'BT-009', type: 'Periodic', inspector: 'Unassigned', date: '2026-09-27', result: 'Pending', status: 'Pending', checks: {} }
];
export const initialWorkOrders = [
  { id: 'MNT-2810', equipmentId: 'TUG-008', type: 'Corrective', priority: 'High', technician: 'R. Fernandez', scheduled: '2026-09-28', problem: 'Hydraulic system flush and pressure check', status: 'In Progress', faultId: '', notes: '' },
  { id: 'MNT-2814', equipmentId: 'BL-004', type: 'Preventive', priority: 'Medium', technician: 'S. Wong', scheduled: '2026-09-29', problem: 'Conveyor bearing lubrication', status: 'Scheduled', faultId: 'FLT-9414', notes: '' },
  { id: 'MNT-2817', equipmentId: 'CT-004', type: 'Corrective', priority: 'Critical', technician: 'J. Reynolds', scheduled: '2026-09-28', problem: 'Replace leaking high-lift valve', status: 'Assigned', faultId: 'FLT-9418', notes: '' }
];

export function loadRecords(key, defaults) {
  try { const value = JSON.parse(localStorage.getItem(key)); return Array.isArray(value) ? value : defaults; }
  catch { return defaults; }
}
export function activeLockouts() {
  const locked = new Set();
  try {
    const faults = JSON.parse(localStorage.getItem('aeroground-fault-reports-v1'));
    (Array.isArray(faults) ? faults : [{equipmentId:'TUG-017',grounded:true,status:'Reported'},{equipmentId:'BUS-021',grounded:true,status:'Assigned'},{equipmentId:'CT-004',grounded:true,status:'In Progress'}]).forEach(f => { if (f.grounded && f.status !== 'Resolved') locked.add(f.equipmentId); });
  } catch { ['TUG-017','BUS-021','CT-004'].forEach(id => locked.add(id)); }
  const inspections = loadRecords('aeroground-inspections-v1', initialInspections);
  const latest = new Map();
  inspections.filter(i => i.status === 'Completed').forEach(i => {
    const previous = latest.get(i.equipmentId);
    if (!previous || i.date > previous.date || (i.date === previous.date && i.id > previous.id)) latest.set(i.equipmentId,i);
  });
  latest.forEach(i => { if (i.result === 'Fail') locked.add(i.equipmentId); });
  return locked;
}

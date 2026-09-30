export const initialFaults = [
  { id: 'FLT-9421', equipmentId: 'TUG-017', category: 'Hydraulic', severity: 'Critical', description: 'Steering hydraulic pressure loss during pushback preparation.', location: 'Gate A3 (Pushbox)', reportedBy: 'Marcus Vance', reportedAt: '2026-09-28T10:42:00', status: 'Reported', grounded: true, notes: [] },
  { id: 'FLT-9420', equipmentId: 'BUS-021', category: 'Electrical', severity: 'Critical', description: 'Alternator warning and cabin electrical shutdown.', location: 'Remote Stand R3', reportedBy: 'D. Kalu', reportedAt: '2026-09-28T09:15:00', status: 'Assigned', grounded: true, notes: [] },
  { id: 'FLT-9418', equipmentId: 'CT-004', category: 'Hydraulic', severity: 'High', description: 'High-lift platform hydraulic valve leaking.', location: 'Remote Stand R2', reportedBy: 'Catering Squad 3', reportedAt: '2026-09-27T16:20:00', status: 'In Progress', grounded: true, notes: [] },
  { id: 'FLT-9414', equipmentId: 'BL-004', category: 'Mechanical', severity: 'Medium', description: 'Conveyor roller makes an intermittent grinding noise.', location: 'Apron Staging S2', reportedBy: 'Ramp Operator 14', reportedAt: '2026-09-26T13:08:00', status: 'Inspection', grounded: false, notes: [] },
  { id: 'FLT-9407', equipmentId: 'GPU-006', category: 'Electrical', severity: 'Low', description: 'Connector cover latch replaced after pre-use check.', location: 'Apron Staging Bay 3', reportedBy: 'Standby Dispatch', reportedAt: '2026-09-25T08:30:00', status: 'Resolved', grounded: false, notes: [{ at: '2026-09-25T11:00:00', text: 'Latch replaced and unit returned to service.' }] }
];

export const faultStages = ['Reported', 'Assigned', 'In Progress', 'Inspection', 'Resolved'];
export const faultCategories = ['Hydraulic', 'Electrical', 'Mechanical', 'Brakes', 'Tyres', 'Engine', 'Battery', 'Safety Equipment', 'Other'];

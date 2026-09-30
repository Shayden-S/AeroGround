import React, { useEffect, useState } from 'react';
import { PlaneTakeoff } from 'lucide-react';
import { allEquipmentList } from '../data/equipmentData';
import { flights, loadRecords, activeLockouts } from '../data/operationsData';
import { OpsHeader, OpsMetric, OpsBadge } from '../components/common/OperationsUI';
import './OperationsPages.css';

const key = 'aeroground-assignments-v1';
export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState(() => loadRecords(key, []));
  const [message, setMessage] = useState('');
  useEffect(() => localStorage.setItem(key, JSON.stringify(assignments)), [assignments]);
  const lockouts = activeLockouts();
  const assignedIds = new Set(assignments.map(a => a.equipmentId));
  const slots = flights.flatMap(f => f.required.map(type => ({ flightId: f.id, type })));
  const assign = (flightId, type, equipmentId) => {
    setMessage('');
    const remaining = assignments.filter(a => !(a.flightId === flightId && a.type === type));
    if (equipmentId && (lockouts.has(equipmentId) || allEquipmentList.find(e => e.id === equipmentId)?.status !== 'AVAILABLE' || remaining.some(a => a.equipmentId === equipmentId))) {
      setMessage(`${equipmentId} cannot be assigned: it is locked out, unavailable, or already assigned.`);
      return;
    }
    setAssignments(equipmentId ? [...remaining, { flightId, type, equipmentId }] : remaining);
  };
  return <div className="ops-page"><OpsHeader title="Ramp GSE Flight Allocations" subtitle="Assign serviceable ground equipment to active turnarounds. One unit can serve one flight at a time." action={<PlaneTakeoff size={24} color="var(--primary)"/>}/>
    {message && <div className="ops-toast" role="alert">{message}</div>}
    <div className="ops-metrics"><OpsMetric label="Turnarounds" value={flights.length}/><OpsMetric label="Required positions" value={slots.length}/><OpsMetric label="Assigned positions" value={assignments.length}/><OpsMetric label="Awaiting dispatch" value={slots.length - assignments.length}/></div>
    <div className="ops-grid">{flights.map(f => <section className="aeroground-card ops-flight" key={f.id}><div className="ops-flight-head"><div><h2>{f.id} · Gate {f.gate}</h2><p>{f.aircraft}</p></div><div><small>Arrival {f.arrival}</small><br/><small>Departure {f.departure}</small></div></div>{f.required.map(type => { const current = assignments.find(a => a.flightId === f.id && a.type === type)?.equipmentId || ''; const eligible = allEquipmentList.filter(e => e.category === type && e.status === 'AVAILABLE' && !lockouts.has(e.id) && (!assignedIds.has(e.id) || e.id === current)); return <div className="ops-slot" key={type}><div><strong>{type}</strong><br/><OpsBadge text={current ? 'Assigned' : eligible.length ? 'Awaiting Assignment' : 'Unavailable'} tone={current ? 'blue' : eligible.length ? 'amber' : 'red'}/></div><select className="form-select" aria-label={`${f.id} ${type}`} value={current} onChange={e => assign(f.id, type, e.target.value)}><option value="">Unassigned</option>{eligible.map(e => <option key={e.id} value={e.id}>{e.id} · {e.location}</option>)}</select></div>; })}</section>)}</div><p className="ops-muted">Assignment choices are saved in this browser. Safety lockouts from Fault Reports block dispatch.</p></div>;
}

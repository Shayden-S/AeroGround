import React, { useEffect, useState } from 'react';
import { ClipboardCheck, Plus } from 'lucide-react';
import Modal from '../components/common/Modal';
import { allEquipmentList } from '../data/equipmentData';
import { initialInspections, inspectionChecks, loadRecords } from '../data/operationsData';
import { OpsHeader, OpsMetric, OpsBadge } from '../components/common/OperationsUI';
import './OperationsPages.css';

const key = 'aeroground-inspections-v1';
const today = new Date().toISOString().slice(0,10);
export default function InspectionsPage() {
  const [rows, setRows] = useState(() => loadRecords(key, initialInspections));
  const [open, setOpen] = useState(false);
  const [equipmentId, setEquipmentId] = useState('');
  const [inspector, setInspector] = useState('');
  const [type, setType] = useState('Pre-use');
  const [checks, setChecks] = useState({});
  const [selected, setSelected] = useState(null);
  useEffect(() => localStorage.setItem(key, JSON.stringify(rows)), [rows]);
  const overdue = rows.filter(r => r.status === 'Pending' && r.date < today).length;
  const finish = event => {
    event.preventDefault();
    const results = Object.values(checks);
    if (results.length !== inspectionChecks.length) return;
    const result = results.includes('Fail') ? 'Fail' : results.includes('Needs Attention') ? 'Needs Attention' : 'Pass';
    if (selected) setRows(current => current.map(r => r.id === selected.id ? { ...r, inspector, type, checks, result, status: 'Completed', date: today } : r));
    else setRows(current => [{ id: `INS-${Math.max(2312, ...current.map(r => Number(r.id.slice(4)) || 0)) + 1}`, equipmentId, inspector, type, checks, result, status: 'Completed', date: today }, ...current]);
    setOpen(false); setSelected(null); setChecks({}); setEquipmentId(''); setInspector('');
  };
  const start = row => { setSelected(row || null); setEquipmentId(row?.equipmentId || ''); setInspector(row?.inspector === 'Unassigned' ? '' : row?.inspector || ''); setType(row?.type || 'Pre-use'); setChecks({}); setOpen(true); };
  return <div className="ops-page"><OpsHeader title="Airside Quality & Safety Inspections" subtitle="Record equipment walkarounds and safety checks before dispatch." action={<button className="btn-primary" onClick={() => start(null)}><Plus size={15}/> Start Inspection</button>}/><div className="ops-metrics"><OpsMetric label="Pending" value={rows.filter(r => r.status === 'Pending').length}/><OpsMetric label="Completed today" value={rows.filter(r => r.status === 'Completed' && r.date === today).length}/><OpsMetric label="Failed" value={rows.filter(r => r.result === 'Fail').length}/><OpsMetric label="Overdue" value={overdue}/></div><section className="aeroground-card"><div className="ops-section-head ops-card"><h2>Inspection register</h2><ClipboardCheck size={18} color="var(--primary)"/></div><div className="ops-table-wrap"><table className="ops-table"><thead><tr><th>Inspection ID</th><th>Equipment</th><th>Type</th><th>Inspector</th><th>Date</th><th>Result</th><th>Status</th><th></th></tr></thead><tbody>{rows.map(r => <tr key={r.id}><td><strong>{r.id}</strong></td><td>{r.equipmentId}</td><td>{r.type}</td><td>{r.inspector}</td><td>{r.date}</td><td><OpsBadge text={r.result}/></td><td><OpsBadge text={r.status}/></td><td>{r.status === 'Pending' && <button className="ops-link" onClick={() => start(r)}>Start</button>}</td></tr>)}</tbody></table></div></section><p className="ops-muted">A failed check is recorded in the inspection register; equipment release remains a supervisor decision in this prototype.</p><Modal isOpen={open} onClose={() => setOpen(false)} title={selected ? `Complete ${selected.id}` : 'Start equipment inspection'} subtitle="All checklist items require a result" maxWidth="650px"><form onSubmit={finish} className="ops-form"><label className="ops-field">Equipment<select className="form-input" required disabled={!!selected} value={equipmentId} onChange={e => setEquipmentId(e.target.value)}><option value="">Select equipment</option>{allEquipmentList.map(e => <option key={e.id} value={e.id}>{e.id} — {e.category}</option>)}</select></label><label className="ops-field">Inspection type<select className="form-input" value={type} onChange={e => setType(e.target.value)}>{['Pre-use','Periodic','Safety','Post-repair'].map(x => <option key={x}>{x}</option>)}</select></label><label className="ops-field full">Inspector<input className="form-input" required maxLength={80} value={inspector} onChange={e => setInspector(e.target.value)} placeholder="Name or employee ID"/></label><div className="ops-field full"><span>Checklist ({Object.keys(checks).length}/{inspectionChecks.length})</span><div className="ops-checklist">{inspectionChecks.map(item => <label className="ops-check-row" key={item}>{item}<select className="form-select" required value={checks[item] || ''} onChange={e => setChecks({...checks,[item]:e.target.value})}><option value="">Select result</option><option>Pass</option><option>Needs Attention</option><option>Fail</option></select></label>)}</div></div><div className="ops-form-actions"><button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button><button className="btn-primary" type="submit">Complete inspection</button></div></form></Modal></div>;
}

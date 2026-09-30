import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, Plus, Search, ShieldAlert, ClipboardList, CheckCircle2 } from 'lucide-react';
import Modal from '../components/common/Modal';
import { allEquipmentList } from '../data/equipmentData';
import { initialFaults, faultCategories, faultStages } from '../data/faultData';
import './FaultReportsPage.css';

const storageKey = 'aeroground-fault-reports-v1';
const readFaults = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(saved) ? saved : initialFaults;
  } catch { return initialFaults; }
};
const blankForm = { equipmentId: '', category: '', severity: 'Medium', description: '', location: '', reportedBy: '', grounded: false };
const dateLabel = (value) => new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export default function FaultReportsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [faults, setFaults] = useState(readFaults);
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('All');
  const [status, setStatus] = useState('All');
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [note, setNote] = useState('');
  const isNew = location.pathname.endsWith('/new');

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(faults)); }, [faults]);
  const selected = faults.find(f => f.id === selectedId);
  const filtered = useMemo(() => faults.filter(f => {
    const haystack = `${f.id} ${f.equipmentId} ${f.description} ${f.location} ${f.category}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (severity === 'All' || severity === f.severity) && (status === 'All' || status === f.status);
  }).sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt)), [faults, search, severity, status]);
  const active = faults.filter(f => f.status !== 'Resolved');
  const update = (id, changes) => setFaults(current => current.map(f => f.id === id ? { ...f, ...changes } : f));
  const closeNew = () => { navigate('/fault-reports'); setForm(blankForm); };
  const submit = (event) => {
    event.preventDefault();
    const nextNumber = Math.max(9421, ...faults.map(f => Number(f.id.slice(4)) || 0)) + 1;
    setFaults(current => [{ ...form, id: `FLT-${nextNumber}`, description: form.description.trim(), location: form.location.trim(), reportedBy: form.reportedBy.trim(), status: 'Reported', reportedAt: new Date().toISOString(), notes: [], grounded: form.grounded || form.severity === 'Critical' }, ...current]);
    closeNew();
  };
  const addNote = (event) => {
    event.preventDefault();
    if (!selected || !note.trim()) return;
    // Event handlers timestamp user actions; this value is never computed during render.
    // oxlint-disable-next-line react/purity
    update(selected.id, { notes: [...selected.notes, { at: new Date().toISOString(), text: note.trim() }] });
    setNote('');
  };

  return <div className="fault-page">
    <header className="fault-page-header">
      <div><div className="fault-eyebrow">APRON CONTROL SUBSYSTEM <span>•</span> SAFETY & DEFECT LOG</div><h1>Active Fault Reports & Safety Lockouts</h1><p>Track GSE defects from report through inspection and return to service.</p></div>
      <button className="btn-danger" onClick={() => navigate('/fault-reports/new')}><Plus size={16}/> Report Fault</button>
    </header>
    <div className="fault-summary">
      <Summary icon={ClipboardList} label="Total Reports" value={faults.length} />
      <Summary icon={AlertTriangle} label="Active Faults" value={active.length} />
      <Summary icon={ShieldAlert} label="Safety Lockouts" value={active.filter(f => f.grounded).length} tone="danger" />
      <Summary icon={CheckCircle2} label="Resolved" value={faults.length - active.length} tone="success" />
    </div>
    <section className="aeroground-card fault-list">
      <div className="fault-list-head"><div><h2>Fault register</h2><p>{filtered.length} reports shown · prototype records saved in this browser</p></div><div className="fault-filters"><label className="fault-search"><Search size={15}/><input aria-label="Search faults" placeholder="Search ID, equipment, issue…" value={search} onChange={e => setSearch(e.target.value)}/></label><select className="form-select" aria-label="Filter severity" value={severity} onChange={e => setSeverity(e.target.value)}>{['All','Low','Medium','High','Critical'].map(x => <option key={x} value={x}>{x === 'All' ? 'All severities' : x}</option>)}</select><select className="form-select" aria-label="Filter status" value={status} onChange={e => setStatus(e.target.value)}>{['All',...faultStages].map(x => <option key={x} value={x}>{x === 'All' ? 'All statuses' : x}</option>)}</select></div></div>
      <div className="fault-table-scroll"><table className="fault-table"><thead><tr><th>FAULT / REPORTED</th><th>EQUIPMENT</th><th>ISSUE</th><th>SEVERITY</th><th>STATUS</th><th>SAFETY</th><th></th></tr></thead><tbody>{filtered.map(f => <tr key={f.id}><td><strong className="fault-id">{f.id}</strong><small>{dateLabel(f.reportedAt)}</small></td><td><strong>{f.equipmentId}</strong><small>{allEquipmentList.find(e => e.id === f.equipmentId)?.category || 'Equipment'}</small></td><td className="fault-issue"><strong>{f.category}</strong><small title={f.description}>{f.description}</small></td><td><Badge value={f.severity}/></td><td><Badge value={f.status}/></td><td>{f.grounded ? <span className="fault-lockout">LOCKOUT</span> : <span className="fault-clear">No lockout</span>}</td><td><button className="fault-link" onClick={() => setSelectedId(f.id)}>View details</button></td></tr>)}</tbody></table>{!filtered.length && <div className="fault-empty">No reports match these filters.</div>}</div>
    </section>
    <Modal isOpen={isNew} onClose={closeNew} title="Report equipment fault" subtitle="Log a defect for the ramp safety team" maxWidth="650px"><form onSubmit={submit} className="fault-form"><div className="fault-form-grid"><Field label="Equipment ID"><select className="form-input" required value={form.equipmentId} onChange={e => { const item = allEquipmentList.find(x => x.id === e.target.value); setForm({ ...form, equipmentId: e.target.value, location: item?.location || '' }); }}><option value="">Select equipment</option>{allEquipmentList.map(e => <option key={e.id} value={e.id}>{e.id} — {e.category}</option>)}</select></Field><Field label="Fault category"><select className="form-input" required value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option value="">Select category</option>{faultCategories.map(c => <option key={c}>{c}</option>)}</select></Field><Field label="Severity"><select className="form-input" value={form.severity} onChange={e => setForm({...form, severity: e.target.value, grounded: e.target.value === 'Critical' ? true : form.grounded})}>{['Low','Medium','High','Critical'].map(c => <option key={c}>{c}</option>)}</select></Field><Field label="Location"><input className="form-input" required maxLength={100} value={form.location} onChange={e => setForm({...form, location: e.target.value})}/></Field><Field label="Reported by"><input className="form-input" required maxLength={80} placeholder="Your name or employee ID" value={form.reportedBy} onChange={e => setForm({...form, reportedBy: e.target.value})}/></Field></div><Field label="Fault description"><textarea className="form-input fault-textarea" required minLength={10} maxLength={800} placeholder="Describe the symptoms and when they occurred" value={form.description} onChange={e => setForm({...form, description: e.target.value})}/></Field><label className="fault-check"><input type="checkbox" checked={form.grounded || form.severity === 'Critical'} disabled={form.severity === 'Critical'} onChange={e => setForm({...form, grounded: e.target.checked})}/> Ground equipment / apply safety lockout</label>{form.severity === 'Critical' && <p className="fault-warning">Critical faults automatically require a safety lockout.</p>}<div className="fault-actions"><button type="button" className="btn-secondary" onClick={closeNew}>Cancel</button><button type="submit" className="btn-danger">Submit fault report</button></div></form></Modal>
    <Modal isOpen={!!selected} onClose={() => { setSelectedId(null); setNote(''); }} title={selected ? `${selected.id} · ${selected.equipmentId}` : ''} subtitle="Fault record and response workflow" maxWidth="620px">{selected && <div className="fault-detail"><div className="fault-detail-badges"><Badge value={selected.severity}/><Badge value={selected.status}/>{selected.grounded && <span className="fault-lockout">SAFETY LOCKOUT</span>}</div><h3>{selected.category} fault</h3><p>{selected.description}</p><dl><div><dt>Location</dt><dd>{selected.location}</dd></div><div><dt>Reported by</dt><dd>{selected.reportedBy}</dd></div><div><dt>Reported</dt><dd>{dateLabel(selected.reportedAt)}</dd></div></dl><Field label="Workflow stage"><select className="form-input" value={selected.status} onChange={e => update(selected.id, { status: e.target.value })}>{faultStages.map(stage => <option key={stage}>{stage}</option>)}</select></Field><label className="fault-check"><input type="checkbox" checked={selected.grounded} onChange={e => update(selected.id, { grounded: e.target.checked })}/> Safety lockout active</label><div className="fault-notes"><h4>Response notes</h4>{selected.notes.length ? selected.notes.map((item, i) => <p key={i}><small>{dateLabel(item.at)}</small><br/>{item.text}</p>) : <p className="fault-muted">No response notes yet.</p>}<form onSubmit={addNote}><input className="form-input" aria-label="Response note" maxLength={500} placeholder="Add an inspection or repair note" value={note} onChange={e => setNote(e.target.value)}/><button className="btn-primary" type="submit">Add note</button></form></div></div>}</Modal>
  </div>;
}

function Summary({ icon: Icon, label, value, tone }) { return <div className="aeroground-card fault-summary-card"><span className={`fault-summary-icon ${tone || ''}`}><Icon size={18}/></span><div><span>{label}</span><strong className="num-tabular">{value}</strong></div></div>; }
function Field({ label, children }) { return <label className="fault-field"><span>{label}</span>{children}</label>; }
function Badge({ value }) { const type = ['Critical','High'].includes(value) ? 'danger' : ['Medium','In Progress','Inspection'].includes(value) ? 'warning' : ['Resolved','Low'].includes(value) ? 'success' : 'blue'; return <span className={`fault-badge ${type}`}>{value}</span>; }

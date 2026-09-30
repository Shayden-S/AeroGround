import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../components/common/Modal';
import { loadRecords } from '../data/operationsData';
import { OpsHeader, OpsMetric, OpsBadge } from '../components/common/OperationsUI';
import './OperationsPages.css';
const key = 'aeroground-users-v1';
const defaults = [
  {id:'EMP-101',name:'A. Patel',role:'Administrator',department:'Airport Operations',email:'apatel@example.test',active:true},
  {id:'EMP-114',name:'J. Reynolds',role:'Maintenance Supervisor',department:'Maintenance',email:'jreynolds@example.test',active:true},
  {id:'EMP-209',name:'F. Rossi',role:'Equipment Operator',department:'Ramp',email:'frossi@example.test',active:true},
  {id:'EMP-301',name:'K. Tan',role:'Operations Manager',department:'Ramp',email:'ktan@example.test',active:true}
];
const roles = ['Administrator','Operations Manager','Maintenance Supervisor','Technician','Equipment Operator'];
const blank = {name:'',role:'Equipment Operator',department:'Ramp',email:'',active:true};
export default function UsersPage() {
  const [users,setUsers] = useState(() => loadRecords(key,defaults));
  const [editing,setEditing] = useState(null);
  const [form,setForm] = useState(blank);
  useEffect(() => localStorage.setItem(key,JSON.stringify(users)),[users]);
  const open = user => {setEditing(user?.id || 'new');setForm(user || blank);};
  const submit = event => {event.preventDefault();if(users.some(u => u.email.toLowerCase() === form.email.toLowerCase() && u.id !== editing)) return; if(editing === 'new') setUsers(current => [...current,{...form,id:`EMP-${Math.max(301,...current.map(u => Number(u.id.slice(4)) || 0))+1}`}]); else setUsers(current => current.map(u => u.id === editing ? {...u,...form} : u));setEditing(null);};
  return <div className="ops-page"><OpsHeader title="Apron Operators & Personnel Directory" subtitle="Manage prototype staff records and operational roles." action={<button className="btn-primary" onClick={() => open(null)}><Plus size={15}/> Add User</button>}/><div className="ops-metrics"><OpsMetric label="Total personnel" value={users.length}/><OpsMetric label="Active accounts" value={users.filter(u => u.active).length}/><OpsMetric label="Technicians" value={users.filter(u => u.role === 'Technician').length}/><OpsMetric label="Operators" value={users.filter(u => u.role === 'Equipment Operator').length}/></div><section className="aeroground-card"><div className="ops-section-head ops-card"><h2>Personnel directory</h2></div><div className="ops-table-wrap"><table className="ops-table"><thead><tr><th>Employee ID</th><th>Name</th><th>Role</th><th>Department</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead><tbody>{users.map(u => <tr key={u.id}><td>{u.id}</td><td><strong>{u.name}</strong></td><td>{u.role}</td><td>{u.department}</td><td>{u.email}</td><td><OpsBadge text={u.active ? 'Active' : 'Inactive'} tone={u.active ? 'green' : 'red'}/></td><td><button className="ops-link" onClick={() => open(u)}>Edit</button> · <button className="ops-link" onClick={() => setUsers(current => current.map(x => x.id === u.id ? {...x,active:!x.active}:x))}>{u.active ? 'Deactivate' : 'Activate'}</button></td></tr>)}</tbody></table></div></section><p className="ops-muted">These are local demo records. Role permissions and sign-in accounts require the authentication backend.</p><Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add user' : `Edit ${editing}`} maxWidth="560px"><form className="ops-form" onSubmit={submit}><label className="ops-field">Name<input className="form-input" required maxLength={80} value={form.name} onChange={e => setForm({...form,name:e.target.value})}/></label><label className="ops-field">Role<select className="form-input" value={form.role} onChange={e => setForm({...form,role:e.target.value})}>{roles.map(x => <option key={x}>{x}</option>)}</select></label><label className="ops-field">Department<input className="form-input" required maxLength={80} value={form.department} onChange={e => setForm({...form,department:e.target.value})}/></label><label className="ops-field">Email<input className="form-input" required type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})}/></label><div className="ops-form-actions"><button type="button" className="btn-secondary" onClick={() => setEditing(null)}>Cancel</button><button className="btn-primary">Save user</button></div></form></Modal></div>;
}

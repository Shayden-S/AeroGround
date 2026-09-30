import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { allEquipmentList } from '../data/equipmentData';
import { initialFaults } from '../data/faultData';
import { initialInspections, initialWorkOrders, loadRecords } from '../data/operationsData';
import { OpsHeader, OpsMetric } from '../components/common/OperationsUI';
import './OperationsPages.css';

function csvCell(value) { return `"${String(value ?? '').replaceAll('"','""')}"`; }
const reportTimestamp = Date.now();
export default function ReportsPage() {
  const [range, setRange] = useState('All prototype data');
  const days = range === 'Last 7 days' ? 7 : range === 'Last 30 days' ? 30 : null;
  const withinRange = date => days === null || (new Date(date).getTime() >= reportTimestamp - days * 86400000 && new Date(date).getTime() <= reportTimestamp);
  const faults = loadRecords('aeroground-fault-reports-v1', initialFaults).filter(f => withinRange(f.reportedAt));
  const orders = loadRecords('aeroground-work-orders-v1', initialWorkOrders).filter(o => withinRange(o.scheduled));
  const inspections = loadRecords('aeroground-inspections-v1', initialInspections).filter(i => withinRange(i.date));
  const available = allEquipmentList.filter(e => e.status === 'AVAILABLE').length;
  const utilization = allEquipmentList.filter(e => e.status === 'IN USE').length;
  const complete = orders.filter(o => o.status === 'Completed').length;
  const grouped = faults.reduce((acc,f) => ({...acc,[f.category]:(acc[f.category] || 0)+1}),{});
  const downloadCsv = () => {
    const lines = [['Section','ID','Equipment','Type','Status','Date'], ...faults.map(f => ['Fault',f.id,f.equipmentId,f.category,f.status,f.reportedAt]),...orders.map(o => ['Maintenance',o.id,o.equipmentId,o.type,o.status,o.scheduled]),...inspections.map(i => ['Inspection',i.id,i.equipmentId,i.type,i.result,i.date])];
    const blob = new Blob([lines.map(row => row.map(csvCell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'aeroground-operations.csv'; link.click(); URL.revokeObjectURL(url);
  };
  return <div className="ops-page"><OpsHeader title="Fleet Analytics & Operational Reports" subtitle="A snapshot of prototype equipment, fault, inspection and work order records." action={<div className="ops-controls"><select className="form-select" aria-label="Report range" value={range} onChange={e => setRange(e.target.value)}><option>All prototype data</option><option>Last 7 days</option><option>Last 30 days</option></select><button className="btn-secondary" onClick={downloadCsv}><Download size={15}/> Export CSV</button><button className="btn-secondary" onClick={() => window.print()}>Print / Save PDF</button></div>}/><p className="ops-muted">Equipment counts reflect the mock fleet. Date filters apply to fault, inspection and maintenance records.</p><div className="ops-metrics"><OpsMetric label="Available equipment" value={`${Math.round(100*available/allEquipmentList.length)}%`} detail={`${available} of ${allEquipmentList.length} units`}/><OpsMetric label="Fleet in use" value={`${Math.round(100*utilization/allEquipmentList.length)}%`}/><OpsMetric label="Maintenance completed" value={`${orders.length ? Math.round(100*complete/orders.length) : 0}%`}/><OpsMetric label="Open faults" value={faults.filter(f => f.status !== 'Resolved').length}/></div><div className="ops-grid"><section className="aeroground-card ops-card"><div className="ops-section-head"><h2>Equipment by status</h2></div>{['AVAILABLE','IN USE','UNDER MAINTENANCE','OUT OF SERVICE'].map(status => { const count = allEquipmentList.filter(e => e.status === status).length; return <ChartRow key={status} label={status} count={count} max={allEquipmentList.length}/>; })}</section><section className="aeroground-card ops-card"><div className="ops-section-head"><h2>Faults by category</h2></div>{Object.entries(grouped).map(([label,count]) => <ChartRow key={label} label={label} count={count} max={faults.length}/>)}{!faults.length && <p className="ops-muted">No faults reported.</p>}</section><section className="aeroground-card ops-card"><h2>Maintenance status</h2>{['Created','Assigned','In Progress','Inspection','Completed','Scheduled'].map(status => <ChartRow key={status} label={status} count={orders.filter(o => o.status === status).length} max={orders.length}/>)}</section><section className="aeroground-card ops-card"><h2>Inspection results</h2>{['Pass','Needs Attention','Fail','Pending'].map(result => <ChartRow key={result} label={result} count={inspections.filter(i => i.result === result).length} max={inspections.length}/>)}</section></div></div>;
}
function ChartRow({label,count,max}) { return <div className="ops-chart-row"><span>{label}</span><div className="ops-chart-track"><i style={{width:`${max ? 100*count/max : 0}%`}}/></div><b>{count}</b></div>; }

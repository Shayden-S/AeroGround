import React from 'react';
export function OpsHeader({ eyebrow, title, subtitle, action }) { return <header className="ops-header"><div><span className="ops-eyebrow">{eyebrow || 'APRON CONTROL SUBSYSTEM'}</span><h1>{title}</h1><p>{subtitle}</p></div>{action}</header>; }
export function OpsMetric({ label, value, detail }) { return <div className="aeroground-card ops-metric"><span>{label}</span><strong className="num-tabular">{value}</strong>{detail && <small>{detail}</small>}</div>; }
export function OpsBadge({ text, tone }) { return <span className={`ops-badge ${tone || (/fail|critical|overdue|out of service|blocked/i.test(text) ? 'red' : /pass|completed|available/i.test(text) ? 'green' : /attention|pending|in progress|high/i.test(text) ? 'amber' : 'blue')}`}>{text}</span>; }

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Wrench,
  AlertTriangle,
  PlaneTakeoff,
  ClipboardCheck,
  Users,
  BarChart3,
  Settings,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function PlaceholderPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const getDetails = (pathname) => {
    switch (pathname) {
      case '/maintenance':
        return {
          title: 'Hangar Maintenance & Work Orders',
          subtitle: 'Scheduled servicing, A/B/C checks, hydraulic flushes, and component overhauls',
          icon: Wrench,
          color: '#d97706',
          badge: '4 DUE SOON',
          kpis: [
            { label: 'Active Work Orders', value: '6' },
            { label: 'Hangar Bays In Use', value: 'Bay 2, Bay 4' },
            { label: 'Mechanic Crew On Duty', value: '8 Techs' }
          ]
        };
      case '/fault-reports':
        return {
          title: 'Active Fault Reports & Safety Lockouts',
          subtitle: 'AOG incident logs, ramp defect alerts, grounding orders, and red-tag tracking',
          icon: AlertTriangle,
          color: '#dc2626',
          badge: '2 CRIT LOCKOUTS',
          kpis: [
            { label: 'Active AOG Lockouts', value: '2 Units' },
            { label: 'Avg MTTR Resolution', value: '2.4 hrs' },
            { label: 'Safety Compliance', value: '99.8%' }
          ]
        };
      case '/assignments':
        return {
          title: 'Ramp GSE Flight Allocations',
          subtitle: 'Automated turnaround slotting, pushback tug reservations, and loader dispatch',
          icon: PlaneTakeoff,
          color: '#1d63ed',
          badge: '8 ACTIVE FLIGHTS',
          kpis: [
            { label: 'Turnarounds Active', value: '8 Stands' },
            { label: 'Next Scheduled Wave', value: '15:30 UTC' },
            { label: 'Dispatch Adherence', value: '96.2%' }
          ]
        };
      case '/inspections':
        return {
          title: 'Airside Quality & Safety Inspections',
          subtitle: 'Pre-flight GSE checklists, SIDA protocol compliance audits, and tire/brake logs',
          icon: ClipboardCheck,
          color: '#059669',
          badge: 'NOMINAL',
          kpis: [
            { label: 'Completed Today', value: '38 Audits' },
            { label: 'Pending Walkaround', value: '4 Assets' },
            { label: 'Audit Score', value: '98.5%' }
          ]
        };
      case '/users':
        return {
          title: 'Apron Operators & Personnel Directory',
          subtitle: 'Certified pushback drivers, GSE mechanics, airside controllers, and badge clearances',
          icon: Users,
          color: '#2563eb',
          badge: '34 ON AIRSIDE',
          kpis: [
            { label: 'Shift Operators', value: '34 Active' },
            { label: 'SIDA Level 4 Badges', value: '28 Holders' },
            { label: 'Radio Channels Active', value: 'CH 1, 3, 7' }
          ]
        };
      case '/reports':
        return {
          title: 'Fleet Analytics & Telemetry Reports',
          subtitle: 'Fuel burn analytics, battery duty cycle curves, turnaround punctuality, and ROI logs',
          icon: BarChart3,
          color: '#7c3aed',
          badge: 'UPDATED HOURLY',
          kpis: [
            { label: 'Monthly Fleet Uptime', value: '97.4%' },
            { label: 'Fuel Conserved (e-GSE)', value: '14,200 L' },
            { label: 'Turnaround Delta', value: '-3.8 mins' }
          ]
        };
      case '/settings':
        return {
          title: 'Terminal Telemetry System Settings',
          subtitle: 'Apron mesh 5G frequencies, transponder poll rates, SIDA credentials, and API relays',
          icon: Settings,
          color: '#475569',
          badge: 'v4.18.2-SIN',
          kpis: [
            { label: 'Telemetry Mesh Gateway', value: 'SIN-T1-GW09' },
            { label: 'Ping Poll Interval', value: '3.0 sec' },
            { label: 'MERN API Backend', value: 'localhost:5000' }
          ]
        };
      default:
        return {
          title: 'Operational Subsystem',
          subtitle: 'AeroGround GSE Mission Control',
          icon: ShieldCheck,
          color: '#1d63ed',
          badge: 'ONLINE',
          kpis: []
        };
    }
  };

  const details = getDetails(location.pathname);
  const Icon = details.icon;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: details.color, letterSpacing: '0.04em' }}>
              APRON CONTROL SUBSYSTEM
            </span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>SIDA SECURE ZONE B</span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            {details.title}
          </h1>

          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
            {details.subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
            style={{ fontSize: '12px', height: '36px' }}
          >
            ← Apron Command Center
          </button>
          <button
            onClick={() => navigate('/equipment')}
            className="btn-primary"
            style={{ fontSize: '12px', height: '36px' }}
          >
            Fleet Inventory
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {details.kpis.map((kpi) => (
          <div key={kpi.label} className="aeroground-card" style={{ padding: '18px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.04em' }}>
              {kpi.label}
            </span>
            <div className="num-tabular" style={{ fontSize: '24px', fontWeight: '800', color: '#0b1c30', marginTop: '6px' }}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Module Overview Card */}
      <div
        className="aeroground-card"
        style={{
          padding: '36px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff'
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            backgroundColor: `${details.color}15`,
            color: details.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}
        >
          <Icon size={28} />
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0b1c30', marginBottom: '8px' }}>
          {details.title} — Active Telemetry Rail
        </h3>

        <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '520px', lineHeight: 1.6, marginBottom: '20px' }}>
          This subsystem connects directly into the central AeroGround flightline telemetry network. Real-time data streams and MERN controller synchronization will bind with the live MongoDB cluster in the next phase.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
            style={{ fontSize: '13px', height: '38px', padding: '0 16px' }}
          >
            <span>Return to Apron Command Center</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

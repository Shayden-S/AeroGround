import React from 'react';
import { AlertTriangle, Wrench, CheckCircle2 } from 'lucide-react';

export default function NotificationDropdown({ isOpen, onClose }) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      type: 'critical',
      title: 'AOG Critical Lockout: TUG-017',
      desc: 'High-pressure steering hydraulic hose rupture at Gate A2 Ramp Lane.',
      time: '12m ago',
      icon: AlertTriangle,
      color: '#dc2626'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Hangar Maintenance Due: TUG-008',
      desc: '250hr Hydraulic Fluid & Filter Flush scheduled in Bay 2 Hangar 3.',
      time: '34m ago',
      icon: Wrench,
      color: '#d97706'
    },
    {
      id: 3,
      type: 'info',
      title: 'FOD Sweeper Run Cleared',
      desc: 'Routine sweep completed across Apron North Taxiways. Zero debris logged.',
      time: '1h ago',
      icon: CheckCircle2,
      color: '#059669'
    }
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: '8px',
        width: '360px',
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-medium)',
        borderRadius: '8px',
        boxShadow: 'var(--shadow-level-2)',
        zIndex: 1000,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-default)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8fafc'
        }}
      >
        <span style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)' }}>
          Apron Dispatch Alerts
        </span>
        <span
          style={{
            fontSize: '11px',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '2px 6px',
            borderRadius: '10px',
            fontWeight: '600'
          }}
        >
          3 Active
        </span>
      </div>

      <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                gap: '12px',
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: `${n.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: n.color,
                  flexShrink: 0,
                  marginTop: '2px'
                }}
              >
                <Icon size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {n.title}
                  </span>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>{n.time}</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.4 }}>
                  {n.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          padding: '10px 16px',
          textAlign: 'center',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid var(--border-default)'
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '12px',
            fontWeight: '600',
            color: 'var(--primary)',
            cursor: 'pointer'
          }}
        >
          Dismiss & View Full Incident Log
        </button>
      </div>
    </div>
  );
}

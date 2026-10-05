import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, LogOut, Clock } from 'lucide-react';
import crewImg from '../../assets/crew.png';

export default function ProfileMenu({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    onClose();
    navigate('/login');
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: '8px',
        width: '280px',
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-medium)',
        borderRadius: '8px',
        boxShadow: 'var(--shadow-level-2)',
        zIndex: 1000,
        overflow: 'hidden'
      }}
    >
      {/* Operator Details */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-default)', backgroundColor: '#f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={crewImg}
            alt="Sarah Jenkins"
            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>
              Sarah Jenkins
            </div>
            <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '600' }}>
              Operations Manager
            </div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>
              Station: STN-1104 • Lead Dispatch
            </div>
          </div>
        </div>
      </div>

      {/* SIDA Badge info */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: '600', marginBottom: '4px' }}>
          <ShieldCheck size={14} />
          <span>SIDA Level 4 Airside Clearance</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '11px' }}>
          <Clock size={12} />
          <span>Shift: 14:00 – 22:00 (Active)</span>
        </div>
      </div>

      {/* Menu Options */}
      <div style={{ padding: '6px 0' }}>
        <button
          onClick={() => { onClose(); navigate('/settings'); }}
          style={{
            width: '100%',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: 'none',
            background: 'none',
            color: 'var(--text-primary)',
            fontSize: '13px',
            cursor: 'pointer',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <User size={15} color="#64748b" />
          <span>Operator Profile & Credentials</span>
        </button>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: 'none',
            background: 'none',
            color: '#dc2626',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: 'left',
            borderTop: '1px solid #f1f5f9'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <LogOut size={15} color="#dc2626" />
          <span>Sign Out / Lock Workstation</span>
        </button>
      </div>
    </div>
  );
}

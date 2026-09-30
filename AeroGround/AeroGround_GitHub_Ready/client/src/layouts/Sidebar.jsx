import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  Wrench,
  AlertTriangle,
  PlaneTakeoff,
  ClipboardCheck,
  Users,
  BarChart3,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import ProgressBar from '../components/common/ProgressBar';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Equipment', path: '/equipment', icon: Truck },
    { label: 'Maintenance', path: '/maintenance', icon: Wrench, badge: '4 DUE', badgeColor: '#d97706', badgeBg: 'rgba(217, 119, 6, 0.2)' },
    { label: 'Fault Reports', path: '/fault-reports', icon: AlertTriangle, badge: '2 CRIT', badgeColor: '#dc2626', badgeBg: 'rgba(220, 38, 38, 0.2)' },
    { label: 'Assignments', path: '/assignments', icon: PlaneTakeoff },
    { label: 'Inspections', path: '/inspections', icon: ClipboardCheck },
    { label: 'Users', path: '/users', icon: Users },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 25, 44, 0.6)',
            zIndex: 1100,
            display: 'block'
          }}
          className="sidebar-backdrop"
        />
      )}

      <aside
        style={{
          width: 'var(--sidebar-width)',
          height: '100vh',
          position: 'sticky',
          top: 0,
          backgroundColor: '#0b1626',
          borderRight: '1px solid #1a273a',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1200,
          flexShrink: 0,
          color: '#94a3b8',
          userSelect: 'none'
        }}
        className={`app-sidebar ${isOpen ? 'sidebar-open' : ''}`}
      >
        {/* Logo & Brand Header */}
        <div
          style={{
            padding: '18px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid #142236'
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#070f1a',
              border: '1px solid #1e3352',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            <img src={logoImg} alt="AeroGround" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '15px', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              AeroGround
            </div>
            <div style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '2px', lineHeight: 1.2 }}>
              Airport GSE Operations
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="sidebar-close-btn"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px'
              }}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '16px 10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '13px',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                })}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.backgroundColor = '#13233a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.color = '#94a3b8';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: item.badgeBg,
                      color: item.badgeColor,
                      border: `1px solid ${item.badgeColor}40`,
                      lineHeight: 1.1
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Apron Live Status Box (matches bottom of screenshots) */}
        <div style={{ padding: '0 12px 14px 12px' }}>
          <div
            style={{
              backgroundColor: '#081220',
              border: '1px solid #162a42',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#059669',
                  display: 'inline-block'
                }}
                className="status-pulse"
              />
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#059669', letterSpacing: '0.04em' }}>
                APRON LIVE STATUS
              </span>
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '11px', fontWeight: '500', marginBottom: '8px' }}>
              Gate A1-A10 Operational
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ color: '#64748b', fontSize: '10px' }}>Readiness</span>
              <span className="num-tabular" style={{ color: '#059669', fontWeight: '700', fontSize: '11px' }}>
                88%
              </span>
            </div>
            <ProgressBar value={88} max={100} height={4} color="#059669" bgColor="#162a42" />
          </div>

          {/* Logout Button */}
          <button
            onClick={() => navigate('/login')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              marginTop: '10px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: '#94a3b8',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.backgroundColor = '#13233a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

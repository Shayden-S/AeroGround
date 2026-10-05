import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Plus,
  Bell,
  ChevronDown,
  Menu,
  CheckCircle
} from 'lucide-react';
import crewImg from '../assets/crew.png';
import NotificationDropdown from '../components/common/NotificationDropdown';
import ProfileMenu from '../components/common/ProfileMenu';
import Modal from '../components/common/Modal';

const areaToTerminal = {
  'All Apron Areas': 'Terminal 1 - Apron North [T1-N]',
  'Gates A1–A5': 'Terminal 1 - Apron North [T1-N]',
  'Maintenance Hangar 3': 'Central GSE Maintenance Hangar [H-03]',
  'Remote Stands R1–R4': 'Terminal 3 - Remote Cargo [T3-C]',
  'Terminal 2 - Apron South': 'Terminal 2 - Apron South [T2-S]'
};

export default function TopHeader({ onToggleSidebar, selectedArea, onAreaChange }) {
  const navigate = useNavigate();
  const selectedTerminal = areaToTerminal[selectedArea] || areaToTerminal['All Apron Areas'];
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFaultModalOpen, setIsFaultModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Form states for modals
  const [faultAsset, setFaultAsset] = useState('TUG-017');
  const [faultSeverity, setFaultSeverity] = useState('Critical AOG');
  const [faultDesc, setFaultDesc] = useState('');
  const [faultSuccess, setFaultSuccess] = useState(false);

  const [assignAsset, setAssignAsset] = useState('TUG-004');
  const [assignFlight, setAssignFlight] = useState('SQ802 (A350-900)');
  const [assignGate, setAssignGate] = useState('Gate A2');
  const [assignSuccess, setAssignSuccess] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/equipment?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleReportFaultSubmit = (e) => {
    e.preventDefault();
    setFaultSuccess(true);
    setTimeout(() => {
      setFaultSuccess(false);
      setIsFaultModalOpen(false);
      setFaultDesc('');
    }, 1500);
  };

  const handleQuickAssignSubmit = (e) => {
    e.preventDefault();
    setAssignSuccess(true);
    setTimeout(() => {
      setAssignSuccess(false);
      setIsAssignModalOpen(false);
    }, 1500);
  };

  return (
    <>
      <header
        style={{
          height: 'var(--header-height)',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}
      >
        {/* Left Section: Mobile Menu Button, Search Bar, Terminal Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, maxWidth: '720px' }}>
          <button
            onClick={onToggleSidebar}
            className="mobile-hamburger-btn"
            style={{
              display: 'none',
              background: 'none',
              border: '1px solid var(--border-medium)',
              borderRadius: '4px',
              padding: '6px',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
            aria-label="Toggle navigation menu"
          >
            <Menu size={18} />
          </button>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '11px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8'
              }}
            />
            <input
              type="text"
              placeholder="Search equipment, flight, work order..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{
                paddingLeft: '34px',
                paddingRight: '12px',
                fontSize: '12px',
                height: '34px',
                backgroundColor: '#f8fafc'
              }}
            />
          </form>

          {/* Terminal Zone Selector */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-medium)',
                borderRadius: '4px',
                padding: '0 12px',
                height: '34px',
                fontSize: '12px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              <MapPin size={14} color="#1d63ed" />
              <select
                value={selectedTerminal}
                onChange={(e) => {
                  const area = {
                    'Terminal 1 - Apron North [T1-N]': 'Gates A1–A5',
                    'Terminal 2 - Apron South [T2-S]': 'Terminal 2 - Apron South',
                    'Terminal 3 - Remote Cargo [T3-C]': 'Remote Stands R1–R4',
                    'Central GSE Maintenance Hangar [H-03]': 'Maintenance Hangar 3'
                  }[e.target.value];
                  onAreaChange(area);
                  navigate('/dashboard');
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  appearance: 'none',
                  paddingRight: '16px'
                }}
              >
                <option value="Terminal 1 - Apron North [T1-N]">Terminal 1 - Apron North [T1-N]</option>
                <option value="Terminal 2 - Apron South [T2-S]">Terminal 2 - Apron South [T2-S]</option>
                <option value="Terminal 3 - Remote Cargo [T3-C]">Terminal 3 - Remote Cargo [T3-C]</option>
                <option value="Central GSE Maintenance Hangar [H-03]">Central GSE Maintenance Hangar [H-03]</option>
              </select>
              <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: '10px', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        {/* Right Section: Action Buttons, Notifications, Operator Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* + Report Fault Button */}
          <button
            onClick={() => setIsFaultModalOpen(true)}
            className="btn-danger"
            style={{ height: '34px', fontSize: '12px', padding: '0 12px' }}
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Report Fault</span>
          </button>

          {/* + Quick Assign Button */}
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="btn-primary"
            style={{ height: '34px', fontSize: '12px', padding: '0 12px' }}
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Quick Assign</span>
          </button>

          {/* Notifications Icon with Badge */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '6px',
                border: '1px solid var(--border-medium)',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                position: 'relative'
              }}
              aria-label="View notifications"
            >
              <Bell size={16} />
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: '700',
                  borderRadius: '10px',
                  padding: '1px 5px',
                  lineHeight: 1.2
                }}
              >
                3
              </span>
            </button>
            <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-default)' }} />

          {/* Operator Profile Menu */}
          <div ref={profileRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                padding: '4px 6px',
                borderRadius: '6px',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {/* Avatar with crew.png */}
              <div style={{ position: 'relative', width: '34px', height: '34px' }}>
                <img
                  src={crewImg}
                  alt="Sarah Jenkins"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1px solid #cbd5e1'
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: '#059669',
                    border: '2px solid #ffffff'
                  }}
                />
              </div>

              <div className="header-operator-text" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  Sarah Jenkins
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.2 }}>
                  Operations Manager
                </span>
              </div>
            </button>
            <ProfileMenu isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
          </div>
        </div>
      </header>

      {/* Report Fault Modal */}
      <Modal
        isOpen={isFaultModalOpen}
        onClose={() => setIsFaultModalOpen(false)}
        title="Emergency / Ground Fault Incident Report"
        subtitle="Immediately tag an asset as Out of Service (OOS) and alert Ramp Maintenance"
      >
        {faultSuccess ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle size={48} color="#059669" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#059669' }}>Fault Incident Logged!</h4>
            <p style={{ fontSize: '13px', color: '#475569', marginTop: '6px' }}>
              Asset {faultAsset} has been locked out with AOG tag. Incident dispatched to Hangar 3 team.
            </p>
          </div>
        ) : (
          <form onSubmit={handleReportFaultSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                AFFECTED GSE ASSET IDENTIFIER
              </label>
              <select
                className="form-input"
                value={faultAsset}
                onChange={(e) => setFaultAsset(e.target.value)}
              >
                <option value="TUG-017">TUG-017 — TLD TPX-300 (Gate A3)</option>
                <option value="BUS-021">BUS-021 — Cobus 3000 Shuttle (Remote Stand R3)</option>
                <option value="BL-011">BL-011 — TLD NBL Electric (Gate A1)</option>
                <option value="GPU-006">GPU-006 — Hobart PoWr 90kVA (Bay S3)</option>
                <option value="CT-004">CT-004 — Mallaghan CT6000 (Stand R2)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                SEVERITY / OPERATIONAL LOCKOUT LEVEL
              </label>
              <select
                className="form-input"
                value={faultSeverity}
                onChange={(e) => setFaultSeverity(e.target.value)}
              >
                <option value="Critical AOG">CRITICAL AOG (Immediate Grounding & Ramp Stop)</option>
                <option value="High Fault">HIGH FAULT (Mechanical / Hydraulic Restriction)</option>
                <option value="Minor Observation">MINOR OBSERVATION (Log for Next Shift Maintenance)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                FAULT DESCRIPTION & LOCATION DETAILS
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe mechanical malfunction, fluid leaks, electrical errors, or impact details..."
                value={faultDesc}
                onChange={(e) => setFaultDesc(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsFaultModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-danger">
                Confirm & Tag Out of Service
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Quick Assign Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Quick GSE Dispatch & Flight Slotting"
        subtitle="Directly slot available ramp equipment to arriving or departing flights"
      >
        {assignSuccess ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle size={48} color="#059669" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#059669' }}>GSE Assigned Successfully!</h4>
            <p style={{ fontSize: '13px', color: '#475569', marginTop: '6px' }}>
              Asset {assignAsset} is now allocated to {assignFlight} at {assignGate}. Driver dispatch notified.
            </p>
          </div>
        ) : (
          <form onSubmit={handleQuickAssignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                AVAILABLE GSE UNIT
              </label>
              <select
                className="form-input"
                value={assignAsset}
                onChange={(e) => setAssignAsset(e.target.value)}
              >
                <option value="TUG-004">TUG-004 — TLD TPX-100 (Ready - Standby Staging)</option>
                <option value="GPU-006">GPU-006 — Hobart PoWr 90kVA (Available - Bay S3)</option>
                <option value="BT-009">BT-009 — Charlatte T137 Tractor (Available - Sorting Level)</option>
                <option value="BL-011">BL-011 — TLD NBL Electric Loader (Available)</option>
                <option value="LAV-001">LAV-001 — Vestergaard Mini (Available)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                TARGET FLIGHT TURNAROUND
              </label>
              <select
                className="form-input"
                value={assignFlight}
                onChange={(e) => setAssignFlight(e.target.value)}
              >
                <option value="SQ802 (A350-900)">SQ802 — Singapore Airlines (Airbus A350-900) - Gate A2</option>
                <option value="BA249 (B777-300ER)">BA249 — British Airways (Boeing 777) - Gate A1</option>
                <option value="LH404 (A321neo)">LH404 — Lufthansa (Airbus A321neo) - Gate A3</option>
                <option value="AF256 (A320)">AF256 — Air France (Airbus A320) - Gate A4</option>
                <option value="SQ318 (B787-10)">SQ318 — Singapore Airlines (Dreamliner) - Gate A5</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                RAMP LOCATION / GATE
              </label>
              <select
                className="form-input"
                value={assignGate}
                onChange={(e) => setAssignGate(e.target.value)}
              >
                <option value="Gate A2">Gate A2 (Open Stand)</option>
                <option value="Gate A1">Gate A1 (Heavy Bay)</option>
                <option value="Gate A3">Gate A3 (Narrow Body)</option>
                <option value="Gate A4">Gate A4 (Narrow Body)</option>
                <option value="Gate A5">Gate A5 (Wide Body)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsAssignModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Dispatch GSE to Stand
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}

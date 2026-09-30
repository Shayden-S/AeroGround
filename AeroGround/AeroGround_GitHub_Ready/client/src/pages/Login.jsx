import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  MapPin,
  Lock,
  Mail,
  Radio,
  CheckCircle2,
  Clock,
  PlaneTakeoff,
  Wifi,
  ArrowRight
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import planeBg from '../assets/plane.png';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('s.jenkins@aeroground.ops');
  const [password, setPassword] = useState('••••••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [terminalZone, setTerminalZone] = useState('Terminal 1 - Apron North (Standard Shift)');
  const [rememberStation, setRememberStation] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 400);
  };

  const handleSsoClick = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundImage: `linear-gradient(rgba(10, 22, 38, 0.88), rgba(8, 18, 32, 0.94)), url(${planeBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: '#ffffff',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Main Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px'
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '48px',
            alignItems: 'center'
          }}
        >
          {/* Left Column: Mission Cockpit Info & Telemetry */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Top Status Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(5, 150, 105, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.05em',
                  color: '#34d399'
                }}
              >
                <span
                  style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }}
                  className="status-pulse"
                />
                <span>APRON OPS NODE LIVE</span>
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '0.04em', fontWeight: '600' }}>
                SIDA SECURE ZONE B
              </span>
            </div>

            {/* Logo & Category */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: '#0a1626',
                  border: '1px solid #233854',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px'
                }}
              >
                <img src={logoImg} alt="AeroGround" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: '800', fontSize: '15px', letterSpacing: '0.04em' }}>
                  AEROGROUND
                </span>
                <span style={{ color: '#475569' }}>|</span>
                <span style={{ fontSize: '12px', color: '#94a3b8', letterSpacing: '0.05em', fontWeight: '600' }}>
                  FLIGHTLINE OPS
                </span>
              </div>
            </div>

            {/* Big Headline */}
            <div>
              <h1
                style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  lineHeight: '1.2',
                  letterSpacing: '-0.02em',
                  marginBottom: '14px',
                  color: '#ffffff'
                }}
              >
                Airport Ground Support Equipment Cockpit
              </h1>
              <p
                style={{
                  fontSize: '15px',
                  color: '#94a3b8',
                  lineHeight: '1.6',
                  maxWidth: '540px'
                }}
              >
                Real-time telemetry, automated turnaround slotting, and mission-critical ramp GSE dispatch management console.
              </p>
            </div>

            {/* 3 Metric Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginTop: '8px'
              }}
            >
              {/* Card 1 */}
              <div
                style={{
                  backgroundColor: 'rgba(15, 28, 48, 0.75)',
                  border: '1px solid rgba(30, 58, 95, 0.6)',
                  borderRadius: '6px',
                  padding: '14px',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em' }}>
                  ACTIVE UNITS
                </div>
                <div className="num-tabular" style={{ fontSize: '26px', fontWeight: '800', color: '#ffffff', margin: '4px 0' }}>
                  142
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#10b981', fontWeight: '600' }}>
                  <Wifi size={12} />
                  <span>98.4% Ping</span>
                </div>
              </div>

              {/* Card 2 */}
              <div
                style={{
                  backgroundColor: 'rgba(15, 28, 48, 0.75)',
                  border: '1px solid rgba(30, 58, 95, 0.6)',
                  borderRadius: '6px',
                  padding: '14px',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em' }}>
                  AVG TURNAROUND
                </div>
                <div className="num-tabular" style={{ fontSize: '26px', fontWeight: '800', color: '#ffffff', margin: '4px 0' }}>
                  38m
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#cbd5e1' }}>
                  <Clock size={12} />
                  <span>-4m target</span>
                </div>
              </div>

              {/* Card 3 */}
              <div
                style={{
                  backgroundColor: 'rgba(15, 28, 48, 0.75)',
                  border: '1px solid rgba(30, 58, 95, 0.6)',
                  borderRadius: '6px',
                  padding: '14px',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em' }}>
                  GATES SERVICED
                </div>
                <div className="num-tabular" style={{ fontSize: '26px', fontWeight: '800', color: '#ffffff', margin: '4px 0' }}>
                  28
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#38bdf8' }}>
                  <PlaneTakeoff size={12} />
                  <span>Nominal</span>
                </div>
              </div>
            </div>

            {/* SIDA Protocol Banner */}
            <div
              style={{
                backgroundColor: 'rgba(15, 28, 48, 0.65)',
                border: '1px solid rgba(30, 58, 95, 0.5)',
                borderRadius: '6px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <ShieldCheck size={20} color="#94a3b8" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', letterSpacing: '0.04em' }}>
                  SIDA PROTOCOL ACTIVE
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', lineHeight: 1.4 }}>
                  Access is restricted to certified ramp supervisors, GSE mechanics, and ramp controllers. Terminal logbook auto-sync active.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Operator Sign In Card */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '460px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.1)',
                padding: '32px',
                color: 'var(--text-primary)'
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span
                  style={{
                    backgroundColor: '#eff6ff',
                    color: '#1d63ed',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '0.03em'
                  }}
                >
                  TERMINAL AUTH V4.18
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: '600', color: '#059669' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }} />
                  TLS 1.3 SECURE
                </span>
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0b1c30', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                Operator Sign In
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
                Enter your aviation network credentials or scan your physical apron badge.
              </p>

              {/* Login Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Email / ID Field */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', letterSpacing: '0.04em', marginBottom: '6px' }}>
                    WORK EMAIL / GROUND OPS ID
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={16}
                      style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
                    />
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        height: '42px',
                        padding: '0 12px 0 38px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        backgroundColor: '#f8fafc',
                        fontSize: '13px',
                        color: '#0b1c30',
                        fontWeight: '500'
                      }}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', letterSpacing: '0.04em' }}>
                      SECURE PASSWORD
                    </label>
                    <a
                      href="#help"
                      onClick={(e) => { e.preventDefault(); alert('Please contact Airport IT Dispatch at ext. 4410 or Channel 7.'); }}
                      style={{ fontSize: '11px', color: '#1d63ed', textDecoration: 'none', fontWeight: '600' }}
                    >
                      IT Dispatch Help?
                    </a>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={16}
                      style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        height: '42px',
                        padding: '0 38px 0 38px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        backgroundColor: '#f8fafc',
                        fontSize: '13px',
                        color: '#0b1c30',
                        fontWeight: '500'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Terminal & Apron Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', letterSpacing: '0.04em', marginBottom: '6px' }}>
                    ACTIVE TERMINAL & APRON ZONE
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin
                      size={16}
                      style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
                    />
                    <select
                      value={terminalZone}
                      onChange={(e) => setTerminalZone(e.target.value)}
                      style={{
                        width: '100%',
                        height: '42px',
                        padding: '0 12px 0 38px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        backgroundColor: '#f8fafc',
                        fontSize: '13px',
                        color: '#0b1c30',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Terminal 1 - Apron North (Standard Shift)">Terminal 1 - Apron North (Standard Shift)</option>
                      <option value="Terminal 2 - Apron South">Terminal 2 - Apron South</option>
                      <option value="Terminal 3 - Remote Cargo Apron">Terminal 3 - Remote Cargo Apron</option>
                      <option value="Central Maintenance Hangar Zone">Central Maintenance Hangar Zone</option>
                    </select>
                  </div>
                </div>

                {/* Remember Station Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="rememberWorkstation"
                    checked={rememberStation}
                    onChange={(e) => setRememberStation(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#1d63ed', cursor: 'pointer' }}
                  />
                  <label htmlFor="rememberWorkstation" style={{ fontSize: '12px', color: '#475569', cursor: 'pointer' }}>
                    Remember terminal workstation
                  </label>
                </div>

                {/* Submit Sign In Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{
                    height: '44px',
                    fontSize: '14px',
                    fontWeight: '700',
                    width: '100%',
                    backgroundColor: '#004bc3',
                    borderColor: '#004bc3'
                  }}
                >
                  <span>{isSubmitting ? 'Authenticating Workstation...' : 'Sign In to Operations Console'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* SSO Divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  margin: '20px 0',
                  color: '#94a3b8',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.04em'
                }}
              >
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                <span>QUICK VERIFICATION</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
              </div>

              {/* SSO Badge Button */}
              <button
                type="button"
                onClick={handleSsoClick}
                style={{
                  width: '100%',
                  height: '42px',
                  border: '1px solid #bfdbfe',
                  backgroundColor: '#eff6ff',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#1d63ed',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dbeafe')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#eff6ff')}
              >
                <Radio size={16} />
                <span>Aviation SSO / Airport ID Card Badge-In</span>
              </button>

              {/* Gateway & Latency strip */}
              <div
                style={{
                  marginTop: '20px',
                  padding: '8px 12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11px',
                  color: '#64748b'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }} />
                  <span style={{ fontWeight: '600' }}>GW: SIN-T1-GATEWAY-09</span>
                </div>
                <span className="num-tabular" style={{ fontWeight: '600' }}>LATENCY: 12ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(8, 18, 32, 0.95)',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          color: '#94a3b8',
          letterSpacing: '0.02em'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          <span>SYSTEM VERSION: v4.18.2-SIN</span>
          <span>/</span>
          <span>48 ACTIVE GSE TRANSPONDERS CONNECTED</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
          <CheckCircle2 size={13} color="#10b981" />
          <span>DISPATCH TELEMETRY RELAY OPERATIONAL</span>
        </div>
      </footer>
    </div>
  );
}

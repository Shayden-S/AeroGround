import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Plus,
  FileText,
  Radio,
  Compass,
  Zap,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  ChevronRight,
  Plane,
  User,
  RefreshCw,
  Flame,
  Sun,
  ShieldAlert
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import ProgressBar from '../components/common/ProgressBar';
import Modal from '../components/common/Modal';
import {
  dashboardGatesData,
  fleetStatusDonutData,
  categoryRosterData,
  upcomingMaintenanceData,
  activeFaultIncidents,
  tacticalActions
} from '../data/dashboardData';
import { allEquipmentList } from '../data/equipmentData';

function equipmentAsGate(item) {
  return { gateId: item.id, primaryTelemetry: {
    assetId: item.id, name: `${item.makeModel} · ${item.category}`, status: item.status,
    fuelBattery: item.fuelBattery, fuelRemainingText: item.powerType,
    hydraulicPressure: 0, pressureStatus: 'No live pressure feed',
    activeLocation: item.location, operator: item.assignedOperator,
    gps: item.gps, engineHours: `${item.operatingHours.toLocaleString()} hrs`, nextCheck: item.nextCheck
  }};
}

export default function MainDashboard() {
  const navigate = useNavigate();
  const { selectedArea, setSelectedArea } = useOutletContext();

  // UTC clock
  const [utcTime, setUtcTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${hours}:${minutes}:${seconds} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Selected gate for Telemetry Inspector
  const [selectedGate, setSelectedGate] = useState(dashboardGatesData[0]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
  const zoneEquipment = allEquipmentList.filter(item => selectedArea === 'Maintenance Hangar 3' ? item.zone === 'Maintenance Hangar' : selectedArea === 'Remote Stands R1–R4' ? item.zone === 'Remote Stands' && /R[1-4]\b/.test(item.location) : false);
  const showingGates = selectedArea === 'All Apron Areas' || selectedArea === 'Gates A1–A5';
  const hasAreaData = showingGates || zoneEquipment.length > 0;
  const inspectedGate = showingGates ? selectedGate : equipmentAsGate(zoneEquipment.find(item => item.id === selectedEquipmentId) || zoneEquipment[0] || allEquipmentList[0]);

  // Modals
  const [inspectModalIncident, setInspectModalIncident] = useState(null);
  const [actionSuccessModal, setActionSuccessModal] = useState(null);
  const [diagnosticPingStatus, setDiagnosticPingStatus] = useState(null);

  const handlePingTransceiver = () => {
    setDiagnosticPingStatus('Simulating diagnostic for ' + inspectedGate.primaryTelemetry.assetId + '...');
    setTimeout(() => {
      setDiagnosticPingStatus('Prototype diagnostic complete. No live transceiver is connected.');
      setTimeout(() => setDiagnosticPingStatus(null), 3500);
    }, 800);
  };

  const handleTacticalAction = (action) => {
    setActionSuccessModal(action);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Subheader: Ramp Dispatch Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#059669' }}
              className="status-pulse"
            />
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#059669', letterSpacing: '0.04em' }}>
              RAMP DISPATCH LIVE
            </span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span className="num-tabular" style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
              {utcTime || '09:43:48 UTC'}
            </span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            Apron Operations Command Center — Terminal 1
          </h1>

          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
            Shift: Afternoon Turnaround (14:00 – 22:00) • Lead Dispatcher: <strong style={{ color: 'var(--text-primary)' }}>S. Jenkins (STN-1104)</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
              // Open quick fault
              const faultBtn = document.querySelector('header .btn-danger');
              if (faultBtn) faultBtn.click();
            }}
            className="btn-danger"
            style={{ height: '36px', fontSize: '12px', padding: '0 12px' }}
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Quick Fault Ticket</span>
          </button>

          <button
            onClick={() => {
              // Open quick assign
              const assignBtn = document.querySelector('header .btn-primary');
              if (assignBtn) assignBtn.click();
            }}
            className="btn-primary"
            style={{ height: '36px', fontSize: '12px', padding: '0 12px' }}
          >
            <Plane size={14} />
            <span>Assign GSE to Flight</span>
          </button>

          <button
            onClick={() => alert('Generating full shift telemetry report PDF (SIN-T1-1400)...')}
            className="btn-secondary"
            style={{ height: '36px', fontSize: '12px', padding: '0 12px' }}
          >
            <FileText size={14} />
            <span>Export Shift PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Area Filters Bar & Weather Telemetry */}
      <div
        className="aeroground-card"
        style={{
          padding: '8px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {['All Apron Areas', 'Gates A1–A5', 'Maintenance Hangar 3', 'Remote Stands R1–R4'].map((area) => {
            const isActive = selectedArea === area;
            return (
              <button
                key={area}
                onClick={() => { setSelectedArea(area); setSelectedEquipmentId(null); }}
                style={{
                  padding: '5px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: isActive ? '700' : '500',
                  backgroundColor: isActive ? '#004bc3' : '#ffffff',
                  color: isActive ? '#ffffff' : '#475569',
                  border: isActive ? '1px solid #004bc3' : '1px solid var(--border-medium)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {area}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#475569' }}>
          <div>
            Apron Surface Wind: <strong className="num-tabular" style={{ color: '#0b1c30' }}>240° / 11 kts</strong>
          </div>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>FOD Sweeper Run:</span>
            <span style={{ color: '#059669', fontWeight: '700' }}>Passed (13:45)</span>
          </div>
        </div>
      </div>

      <p style={{ fontSize: '11px', color: '#64748b', margin: '-10px 0 0' }}>
        Viewing: <strong>{selectedArea}</strong>. The map and inspector follow this selection; fleet KPI cards and charts below remain fleet-wide prototype totals.
      </p>

      {/* 3. 5 Fleet KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px'
        }}
      >
        {/* KPI 1: TOTAL GSE FLEET */}
        <div className="aeroground-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              TOTAL GSE FLEET
            </span>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#1d63ed', backgroundColor: '#eff6ff', padding: '1px 6px', borderRadius: '4px' }}>
              +2 MoM
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span className="num-tabular" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>
              48
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>assets</span>
          </div>
          <ProgressBar value={94} max={100} height={4} color="#1d63ed" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={12} color="#059669" />
              94% Operational
            </span>
            <span>T1-Ramp</span>
          </div>
        </div>

        {/* KPI 2: AVAILABLE (READY) */}
        <div className="aeroground-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              AVAILABLE (READY)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700', color: '#059669', backgroundColor: '#ecfdf5', padding: '1px 6px', borderRadius: '4px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#059669' }} />
              Staged
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span className="num-tabular" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>
              32
            </span>
            <span className="num-tabular" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>66.7% fleet</span>
          </div>
          <ProgressBar value={66.7} max={100} height={4} color="#059669" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
            <span>Staging Bays S1-S6</span>
            <span style={{ color: '#059669', fontWeight: '600' }}>Immediate Deploy</span>
          </div>
        </div>

        {/* KPI 3: IN TURNAROUND */}
        <div className="aeroground-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              IN TURNAROUND
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700', color: '#d97706', backgroundColor: '#fffbeb', padding: '1px 6px', borderRadius: '4px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#d97706' }} />
              Active Flight
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span className="num-tabular" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>
              8
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>at gate</span>
          </div>
          <ProgressBar value={17} max={100} height={4} color="#d97706" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
            <span>Gates A1, A3, A4</span>
            <span className="num-tabular">Avg 34m left</span>
          </div>
        </div>

        {/* KPI 4: IN MAINTENANCE */}
        <div className="aeroground-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              IN MAINTENANCE
            </span>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#2563eb', backgroundColor: '#eff6ff', padding: '1px 6px', borderRadius: '4px' }}>
              Hangar 3
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span className="num-tabular" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>
              6
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>units</span>
          </div>
          <ProgressBar value={12.5} max={100} height={4} color="#3b82f6" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
            <span>4 Sched • 2 Corrective</span>
            <span>Bays 2 & 4</span>
          </div>
        </div>

        {/* KPI 5: OUT OF SERVICE */}
        <div className="aeroground-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              OUT OF SERVICE
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700', color: '#dc2626', backgroundColor: '#fef2f2', padding: '1px 6px', borderRadius: '4px' }}>
              <AlertTriangle size={11} color="#dc2626" />
              Alert
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span className="num-tabular" style={{ fontSize: '28px', fontWeight: '800', color: '#dc2626', lineHeight: 1 }}>
              2
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>grounded</span>
          </div>
          <ProgressBar value={4.2} max={100} height={4} color="#dc2626" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
            <span>TUG-017, BUS-021</span>
            <span style={{ color: '#dc2626', fontWeight: '700' }}>Tag Locked</span>
          </div>
        </div>
      </div>

      {/* 4. Middle Section: Terminal 1 Apron Radar & Unit Telemetry Inspector */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)',
          gap: '16px',
          alignItems: 'stretch'
        }}
      >
        {/* Apron Radar Allocation Map */}
        <div
          className="aeroground-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Card Title Bar */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-default)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: '#1d63ed',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Compass size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  {showingGates ? 'Terminal 1 Apron Radar & GSE Allocation Map' : `${selectedArea} · Equipment Overview`}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                  {showingGates ? 'Click a gate marker to review its GSE telemetry' : 'Select a unit to review its equipment record and operating details'}
                </p>
              </div>
            </div>

            {/* Radar Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#475569' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }} />
                Available
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#d97706' }} />
                In Turnaround
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0284c7' }} />
                Assigned
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#dc2626' }} />
                OOS / Fault
              </span>
            </div>
          </div>

          {/* Tactical Apron Canvas Container */}
          <div
            style={{
              padding: '16px',
              backgroundColor: '#0a1322',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              flex: 1
            }}
          >
            {/* Taxiway Strip */}
            <div
              style={{
                backgroundColor: '#0f1c30',
                border: '1px dashed #1e3a5f',
                borderRadius: '4px',
                padding: '8px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '11px',
                color: '#94a3b8'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: '700' }}>
                <AlertTriangle size={14} />
                <span>TAXIWAY ALPHA NORTH • ACTIVE FLOW WEST</span>
              </div>
              <span className="mono num-tabular" style={{ color: '#64748b' }}>GEO: 01°21'33"N 103°59'22"E</span>
            </div>

            {/* Gate bays or the selected operational area */}
            {showingGates ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '10px',
                minHeight: '260px'
              }}
            >
              {dashboardGatesData.map((gate) => {
                const isSelected = selectedGate.gateId === gate.gateId;
                const isOccupied = gate.standStatus === 'occupied';

                return (
                  <div
                    key={gate.gateId}
                    onClick={() => setSelectedGate(gate)}
                    style={{
                      backgroundColor: isSelected ? '#12253f' : '#0d182b',
                      border: isSelected ? '2px solid #1d63ed' : '1px solid #1b2f4a',
                      borderRadius: '6px',
                      padding: '12px 10px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                  >
                    {/* Gate Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff' }}>
                        {gate.gateName}
                      </span>
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: '800',
                          padding: '2px 5px',
                          borderRadius: '3px',
                          backgroundColor:
                            gate.classification === 'OPEN' ? 'rgba(5, 150, 105, 0.25)' :
                            gate.classification === 'HEAVY' ? 'rgba(29, 99, 237, 0.25)' :
                            gate.classification === 'WIDE' ? 'rgba(217, 119, 6, 0.25)' : 'rgba(100, 116, 139, 0.25)',
                          color:
                            gate.classification === 'OPEN' ? '#34d399' :
                            gate.classification === 'HEAVY' ? '#60a5fa' :
                            gate.classification === 'WIDE' ? '#fbbf24' : '#cbd5e1'
                        }}
                      >
                        {gate.classification}
                      </span>
                    </div>

                    {/* Flight & Stand Silo */}
                    <div style={{ textAlign: 'center', margin: '14px 0 10px 0' }}>
                      {isOccupied ? (
                        <>
                          <Plane
                            size={28}
                            color="#94a3b8"
                            style={{ margin: '0 auto 6px', transform: 'rotate(180deg)' }}
                          />
                          <div style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff' }}>
                            {gate.flight}
                          </div>
                          <div style={{ fontSize: '10px', color: '#fbbf24', marginTop: '2px' }}>
                            {gate.status}
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              margin: '0 auto 6px',
                              border: '2px dashed #334155',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#64748b'
                            }}
                          >
                            ⛶
                          </div>
                          <div style={{ fontSize: '11px', fontWeight: '700', color: '#34d399' }}>
                            Stand Empty
                          </div>
                          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                            {gate.status}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Assigned GSE Chips at the Gate */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {gate.assignedGse.map((gse) => {
                        const isGseInUse = gse.statusType === 'inuse';
                        const isGseReady = gse.statusType === 'available';
                        const isGseAssigned = gse.statusType === 'assigned';

                        return (
                          <div
                            key={gse.id}
                            style={{
                              backgroundColor: '#070f1a',
                              border: '1px solid #1c324e',
                              borderRadius: '4px',
                              padding: '3px 6px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontSize: '10px'
                            }}
                          >
                            <span style={{ color: '#cbd5e1', fontWeight: '700' }}>{gse.label}</span>
                            <span
                              style={{
                                fontSize: '8px',
                                fontWeight: '800',
                                padding: '1px 4px',
                                borderRadius: '2px',
                                backgroundColor:
                                  isGseReady ? '#065f46' :
                                  isGseInUse ? '#78350f' :
                                  isGseAssigned ? '#0c4a6e' : '#7f1d1d',
                                color:
                                  isGseReady ? '#a7f3d0' :
                                  isGseInUse ? '#fde68a' :
                                  isGseAssigned ? '#bae6fd' : '#fecaca'
                              }}
                            >
                              {gse.tag}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            ) : zoneEquipment.length ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', minHeight: '260px', alignContent: 'start' }}>
                {zoneEquipment.map(item => <button key={item.id} onClick={() => setSelectedEquipmentId(item.id)} style={{ textAlign: 'left', cursor: 'pointer', background: inspectedGate.primaryTelemetry.assetId === item.id ? '#12253f' : '#0d182b', border: inspectedGate.primaryTelemetry.assetId === item.id ? '2px solid #1d63ed' : '1px solid #1b2f4a', borderRadius: '6px', padding: '12px', color: '#fff' }}>
                  <strong style={{ display: 'block', fontSize: '13px' }}>{item.id}</strong>
                  <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', margin: '5px 0' }}>{item.category}</span>
                  <span style={{ display: 'block', fontSize: '10px', color: item.status === 'OUT OF SERVICE' ? '#f87171' : item.status === 'AVAILABLE' ? '#34d399' : '#fbbf24' }}>{item.status}</span>
                  <span style={{ display: 'block', fontSize: '10px', color: '#cbd5e1', marginTop: '6px' }}>{item.location}</span>
                </button>)}
              </div>
            ) : <div style={{ minHeight: '260px', display: 'grid', placeItems: 'center', color: '#cbd5e1', fontSize: '13px', textAlign: 'center' }}>No equipment records are available for {selectedArea} in this prototype.</div>}

            {showingGates && <>
            {/* Perimeter Service Road Strip */}
            <div
              style={{
                backgroundColor: '#070f1a',
                border: '1px solid #16283f',
                borderRadius: '4px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '11px',
                flexWrap: 'wrap'
              }}
            >
              <span style={{ color: '#64748b', fontWeight: '700' }}>PERIMETER SERVICE ROAD:</span>
              <span
                style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.2)',
                  border: '1px solid rgba(220, 38, 38, 0.4)',
                  color: '#f87171',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '700'
                }}
              >
                ● BUS-021 OOS (HOLD R3)
              </span>
              <span
                style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.2)',
                  border: '1px solid rgba(220, 38, 38, 0.4)',
                  color: '#f87171',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '700'
                }}
              >
                ● TUG-017 TOWED TO H3
              </span>
            </div>

            {/* Staging Bay South Bottom Bar */}
            <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Staging Bay South:</span>
              <strong style={{ color: '#34d399' }}>8 Tugs • 6 Loaders Ready</strong>
            </div>
            </>}
          </div>
        </div>

        {/* Unit Telemetry Inspector Side Panel */}
        {hasAreaData ? (
        <div
          className="aeroground-card"
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          {/* Top Panel Title */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={16} color="#1d63ed" />
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  Unit Telemetry Inspector
                </h3>
              </div>
              <StatusBadge status={inspectedGate.primaryTelemetry.status} />
            </div>

            {/* Asset Identifier */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', letterSpacing: '0.04em' }}>
                ASSET IDENTIFIER
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                <span className="num-tabular" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {inspectedGate.primaryTelemetry.assetId}
                </span>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor: '#eff6ff',
                    color: '#1d63ed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Zap size={18} />
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {inspectedGate.primaryTelemetry.name}
              </div>
            </div>

            {/* 2 Telemetry Metric Boxes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              {/* Fuel / Battery */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--border-default)', borderRadius: '6px', padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                  <span>Fuel / Battery</span>
                  <strong className="num-tabular" style={{ color: '#0b1c30' }}>{inspectedGate.primaryTelemetry.fuelBattery}%</strong>
                </div>
                <ProgressBar value={inspectedGate.primaryTelemetry.fuelBattery} max={100} height={4} color="#1d63ed" />
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>
                  {inspectedGate.primaryTelemetry.fuelRemainingText}
                </div>
              </div>

              {/* Hydraulic Press */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--border-default)', borderRadius: '6px', padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                  <span>Hydraulic Press.</span>
                  <strong className="num-tabular" style={{ color: '#0b1c30' }}>{showingGates ? `${inspectedGate.primaryTelemetry.hydraulicPressure.toLocaleString()} PSI` : 'No live feed'}</strong>
                </div>
                <ProgressBar value={85} max={100} height={4} color="#0284c7" />
                <div style={{ fontSize: '10px', color: '#059669', fontWeight: '600', marginTop: '4px' }}>
                  {inspectedGate.primaryTelemetry.pressureStatus}
                </div>
              </div>
            </div>

            {/* Details Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Active Location / Gate</span>
                <strong style={{ color: '#0b1c30' }}>{inspectedGate.primaryTelemetry.activeLocation}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Assigned Operator</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1d63ed', fontWeight: '600' }}>
                  <User size={12} />
                  {inspectedGate.primaryTelemetry.operator}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Telemetry GPS</span>
                <span className="mono num-tabular" style={{ color: '#0b1c30' }}>{inspectedGate.primaryTelemetry.gps}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Total Engine Hours</span>
                <span className="num-tabular" style={{ color: '#0b1c30', fontWeight: '600' }}>{inspectedGate.primaryTelemetry.engineHours}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Next Mandatory Check</span>
                <strong style={{ color: '#0b1c30' }}>{inspectedGate.primaryTelemetry.nextCheck}</strong>
              </div>
            </div>
          </div>

          {/* Action Buttons for Telemetry Unit */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                onClick={() => navigate('/assignments')}
                className="btn-secondary"
                style={{ fontSize: '11px', height: '34px' }}
              >
                <RefreshCw size={13} />
                <span>Reassign Stand</span>
              </button>
              <button
                onClick={() => navigate('/fault-reports/new')}
                className="btn-danger-outline"
                style={{ fontSize: '11px', height: '34px' }}
              >
                <AlertTriangle size={13} />
                <span>Tag OOS</span>
              </button>
            </div>

            <button
              onClick={handlePingTransceiver}
              className="btn-secondary"
              style={{ width: '100%', fontSize: '11px', height: '34px', borderColor: '#bfdbfe', color: '#1d63ed', backgroundColor: '#eff6ff' }}
            >
              <Radio size={13} />
              <span>Ping Transceiver Diagnostic</span>
            </button>

            {diagnosticPingStatus && (
              <div style={{ fontSize: '11px', padding: '6px 8px', borderRadius: '4px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d' }}>
                {diagnosticPingStatus}
              </div>
            )}
          </div>
        </div>
        ) : <div className="aeroground-card" style={{ padding: '24px', display: 'grid', placeItems: 'center', color: '#64748b', textAlign: 'center' }}>No equipment telemetry is available for {selectedArea} in this prototype. Select Terminal 1, the hangar, or remote stands.</div>}
      </div>

      {/* 5. Bottom Row 1: 3 Panels (Fleet Operational Status, Fleet Roster, Upcoming Maintenance) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px'
        }}
      >
        {/* Panel 1: Fleet Operational Status (Donut Chart) */}
        <div className="aeroground-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                Fleet Operational Status
              </h3>
              <span className="num-tabular" style={{ fontSize: '12px', color: '#64748b' }}>
                48 Total Units
              </span>
            </div>

            {/* Donut Chart with SVG */}
            <div style={{ height: '170px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="170" height="170" viewBox="0 0 170 170" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Track */}
                <circle cx="85" cy="85" r="58" fill="none" stroke="#f1f5f9" strokeWidth="20" />
                {/* Available (67%) - #059669 */}
                <circle
                  cx="85"
                  cy="85"
                  r="58"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="20"
                  strokeDasharray="241 364"
                  strokeDashoffset="0"
                />
                {/* In Turnaround (17%) - #d97706 */}
                <circle
                  cx="85"
                  cy="85"
                  r="58"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="20"
                  strokeDasharray="59 364"
                  strokeDashoffset="-244"
                />
                {/* Maintenance (12%) - #3b82f6 */}
                <circle
                  cx="85"
                  cy="85"
                  r="58"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="20"
                  strokeDasharray="41 364"
                  strokeDashoffset="-305"
                />
                {/* Out of Service (4%) - #dc2626 */}
                <circle
                  cx="85"
                  cy="85"
                  r="58"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="20"
                  strokeDasharray="14 364"
                  strokeDashoffset="-348"
                />
              </svg>

              {/* Center Donut Label */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none'
                }}
              >
                <span className="num-tabular" style={{ fontSize: '26px', fontWeight: '800', color: '#0b1c30', lineHeight: 1 }}>
                  94%
                </span>
                <span style={{ fontSize: '9px', fontWeight: '700', color: '#64748b', letterSpacing: '0.04em', marginTop: '3px' }}>
                  SERVICEABLE
                </span>
              </div>
            </div>

            {/* Donut Legend */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px', fontSize: '12px' }}>
              {fleetStatusDonutData.map((item) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                    <span style={{ color: '#475569' }}>{item.name}</span>
                  </div>
                  <strong className="num-tabular" style={{ color: '#0b1c30' }}>
                    {item.value} ({item.percentage}%)
                  </strong>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-default)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11px'
            }}
          >
            <span style={{ color: '#64748b' }}>Apron Minimum Service Threshold: <strong>85%</strong></span>
            <span style={{ color: '#059669', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} /> Compliant
            </span>
          </div>
        </div>

        {/* Panel 2: Fleet Roster by Category */}
        <div className="aeroground-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                Fleet Roster by Category
              </h3>
              <button
                onClick={() => navigate('/equipment')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <span>View Registry</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {/* Categories Bar List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {categoryRosterData.map((cat) => (
                <div key={cat.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '500', color: '#0b1c30' }}>{cat.name}</span>
                    <span className="num-tabular" style={{ color: '#64748b' }}>{cat.text}</span>
                  </div>
                  <ProgressBar value={cat.percent} max={100} height={5} color={cat.barColor} />
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-default)',
              fontSize: '11px',
              color: '#64748b',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>Ramp Electric Fleet Share: <strong className="num-tabular" style={{ color: '#0b1c30' }}>62.5%</strong></span>
            <span style={{ color: '#1d63ed', fontWeight: '600' }}>Target 75% 2025</span>
          </div>
        </div>

        {/* Panel 3: Upcoming Hangar Maintenance */}
        <div className="aeroground-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wrench size={16} color="#d97706" />
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  Upcoming Hangar Maintenance
                </h3>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#92400e',
                  backgroundColor: '#fef3c7',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}
              >
                4 Due
              </span>
            </div>

            {/* List of maintenance tasks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {upcomingMaintenanceData.map((m) => (
                <div
                  key={m.assetId}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--border-default)',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="num-tabular" style={{ fontWeight: '700', fontSize: '12px', color: '#0b1c30' }}>
                        {m.assetId}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          color: '#64748b',
                          backgroundColor: '#e2e8f0',
                          padding: '1px 5px',
                          borderRadius: '3px'
                        }}
                      >
                        {m.type}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: m.dueType === 'urgent' ? '#dc2626' : '#d97706'
                      }}
                    >
                      {m.dueIn}
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#334155', fontWeight: '500' }}>
                    {m.task}
                  </div>

                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                    {m.location}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/maintenance')}
            className="btn-secondary"
            style={{ width: '100%', marginTop: '16px', fontSize: '12px' }}
          >
            <span>Open Maintenance Planner (6 Work Orders)</span>
          </button>
        </div>
      </div>

      {/* 6. Bottom Row 2: Active Fault Log & Tactical Apron Actions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1.2fr)',
          gap: '16px'
        }}
      >
        {/* Active Fault Log & Grounding Incidents Table */}
        <div className="aeroground-card" style={{ padding: '20px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="#dc2626" />
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                Active Fault Log & Grounding Incidents
              </h3>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#991b1b',
                backgroundColor: '#fee2e2',
                padding: '2px 8px',
                borderRadius: '4px'
              }}
            >
              2 LOCKOUTS ACTIVE
            </span>
          </div>

          {/* Fault Incidents Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)', textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: '8px 10px', fontWeight: '600', fontSize: '11px' }}>Incident ID</th>
                <th style={{ padding: '8px 10px', fontWeight: '600', fontSize: '11px' }}>Asset ID & Type</th>
                <th style={{ padding: '8px 10px', fontWeight: '600', fontSize: '11px' }}>Severity / Fault Summary</th>
                <th style={{ padding: '8px 10px', fontWeight: '600', fontSize: '11px' }}>Location Reported</th>
                <th style={{ padding: '8px 10px', fontWeight: '600', fontSize: '11px' }}>Reported By</th>
                <th style={{ padding: '8px 10px', fontWeight: '600', fontSize: '11px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {activeFaultIncidents.map((incident) => {
                const isCrit = incident.severityLevel === 'critical';
                const isWarn = incident.severityLevel === 'warning';

                return (
                  <tr
                    key={incident.id}
                    style={{ borderBottom: '1px solid #f1f5f9' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td className="num-tabular" style={{ padding: '10px', fontWeight: '700', color: isCrit ? '#dc2626' : isWarn ? '#d97706' : '#64748b' }}>
                      {incident.id}
                    </td>

                    <td style={{ padding: '10px' }}>
                      <div className="num-tabular" style={{ fontWeight: '700', color: '#0b1c30' }}>
                        {incident.assetId}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {incident.assetModel}
                      </div>
                    </td>

                    <td style={{ padding: '10px' }}>
                      <div style={{ marginBottom: '3px' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: '700',
                            padding: '1px 6px',
                            borderRadius: '3px',
                            backgroundColor: isCrit ? '#fee2e2' : isWarn ? '#fef3c7' : '#f1f5f9',
                            color: isCrit ? '#991b1b' : isWarn ? '#92400e' : '#475569'
                          }}
                        >
                          {isCrit && '🔒 '}
                          {incident.severity}
                        </span>
                      </div>
                      <div style={{ color: '#1e293b', fontSize: '11px' }}>
                        {incident.faultSummary}
                      </div>
                    </td>

                    <td style={{ padding: '10px', color: '#475569' }}>
                      {incident.location}
                    </td>

                    <td style={{ padding: '10px' }}>
                      <div style={{ color: '#0b1c30', fontWeight: '500' }}>{incident.reportedBy}</div>
                      <div className="num-tabular" style={{ fontSize: '10px', color: '#94a3b8' }}>{incident.reportedTime}</div>
                    </td>

                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      <button
                        onClick={() => setInspectModalIncident(incident)}
                        className="btn-secondary"
                        style={{ height: '28px', fontSize: '11px', padding: '0 8px' }}
                      >
                        Inspect Ticket
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tactical Apron Actions Panel */}
        <div className="aeroground-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Zap size={18} color="#1d63ed" />
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                Tactical Apron Actions
              </h3>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.4 }}>
              High-priority dispatcher triggers with automatic push notifications to all ramp tablet terminals.
            </p>

            {/* Action Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tacticalActions.map((act) => (
                <div
                  key={act.id}
                  onClick={() => handleTacticalAction(act)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '6px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1d63ed';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-medium)';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        backgroundColor:
                          act.type === 'danger' ? '#fee2e2' :
                          act.type === 'warning' ? '#fef3c7' : '#eff6ff',
                        color:
                          act.type === 'danger' ? '#dc2626' :
                          act.type === 'warning' ? '#d97706' : '#1d63ed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {act.type === 'danger' ? <ShieldAlert size={16} /> :
                       act.type === 'warning' ? <Flame size={16} /> : <FileText size={16} />}
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#0b1c30' }}>
                        {act.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '1px' }}>
                        {act.description}
                      </div>
                    </div>
                  </div>

                  <ChevronRight size={16} color="#94a3b8" />
                </div>
              ))}
            </div>
          </div>

          {/* Apron Weather Bar at Bottom */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-default)',
              borderRadius: '6px',
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
              <Sun size={15} color="#d97706" />
              <span>
                Apron QNH <strong className="num-tabular">1014 hPa</strong> • Temp: <strong className="num-tabular">31°C</strong> • Heat Index: <strong className="num-tabular">36°C</strong>
              </span>
            </div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#065f46',
                backgroundColor: '#d1fae5',
                padding: '2px 8px',
                borderRadius: '4px'
              }}
            >
              Ramp Normal
            </span>
          </div>
        </div>
      </div>

      {/* Inspect Fault Incident Modal */}
      {inspectModalIncident && (
        <Modal
          isOpen={true}
          onClose={() => setInspectModalIncident(null)}
          title={`Lockout Ticket ${inspectModalIncident.id}`}
          subtitle={`Grounding status for ${inspectModalIncident.assetId} • Logged at ${inspectModalIncident.reportedTime}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
            <div style={{ padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px' }}>
              <div style={{ color: '#991b1b', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase' }}>
                {inspectModalIncident.severity}
              </div>
              <div style={{ color: '#7f1d1d', marginTop: '4px', fontSize: '13px', fontWeight: '600' }}>
                {inspectModalIncident.faultSummary}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '4px' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Reported Location</span>
                <div style={{ fontWeight: '600', color: '#0b1c30' }}>{inspectModalIncident.location}</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '4px' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Dispatch Inspector</span>
                <div style={{ fontWeight: '600', color: '#0b1c30' }}>{inspectModalIncident.reportedBy}</div>
              </div>
            </div>

            <p style={{ color: '#475569', fontSize: '12px', lineHeight: 1.5 }}>
              Asset has been disabled in the automated slotting engine. Mechanical hangar technicians have been assigned to stand.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                className="btn-secondary"
                onClick={() => setInspectModalIncident(null)}
              >
                Close Ticket View
              </button>
              <button
                className="btn-danger"
                onClick={() => {
                  alert(`Work order issued for ${inspectModalIncident.assetId}.`);
                  setInspectModalIncident(null);
                }}
              >
                Dispatch Emergency Mobile Crane
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Action Success Modal */}
      {actionSuccessModal && (
        <Modal
          isOpen={true}
          onClose={() => setActionSuccessModal(null)}
          title={actionSuccessModal.title}
          subtitle="Tactical Ramp Command Execution"
        >
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <CheckCircle2 size={44} color="#059669" style={{ margin: '0 auto 10px' }} />
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#059669' }}>Action Dispatched</h4>
            <p style={{ fontSize: '13px', color: '#475569', marginTop: '6px' }}>
              {actionSuccessModal.description} has been pushed to all terminal ramp transceivers.
            </p>
            <button
              className="btn-primary"
              style={{ marginTop: '16px' }}
              onClick={() => setActionSuccessModal(null)}
            >
              Acknowledge & Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

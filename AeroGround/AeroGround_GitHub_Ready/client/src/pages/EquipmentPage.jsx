import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, useOutletContext } from 'react-router-dom';
import {
  Download,
  Radio,
  Plus,
  Truck,
  CheckCircle2,
  Clock,
  BatteryCharging,
  Gauge,
  MapPin,
  ChevronRight,
  Search,
  LayoutGrid,
  Table as TableIcon,
  Map as MapIcon,
  SlidersHorizontal,
  ChevronLeft,
  X,
  Plane,
  ClipboardCheck,
  Zap,
  Bus,
  Layers,
  Share2,
  Compass
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import ProgressBar from '../components/common/ProgressBar';
import Modal from '../components/common/Modal';
import { allEquipmentList, fleetSummaryStats } from '../data/equipmentData';
import tugImg from '../assets/tug.png';

export default function EquipmentPage() {
  const navigate = useNavigate();
  const { selectedArea } = useOutletContext();
  const [searchParams] = useSearchParams();

  // Initial search from URL if present
  const initialSearch = searchParams.get('q') || '';

  // Local state
  const [equipmentList, setEquipmentList] = useState(allEquipmentList);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards' | 'map'
  const [showFilters, setShowFilters] = useState(true);

  // Filters
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterZone, setFilterZone] = useState('ALL');
  const [filterSchedule, setFilterSchedule] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Multi-selection (default with TUG-017 and GPU-006 matching references/dashboard.png!)
  const [selectedIds, setSelectedIds] = useState(['TUG-017', 'GPU-006']);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMultiAssignModalOpen, setIsMultiAssignModalOpen] = useState(false);
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return equipmentList.filter((item) => {
      // Search
      const searchMatch =
        !searchTerm ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.makeModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const typeMatch = filterType === 'ALL' || item.category === filterType;

      // Status filter
      const statusMatch = filterStatus === 'ALL' || item.status === filterStatus;

      // Zone filter
      const zoneMatch = filterZone === 'ALL' || item.zone === filterZone;
      const areaMatch = selectedArea === 'All Apron Areas' ||
        (selectedArea === 'Gates A1–A5' && item.zone === 'Terminal 1 Apron' && /Gate A[1-5]\b/.test(item.location)) ||
        (selectedArea === 'Maintenance Hangar 3' && item.zone === 'Maintenance Hangar') ||
        (selectedArea === 'Remote Stands R1–R4' && item.zone === 'Remote Stands' && /R[1-4]\b/.test(item.location));

      // Schedule filter
      const scheduleMatch = filterSchedule === 'ALL' || item.serviceSchedule === filterSchedule;

      return searchMatch && typeMatch && statusMatch && zoneMatch && areaMatch && scheduleMatch;
    });
  }, [equipmentList, searchTerm, filterType, filterStatus, filterZone, filterSchedule, selectedArea]);

  // Paginated data
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (Math.min(currentPage, totalPages) - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage, totalPages]);

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedData.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    paginatedData.length > 0 && paginatedData.every((d) => selectedIds.includes(d.id));

  // Category Icon helper
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Pushback Tug':
        return <Truck size={15} color="#1d63ed" />;
      case 'Ground Power':
        return <Zap size={15} color="#059669" />;
      case 'Belt Loader':
        return <Layers size={15} color="#0284c7" />;
      case 'Passenger Bus':
        return <Bus size={15} color="#475569" />;
      case 'Catering Truck':
        return <Truck size={15} color="#d97706" />;
      default:
        return <Truck size={15} color="#64748b" />;
    }
  };

  // Add Equipment Form Submit
  const handleAddEquipment = (e) => {
    e.preventDefault();
    const form = e.target;
    const newUnit = {
      id: form.assetId.value.trim().toUpperCase(),
      serial: `SN: ${form.serial.value.trim()}`,
      makeModel: form.makeModel.value.trim(),
      description: form.description.value.trim(),
      category: form.category.value,
      type: form.category.value,
      location: form.location.value.trim(),
      zone: form.zone.value,
      operatingHours: parseInt(form.hours.value) || 0,
      dutyPercent: Math.min(95, Math.floor(((parseInt(form.hours.value) || 0) / 10000) * 100)),
      status: form.status.value,
      fuelBattery: 95,
      powerType: form.powerType.value,
      assignedFlight: 'Unassigned',
      assignedOperator: 'Standby Dispatch',
      serviceSchedule: 'Nominal',
      nextCheck: '30d (Standard)',
      lastService: 'Today',
      gps: '01.3580° N, 103.9890° E'
    };

    setEquipmentList([newUnit, ...equipmentList]);
    setIsAddModalOpen(false);
    setActionNotice(`Added new GSE unit: ${newUnit.id}`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Header with metadata and global buttons */}
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
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#1d63ed', letterSpacing: '0.04em' }}>
              APRON CONTROL OPS
            </span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>ACTIVE TELEMETRY SYNCED (3s ago)</span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            Equipment Fleet Inventory & Status
          </h1>

          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
            Real-time telemetry, readiness status, operational hours and gate assignments across 48 units
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => alert('Exporting Equipment Fleet Roster to CSV & PDF...')}
            className="btn-secondary"
            style={{ height: '36px', fontSize: '12px' }}
          >
            <Download size={14} />
            <span>Export (CSV/PDF)</span>
          </button>

          <button
            onClick={() => alert('Opening Bulk Telemetry Ingestion Console...')}
            className="btn-secondary"
            style={{ height: '36px', fontSize: '12px' }}
          >
            <Radio size={14} />
            <span>Bulk Telemetry</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary"
            style={{ height: '36px', fontSize: '12px' }}
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Add New Equipment</span>
          </button>
        </div>
      </div>

      {selectedArea !== 'All Apron Areas' && <div style={{ padding: '9px 12px', background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '12px' }}>
        Location filter: <strong>{selectedArea}</strong> · {filteredData.length} matching units. Change the location in the top bar or select All Apron Areas on the dashboard to clear it.
      </div>}

      {/* Notice notification */}
      {actionNotice && (
        <div
          style={{
            padding: '10px 16px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '6px',
            color: '#065f46',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 size={16} />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 2. 4 Top Metric Cards (exact reproduction from references/dashboard.png) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px'
        }}
      >
        {/* Metric 1: TOTAL FLEET SIZE */}
        <div className="aeroground-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                TOTAL FLEET SIZE
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                <span className="num-tabular" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>
                  48
                </span>
                <span style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>
                  ↑ 100% Active Log
                </span>
              </div>
            </div>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: '#eff6ff',
                color: '#1d63ed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Truck size={18} />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#64748b',
              marginTop: '6px',
              paddingTop: '8px',
              borderTop: '1px solid #f1f5f9'
            }}
          >
            <span>Heavy Pushback: <strong className="num-tabular" style={{ color: '#0b1c30' }}>14</strong></span>
            <span>GPU / Air: <strong className="num-tabular" style={{ color: '#0b1c30' }}>18</strong></span>
            <span>Support: <strong className="num-tabular" style={{ color: '#0b1c30' }}>16</strong></span>
          </div>
        </div>

        {/* Metric 2: APRON READINESS */}
        <div className="aeroground-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                APRON READINESS
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                <span className="num-tabular" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>
                  83.3%
                </span>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>
                  Target &gt; 80%
                </span>
              </div>
            </div>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle2 size={18} />
            </div>
          </div>

          {/* Dual Segment Progress Bar */}
          <div style={{ display: 'flex', height: '6px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#fee2e2' }}>
            <div style={{ width: '83.3%', backgroundColor: '#059669' }} />
            <div style={{ width: '16.7%', backgroundColor: '#dc2626' }} />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#64748b',
              marginTop: '4px'
            }}
          >
            <span>40 In Action / Available</span>
            <span style={{ color: '#dc2626', fontWeight: '600' }}>8 In Shop / Bay</span>
          </div>
        </div>

        {/* Metric 3: AVG OPERATING DUTY */}
        <div className="aeroground-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                AVG OPERATING DUTY
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                <span className="num-tabular" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>
                  3,420
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>hrs / unit</span>
              </div>
            </div>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: '#eff6ff',
                color: '#1d63ed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Clock size={18} />
            </div>
          </div>

          <ProgressBar value={68} max={100} height={5} color="#1d63ed" />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#64748b',
              marginTop: '4px'
            }}
          >
            <span>High Duty Cycle: <strong style={{ color: '#dc2626' }}>TUG-017 (8.9k)</strong></span>
            <span>Next C-Check &lt; 48h</span>
          </div>
        </div>

        {/* Metric 4: AVG BATTERY / FUEL RESERVE */}
        <div className="aeroground-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                AVG BATTERY / FUEL RESERVE
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                <span className="num-tabular" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>
                  78%
                </span>
                <span style={{ fontSize: '11px', color: '#059669', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Zap size={11} /> e-GSE Hybrid
                </span>
              </div>
            </div>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: '#eff6ff',
                color: '#1d63ed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <BatteryCharging size={18} />
            </div>
          </div>

          <ProgressBar value={78} max={100} height={5} color="#1d63ed" />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#64748b',
              marginTop: '4px'
            }}
          >
            <span>Critical Reserve (&lt;20%): <strong style={{ color: '#dc2626' }}>1 Unit</strong></span>
            <span>Ramp Charging: <strong style={{ color: '#1d63ed' }}>9 Units</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Two Middle Split Panels: Featured Deployment & Sub-Zone Distribution */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)',
          gap: '16px',
          alignItems: 'stretch'
        }}
      >
        {/* Panel 1: FEATURED DEPLOYMENT (Uses tug.png!) */}
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
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                FEATURED DEPLOYMENT
              </span>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#1d63ed' }}>
                Gate A3 Pushback Maneuver
              </span>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
              TLD TPX-300 Heavy Towing System active on Flight LH404
            </h3>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
              Autonomous torque telemetry transmitting via Apron Mesh 5G. Pushback clearance verified with apron tower at 14:28 UTC.
            </p>

            {/* Featured Image with tug.png */}
            <div
              style={{
                width: '100%',
                height: '180px',
                borderRadius: '6px',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid var(--border-medium)',
                backgroundColor: '#0a1422'
              }}
            >
              <img
                src={tugImg}
                alt="TLD TPX-300 Pushback Tug"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 45%'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(11, 25, 44, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }} />
                <span>TLD TPX-300 #TUG-017</span>
              </div>
            </div>
          </div>

          {/* Telemetry bottom row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-default)',
              fontSize: '12px',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0b1c30' }}>
              <Gauge size={15} color="#1d63ed" />
              <span>Torque: <strong className="num-tabular">412 kN</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0b1c30' }}>
              <MapPin size={15} color="#1d63ed" />
              <span>Apron A3 Pushbox</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d97706', fontWeight: '600' }}>
              <Clock size={15} />
              <span>Turnaround EST: 12m left</span>
            </div>
          </div>
        </div>

        {/* Panel 2: Apron Sub-Zone Distribution */}
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
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Share2 size={16} color="#1d63ed" />
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  Apron Sub-Zone Distribution
                </h3>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#1d63ed',
                  backgroundColor: '#eff6ff',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}
              >
                T1 NORTH
              </span>
            </div>

            {/* Zone Progress Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {fleetSummaryStats.zoneDistribution.map((z) => (
                <div key={z.zone}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '500', color: '#0b1c30' }}>{z.zone}</span>
                    <span className="num-tabular" style={{ fontWeight: '700', color: '#0b1c30' }}>
                      {z.units} Units {z.sub && <span style={{ color: '#64748b', fontWeight: '400', fontSize: '11px' }}>{z.sub}</span>}
                    </span>
                  </div>
                  <ProgressBar value={z.percentage} max={100} height={6} color="#1d63ed" />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Link Bar */}
          <div
            style={{
              paddingTop: '14px',
              borderTop: '1px solid var(--border-default)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11px'
            }}
          >
            <span style={{ color: '#64748b' }}>
              Staging Zone Congestion: <strong style={{ color: '#059669' }}>Low (Normal)</strong>
            </span>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px'
              }}
            >
              <span>View Apron Map</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Table Controls: Search Input, View Toggles, Filter Bar */}
      <div
        className="aeroground-card"
        style={{
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8'
              }}
            />
            <input
              type="text"
              placeholder="Filter by Equipment ID, Serial, or Model (e.g. TUG-017, TPX-300)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="form-input"
              style={{
                paddingLeft: '36px',
                height: '36px',
                backgroundColor: '#ffffff'
              }}
            />
          </div>

          {/* Right Controls: View Switcher & Filter Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* View Modes */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f1f5f9',
                borderRadius: '6px',
                padding: '2px',
                border: '1px solid var(--border-medium)'
              }}
            >
              <button
                onClick={() => setViewMode('table')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: viewMode === 'table' ? '700' : '500',
                  backgroundColor: viewMode === 'table' ? '#ffffff' : 'transparent',
                  color: viewMode === 'table' ? '#0b1c30' : '#64748b',
                  boxShadow: viewMode === 'table' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer'
                }}
              >
                <TableIcon size={14} />
                <span>Table</span>
              </button>

              <button
                onClick={() => setViewMode('cards')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: viewMode === 'cards' ? '700' : '500',
                  backgroundColor: viewMode === 'cards' ? '#ffffff' : 'transparent',
                  color: viewMode === 'cards' ? '#0b1c30' : '#64748b',
                  boxShadow: viewMode === 'cards' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer'
                }}
              >
                <LayoutGrid size={14} />
                <span>Cards</span>
              </button>

              <button
                onClick={() => setViewMode('map')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: viewMode === 'map' ? '700' : '500',
                  backgroundColor: viewMode === 'map' ? '#ffffff' : 'transparent',
                  color: viewMode === 'map' ? '#0b1c30' : '#64748b',
                  boxShadow: viewMode === 'map' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer'
                }}
              >
                <MapIcon size={14} />
                <span>Map Overlay</span>
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary"
              style={{
                height: '34px',
                fontSize: '12px',
                backgroundColor: showFilters ? '#eff6ff' : '#ffffff',
                borderColor: showFilters ? '#1d63ed' : 'var(--border-medium)',
                color: showFilters ? '#1d63ed' : 'var(--secondary)'
              }}
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* 4 Dropdown Filter Strips */}
        {showFilters && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              paddingTop: '8px',
              borderTop: '1px solid #f1f5f9'
            }}
          >
            {/* Equipment Type */}
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>
                Equipment Type
              </label>
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
                className="form-input"
                style={{ height: '34px', fontSize: '12px' }}
              >
                <option value="ALL">All Equipment Types ({equipmentList.length})</option>
                <option value="Pushback Tug">Pushback Tug</option>
                <option value="Ground Power">Ground Power</option>
                <option value="Belt Loader">Belt Loader</option>
                <option value="Passenger Bus">Passenger Bus</option>
                <option value="Baggage Tractor">Baggage Tractor</option>
                <option value="Catering Truck">Catering Truck</option>
                <option value="Potable / Lavatory Truck">Potable / Lavatory Truck</option>
                <option value="Air Start Unit">Air Start Unit</option>
              </select>
            </div>

            {/* Operational Status */}
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>
                Operational Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="form-input"
                style={{ height: '34px', fontSize: '12px' }}
              >
                <option value="ALL">All Statuses ({equipmentList.length})</option>
                <option value="AVAILABLE">AVAILABLE (Ready)</option>
                <option value="IN USE">IN USE (Turnaround)</option>
                <option value="UNDER MAINTENANCE">UNDER MAINTENANCE</option>
                <option value="OUT OF SERVICE">OUT OF SERVICE (OOS)</option>
              </select>
            </div>

            {/* Ramp / Staging Zone */}
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>
                Ramp / Staging Zone
              </label>
              <select
                value={filterZone}
                onChange={(e) => {
                  setFilterZone(e.target.value);
                  setCurrentPage(1);
                }}
                className="form-input"
                style={{ height: '34px', fontSize: '12px' }}
              >
                <option value="ALL">All Terminal Zones</option>
                <option value="Terminal 1 Apron">Terminal 1 Apron [Gates A1-A12]</option>
                <option value="Remote Stands">Remote Stands [R1-R8]</option>
                <option value="Maintenance Hangar">Central Maintenance Hangar</option>
              </select>
            </div>

            {/* Service Window */}
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>
                Service Window
              </label>
              <select
                value={filterSchedule}
                onChange={(e) => {
                  setFilterSchedule(e.target.value);
                  setCurrentPage(1);
                }}
                className="form-input"
                style={{ height: '34px', fontSize: '12px' }}
              >
                <option value="ALL">All Schedules</option>
                <option value="Due Soon (<48h)">Due Soon (&lt;48h)</option>
                <option value="Nominal">Nominal Schedule</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 5. Main Content: Table View OR Cards View OR Map View */}
      {viewMode === 'table' ? (
        <div className="aeroground-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: '#f8fafc',
                    borderBottom: '1px solid var(--border-default)',
                    color: '#64748b',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '0.04em'
                  }}
                >
                  <th style={{ padding: '12px 14px', width: '36px' }}>
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      style={{ width: '16px', height: '16px', accentColor: '#1d63ed', cursor: 'pointer' }}
                    />
                  </th>
                  <th style={{ padding: '12px 14px' }}>EQUIPMENT ID</th>
                  <th style={{ padding: '12px 14px' }}>MAKE & MODEL</th>
                  <th style={{ padding: '12px 14px' }}>TYPE</th>
                  <th style={{ padding: '12px 14px' }}>CURRENT LOCATION</th>
                  <th style={{ padding: '12px 14px' }}>OPERATING HOURS</th>
                  <th style={{ padding: '12px 14px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                      No equipment matches current search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => {
                    const isSelected = selectedIds.includes(item.id);

                    // Location dot color
                    const isAvail = item.status === 'AVAILABLE';
                    const isInUse = item.status === 'IN USE';
                    const isOos = item.status === 'OUT OF SERVICE';
                    const locDotColor = isAvail ? '#059669' : isInUse ? '#1d63ed' : isOos ? '#dc2626' : '#2563eb';

                    return (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: isSelected ? '#f0f7ff' : '#ffffff',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = '#ffffff';
                        }}
                      >
                        {/* Checkbox */}
                        <td style={{ padding: '12px 14px' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(item.id)}
                            style={{ width: '16px', height: '16px', accentColor: '#1d63ed', cursor: 'pointer' }}
                          />
                        </td>

                        {/* Equipment ID & Icon */}
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '6px',
                                backgroundColor: '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              {getCategoryIcon(item.category)}
                            </div>
                            <div>
                              <div className="num-tabular" style={{ fontWeight: '700', fontSize: '13px', color: '#0b1c30' }}>
                                {item.id}
                              </div>
                              <div style={{ fontSize: '10px', color: '#64748b' }}>
                                {item.serial}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Make & Model */}
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: '600', color: '#0b1c30' }}>
                            {item.makeModel}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {item.description}
                          </div>
                        </td>

                        {/* Type Pill */}
                        <td style={{ padding: '12px 14px' }}>
                          <span
                            style={{
                              backgroundColor: '#eff6ff',
                              color: '#1d63ed',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '600',
                              border: '1px solid #bfdbfe'
                            }}
                          >
                            {item.type}
                          </span>
                        </td>

                        {/* Current Location */}
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: locDotColor,
                                flexShrink: 0
                              }}
                            />
                            <span style={{ color: '#1e293b', fontWeight: '500' }}>{item.location}</span>
                          </div>
                        </td>

                        {/* Operating Hours & Mini Bar */}
                        <td style={{ padding: '12px 14px', minWidth: '150px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                            <span className="num-tabular" style={{ fontWeight: '600', color: '#0b1c30' }}>
                              {item.operatingHours.toLocaleString()} hrs
                            </span>
                            <span
                              className="num-tabular"
                              style={{
                                fontSize: '11px',
                                fontWeight: '700',
                                color: item.dutyPercent > 75 ? '#dc2626' : item.dutyPercent > 50 ? '#d97706' : '#059669'
                              }}
                            >
                              {item.dutyPercent}%
                            </span>
                          </div>
                          <ProgressBar
                            value={item.dutyPercent}
                            max={100}
                            height={4}
                            color={item.dutyPercent > 75 ? '#dc2626' : item.dutyPercent > 50 ? '#d97706' : '#059669'}
                          />
                        </td>

                        {/* Status Badge */}
                        <td style={{ padding: '12px 14px' }}>
                          <StatusBadge status={item.status} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border-default)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '12px',
              color: '#64748b'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span>
                Showing <strong className="num-tabular" style={{ color: '#0b1c30' }}>
                  {filteredData.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}
                </strong> to <strong className="num-tabular" style={{ color: '#0b1c30' }}>
                  {Math.min(currentPage * rowsPerPage, filteredData.length)}
                </strong> of <strong className="num-tabular" style={{ color: '#0b1c30' }}>{filteredData.length}</strong> equipment
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: '#ffffff',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Pagination page numbers */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.4 : 1
                }}
              >
                <ChevronLeft size={15} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '4px',
                    border: pageNum === currentPage ? '1px solid #004bc3' : '1px solid var(--border-medium)',
                    backgroundColor: pageNum === currentPage ? '#004bc3' : '#ffffff',
                    color: pageNum === currentPage ? '#ffffff' : '#475569',
                    fontWeight: pageNum === currentPage ? '700' : '500',
                    cursor: 'pointer'
                  }}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.4 : 1
                }}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        /* Cards View */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}
        >
          {paginatedData.map((item) => (
            <div
              key={item.id}
              className="aeroground-card"
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
                borderLeft: `4px solid ${
                  item.status === 'AVAILABLE' ? '#059669' :
                  item.status === 'IN USE' ? '#d97706' :
                  item.status === 'OUT OF SERVICE' ? '#dc2626' : '#2563eb'
                }`
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ padding: '6px', backgroundColor: '#f1f5f9', borderRadius: '4px' }}>
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <div className="num-tabular" style={{ fontWeight: '700', fontSize: '14px', color: '#0b1c30' }}>
                        {item.id}
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{item.serial}</div>
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <div style={{ fontWeight: '600', fontSize: '13px', color: '#1e293b', marginBottom: '2px' }}>
                  {item.makeModel}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px' }}>
                  {item.description}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', backgroundColor: '#f8fafc', padding: '8px', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Location:</span>
                    <strong style={{ color: '#0b1c30' }}>{item.location}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Assigned:</span>
                    <span style={{ color: '#1d63ed', fontWeight: '600' }}>{item.assignedFlight}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Power / Reserve:</span>
                    <span className="num-tabular" style={{ fontWeight: '600', color: '#059669' }}>{item.fuelBattery}% ({item.powerType})</span>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: '#64748b' }}>Duty Cycle:</span>
                  <span className="num-tabular" style={{ fontWeight: '600', color: '#0b1c30' }}>{item.operatingHours.toLocaleString()} hrs ({item.dutyPercent}%)</span>
                </div>
                <ProgressBar value={item.dutyPercent} max={100} height={4} color="#1d63ed" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Map Overlay View Placeholder linking to Radar */
        <div
          className="aeroground-card"
          style={{
            padding: '36px',
            textAlign: 'center',
            backgroundColor: '#0a1422',
            color: '#ffffff'
          }}
        >
          <Compass size={40} color="#1d63ed" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Terminal 1 Apron Radar Integration</h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', maxWidth: '480px', margin: '6px auto 16px auto' }}>
            Live geospatial transponder coordinates for all 48 assets are streaming on the central Operations Command Center.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Open Tactical Radar Map
          </button>
        </div>
      )}

      {/* 6. Multi-Selection Sticky Action Bar (matches bottom of references/dashboard.png!) */}
      {selectedIds.length > 0 && (
        <div
          style={{
            position: 'sticky',
            bottom: '16px',
            zIndex: 900,
            backgroundColor: '#102a43',
            color: '#ffffff',
            borderRadius: '8px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 10px 25px -5px rgba(16, 42, 67, 0.4), 0 0 1px 1px rgba(255, 255, 255, 0.1)',
            flexWrap: 'wrap',
            gap: '12px',
            animation: 'fadeInScale 0.15s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                backgroundColor: '#1d63ed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '800'
              }}
            >
              {selectedIds.length}
            </span>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>
              Equipment items selected
            </span>
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>
              • [{selectedIds.slice(0, 4).join(', ')}{selectedIds.length > 4 ? ` +${selectedIds.length - 4}` : ''}]
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsMultiAssignModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '4px',
                backgroundColor: '#1e3a5f',
                border: '1px solid #334e68',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Plane size={14} />
              <span>Assign to Flight</span>
            </button>

            <button
              onClick={() => setIsInspectModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '4px',
                backgroundColor: '#1e3a5f',
                border: '1px solid #334e68',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <ClipboardCheck size={14} />
              <span>Mark for Inspection</span>
            </button>

            <button
              onClick={() => {
                alert(`Exporting high-precision telemetry log for ${selectedIds.length} selected assets.`);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '4px',
                backgroundColor: '#1e3a5f',
                border: '1px solid #334e68',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Download size={14} />
              <span>Export Telemetry</span>
            </button>

            <button
              onClick={() => setSelectedIds([])}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label="Clear selection"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Add New Equipment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Airport GSE Unit"
        subtitle="Provision a ground support asset with telemetry tracking and airport SIDA tag"
      >
        <form onSubmit={handleAddEquipment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                EQUIPMENT ID
              </label>
              <input
                name="assetId"
                required
                placeholder="e.g. TUG-025"
                defaultValue="TUG-025"
                className="form-input"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                SERIAL NUMBER
              </label>
              <input
                name="serial"
                required
                placeholder="e.g. TLD-9988X"
                defaultValue="TLD-9988X"
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                MAKE & MODEL
              </label>
              <input
                name="makeModel"
                required
                placeholder="e.g. TLD TPX-200"
                defaultValue="TLD TPX-200"
                className="form-input"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                CATEGORY TYPE
              </label>
              <select name="category" className="form-input">
                <option value="Pushback Tug">Pushback Tug</option>
                <option value="Ground Power">Ground Power</option>
                <option value="Belt Loader">Belt Loader</option>
                <option value="Passenger Bus">Passenger Bus</option>
                <option value="Baggage Tractor">Baggage Tractor</option>
                <option value="Catering Truck">Catering Truck</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
              TECHNICAL DESCRIPTION
            </label>
            <input
              name="description"
              required
              placeholder="e.g. Narrow-Body Electric Pushback Tug"
              defaultValue="Towbarless Electric Pushback Tractor"
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                STAGING LOCATION
              </label>
              <input
                name="location"
                required
                defaultValue="Apron Staging Bay S5"
                className="form-input"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                RAMP ZONE
              </label>
              <select name="zone" className="form-input">
                <option value="Terminal 1 Apron">Terminal 1 Apron</option>
                <option value="Remote Stands">Remote Stands</option>
                <option value="Maintenance Hangar">Maintenance Hangar</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                OPERATING HOURS
              </label>
              <input
                name="hours"
                type="number"
                defaultValue={450}
                className="form-input"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                STATUS
              </label>
              <select name="status" className="form-input">
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="IN USE">IN USE</option>
                <option value="UNDER MAINTENANCE">UNDER MAINTENANCE</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                POWER TYPE
              </label>
              <select name="powerType" className="form-input">
                <option value="Lithium e-GSE">Lithium e-GSE</option>
                <option value="Tier 4 Diesel">Tier 4 Diesel</option>
                <option value="Hybrid 400V">Hybrid 400V</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Register & Broadcast to Mesh
            </button>
          </div>
        </form>
      </Modal>

      {/* Batch Assign Modal */}
      <Modal
        isOpen={isMultiAssignModalOpen}
        onClose={() => setIsMultiAssignModalOpen(false)}
        title={`Batch Dispatch: ${selectedIds.length} Assets`}
        subtitle="Assign selected ground fleet units to flight turnaround wave"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '13px', color: '#475569' }}>
            You are dispatching: <strong style={{ color: '#0b1c30' }}>{selectedIds.join(', ')}</strong>
          </p>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
              TARGET TURNAROUND FLIGHT
            </label>
            <select className="form-input">
              <option>SQ318 (Boeing 787-10 Dreamliner) — Gate A5</option>
              <option>BA249 (Boeing 777-300ER) — Gate A1</option>
              <option>LH404 (Airbus A321neo) — Gate A3</option>
              <option>AF256 (Airbus A320) — Gate A4</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button className="btn-secondary" onClick={() => setIsMultiAssignModalOpen(false)}>
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                setIsMultiAssignModalOpen(false);
                setSelectedIds([]);
                setActionNotice(`Dispatched ${selectedIds.length} units to flight stand.`);
                setTimeout(() => setActionNotice(null), 3000);
              }}
            >
              Confirm Flight Assignment
            </button>
          </div>
        </div>
      </Modal>

      {/* Batch Inspection Modal */}
      <Modal
        isOpen={isInspectModalOpen}
        onClose={() => setIsInspectModalOpen(false)}
        title={`Schedule Technical Inspection`}
        subtitle={`Mark ${selectedIds.length} GSE assets for routine maintenance or pre-flight audit`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '13px', color: '#475569' }}>
            Assets: <strong style={{ color: '#0b1c30' }}>{selectedIds.join(', ')}</strong>
          </p>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
              INSPECTION PROTOCOL
            </label>
            <select className="form-input">
              <option>Daily Airside Ramp Walkaround & Brake Check</option>
              <option>500-Hour Hydraulic Fluid & Valve Inspection</option>
              <option>Emergency Battery & Charging Interface Audit</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button className="btn-secondary" onClick={() => setIsInspectModalOpen(false)}>
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                setIsInspectModalOpen(false);
                setSelectedIds([]);
                setActionNotice(`Inspection work orders created for ${selectedIds.length} assets.`);
                setTimeout(() => setActionNotice(null), 3000);
              }}
            >
              Generate Work Orders
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

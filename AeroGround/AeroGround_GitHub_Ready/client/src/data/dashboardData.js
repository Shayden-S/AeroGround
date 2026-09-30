export const dashboardGatesData = [
  {
    gateId: 'A1',
    gateName: 'GATE A1',
    classification: 'HEAVY',
    classColor: 'blue',
    flight: 'BA249 • B777',
    airline: 'British Airways',
    aircraft: 'Boeing 777-300ER',
    status: 'Turnaround (32m)',
    standStatus: 'occupied',
    assignedGse: [
      { id: 'GPU-012', label: 'GPU-012', tag: 'IN USE', statusType: 'inuse' },
      { id: 'CT-005', label: 'CT-005', tag: 'GALLEY', statusType: 'inuse' }
    ],
    primaryTelemetry: {
      assetId: 'GPU-012',
      name: 'Ground Power Unit (Solid State 90kVA)',
      status: 'IN TURNAROUND',
      statusType: 'inuse',
      fuelBattery: 88,
      fuelRemainingText: 'Est. 5.4h remaining',
      hydraulicPressure: 2950,
      pressureStatus: 'Nominal Range',
      activeLocation: 'Gate A1 (BA249 Heavy)',
      operator: 'Marcus Vance [OP-882]',
      gps: '01.3592° N, 103.9893° E',
      engineHours: '1,482.4 hrs',
      nextCheck: '14d (Preventative)'
    }
  },
  {
    gateId: 'A2',
    gateName: 'GATE A2',
    classification: 'OPEN',
    classColor: 'green',
    flight: 'Stand Empty',
    airline: 'Singapore Airlines',
    aircraft: 'Inbound A350',
    status: 'Next: SQ802 in 45m',
    standStatus: 'empty',
    assignedGse: [
      { id: 'TUG-004', label: 'TUG-004', tag: 'READY', statusType: 'available' }
    ],
    primaryTelemetry: {
      assetId: 'TUG-004',
      name: 'TLD TPX-100 Regional Towbarless',
      status: 'AVAILABLE',
      statusType: 'available',
      fuelBattery: 96,
      fuelRemainingText: 'Est. 9.1h remaining',
      hydraulicPressure: 3100,
      pressureStatus: 'Nominal Range',
      activeLocation: 'Gate A2 Standoff',
      operator: 'Ramp Pool Standby',
      gps: '01.3598° N, 103.9899° E',
      engineHours: '3,420.0 hrs',
      nextCheck: '12d (Brake Calipers)'
    }
  },
  {
    gateId: 'A3',
    gateName: 'GATE A3',
    classification: 'NARROW',
    classColor: 'slate',
    flight: 'LH404 • A321',
    airline: 'Lufthansa',
    aircraft: 'Airbus A321neo',
    status: 'Baggage Inbound',
    standStatus: 'occupied',
    assignedGse: [
      { id: 'BL-007', label: 'BL-007', tag: 'BELT LOAD', statusType: 'available' }
    ],
    primaryTelemetry: {
      assetId: 'BL-007',
      name: 'TLD NBL Mobile Electric Belt Loader',
      status: 'IN TURNAROUND',
      statusType: 'inuse',
      fuelBattery: 79,
      fuelRemainingText: 'Est. 4.8h remaining',
      hydraulicPressure: 2800,
      pressureStatus: 'Nominal Range',
      activeLocation: 'Gate A3 Ramp Right',
      operator: 'F. Rossi [OP-209]',
      gps: '01.3603° N, 103.9902° E',
      engineHours: '2,980.5 hrs',
      nextCheck: '28d (Roller Bearing)'
    }
  },
  {
    gateId: 'A4',
    gateName: 'GATE A4',
    classification: 'NARROW',
    classColor: 'slate',
    flight: 'AF256 • A320',
    airline: 'Air France',
    aircraft: 'Airbus A320-200',
    status: 'Boarding Pax',
    standStatus: 'occupied',
    assignedGse: [
      { id: 'ASU-002', label: 'ASU-002', tag: 'ASSIGNED', statusType: 'assigned' }
    ],
    primaryTelemetry: {
      assetId: 'ASU-002',
      name: 'Rheinmetall MSU-400 Air Start Unit',
      status: 'IN TURNAROUND',
      statusType: 'inuse',
      fuelBattery: 92,
      fuelRemainingText: 'Est. 6.2h remaining',
      hydraulicPressure: 3250,
      pressureStatus: 'High Output',
      activeLocation: 'Gate A4 (Apron Mid)',
      operator: 'D. Miller [OP-410]',
      gps: '01.3605° N, 103.9910° E',
      engineHours: '890.2 hrs',
      nextCheck: '45d (Annual)'
    }
  },
  {
    gateId: 'A5',
    gateName: 'GATE A5',
    classification: 'WIDE',
    classColor: 'amber',
    flight: 'SQ318 • B787',
    airline: 'Singapore Airlines',
    aircraft: 'Boeing 787-10 Dreamliner',
    status: 'Pushback Stby',
    standStatus: 'occupied',
    assignedGse: [
      { id: 'TUG-009', label: 'TUG-009', tag: 'TOWBAR', statusType: 'inuse' }
    ],
    primaryTelemetry: {
      assetId: 'TUG-009',
      name: 'Schopf F396 Heavy Towbar Pushback',
      status: 'IN TURNAROUND',
      statusType: 'inuse',
      fuelBattery: 65,
      fuelRemainingText: 'Est. 3.2h remaining',
      hydraulicPressure: 2900,
      pressureStatus: 'Nominal Range',
      activeLocation: 'Gate A5 (Apron West)',
      operator: 'S. Wong [OP-773]',
      gps: '01.3615° N, 103.9920° E',
      engineHours: '7,210.8 hrs',
      nextCheck: '19d (Steering Pinion)'
    }
  }
];

export const fleetStatusDonutData = [
  { name: 'Available', value: 32, percentage: 67, color: '#059669' },
  { name: 'In Turnaround', value: 8, percentage: 17, color: '#d97706' },
  { name: 'Maintenance', value: 6, percentage: 12, color: '#3b82f6' },
  { name: 'Out of Service', value: 2, percentage: 4, color: '#dc2626' }
];

export const categoryRosterData = [
  { name: 'Baggage Tractors', total: 14, ready: 14, text: '14 units • 100% Ready', percent: 100, barColor: '#1d63ed' },
  { name: 'Pushback Tugs', total: 10, ready: 8, oos: 1, text: '10 units • 8 Avail / 1 OOS', percent: 80, barColor: '#1d63ed' },
  { name: 'Belt Loaders', total: 8, ready: 7, text: '8 units • 7 Ready', percent: 87.5, barColor: '#059669' },
  { name: 'Ground Power Units (GPU)', total: 7, ready: 6, text: '7 units • 6 Ready', percent: 85.7, barColor: '#059669' },
  { name: 'Passenger Buses (Cobus)', total: 5, ready: 4, oos: 1, text: '5 units • 1 OOS', percent: 80, barColor: '#d97706' },
  { name: 'Potable / Lavatory Trucks', total: 4, ready: 4, text: '4 units • 100% Ready', percent: 100, barColor: '#059669' }
];

export const upcomingMaintenanceData = [
  {
    assetId: 'TUG-008',
    type: 'Pushback',
    task: '250hr Hydraulic Fluid & Filter Flush',
    dueIn: 'In 18 hours',
    dueType: 'urgent',
    location: 'Bay 2 Hangar 3'
  },
  {
    assetId: 'GPU-006',
    type: 'GPU 90kVA',
    task: 'Output Voltage Calibration & Cable Test',
    dueIn: 'In 2 days',
    dueType: 'medium',
    location: 'Bay 4 Hangar 3'
  },
  {
    assetId: 'BL-004',
    type: 'Belt Loader',
    task: 'Conveyor Roller Bearing Greasing',
    dueIn: 'In 4 days',
    dueType: 'normal',
    location: 'Apron Staging S2'
  }
];

export const activeFaultIncidents = [
  {
    id: '#FLT-9421',
    assetId: 'TUG-017',
    assetModel: 'Goldhofer Kalmar (Pushback)',
    severity: 'AOG Critical Lockout',
    severityLevel: 'critical',
    faultSummary: 'High-pressure steering hydraulic hose rupture',
    location: 'Gate A2 Ramp Lane',
    reportedBy: 'R. Thorne',
    reportedTime: '13:12 UTC',
    status: 'LOCKED OUT'
  },
  {
    id: '#FLT-9418',
    assetId: 'BUS-021',
    assetModel: 'Cobus 3000 (Pax Bus)',
    severity: 'High Fault',
    severityLevel: 'warning',
    faultSummary: 'Alternator charge low voltage warning; cabin AC cutoff',
    location: 'Remote Stand R3',
    reportedBy: 'D. Kalu',
    reportedTime: '11:45 UTC',
    status: 'TAGGED'
  },
  {
    id: '#FLT-9409',
    assetId: 'BL-009',
    assetModel: 'Charlatte Electric Belt',
    severity: 'Minor / Observation',
    severityLevel: 'info',
    faultSummary: 'Front right LED perimeter floodlight bulb flicker',
    location: 'Bay S4 Staging',
    reportedBy: 'M. Vance',
    reportedTime: '09:20 UTC',
    status: 'INSPECTION'
  }
];

export const tacticalActions = [
  {
    id: 'broadcast',
    title: 'Emergency Ramp Broadcast',
    description: 'Trigger ramp hold or lightning alert',
    type: 'danger',
    actionText: 'Broadcast Alert'
  },
  {
    id: 'fuel',
    title: 'GSE Fuel Top-up Request',
    description: 'Dispatch bowser to staging bays S1-S4',
    type: 'warning',
    actionText: 'Request Bowser'
  },
  {
    id: 'handover',
    title: 'Shift Turnover Handover',
    description: 'Prepare logs for Evening Shift Lead',
    type: 'info',
    actionText: 'Generate Handover'
  }
];

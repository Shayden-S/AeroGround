import React from 'react';

export default function StatusBadge({ status, size = 'sm', pulse = false, showDot = true, customLabel }) {
  const norm = (status || '').toUpperCase().trim();

  let dotColor = '#64748b';
  let bgColor = '#f1f5f9';
  let textColor = '#334155';
  let borderColor = '#e2e8f0';

  if (norm === 'AVAILABLE' || norm === 'READY' || norm === 'NOMINAL' || norm === 'CLEARED' || norm === 'STAGED' || norm === 'COMPLIANT' || norm === 'OPEN') {
    dotColor = '#059669';
    bgColor = '#ecfdf5';
    textColor = '#065f46';
    borderColor = '#a7f3d0';
  } else if (norm === 'IN USE' || norm === 'IN TURNAROUND' || norm === 'TURNAROUND' || norm === 'ACTIVE' || norm === 'DUE' || norm === 'GALLEY' || norm === 'TOWBAR') {
    dotColor = '#d97706';
    bgColor = '#fffbeb';
    textColor = '#92400e';
    borderColor = '#fde68a';
  } else if (norm === 'OUT OF SERVICE' || norm === 'OUT OF SVC' || norm === 'OOS' || norm === 'CRITICAL' || norm === 'AOG' || norm === 'ALERT' || norm === 'LOCKED OUT') {
    dotColor = '#dc2626';
    bgColor = '#fef2f2';
    textColor = '#991b1b';
    borderColor = '#fecaca';
  } else if (norm === 'UNDER MAINTENANCE' || norm === 'MAINTENANCE' || norm === 'HANGAR' || norm === 'SCHEDULED' || norm === 'TAGGED') {
    dotColor = '#2563eb';
    bgColor = '#eff6ff';
    textColor = '#1e40af';
    borderColor = '#bfdbfe';
  } else if (norm === 'ASSIGNED' || norm === 'BELT LOAD') {
    dotColor = '#0284c7';
    bgColor = '#f0f9ff';
    textColor = '#0369a1';
    borderColor = '#bae6fd';
  }

  const isSmall = size === 'sm';
  const label = customLabel || status;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: isSmall ? '2px 8px' : '4px 10px',
        borderRadius: '9999px',
        backgroundColor: bgColor,
        color: textColor,
        border: `1px solid ${borderColor}`,
        fontSize: isSmall ? '11px' : '12px',
        fontWeight: '600',
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        lineHeight: 1.2,
        whiteSpace: 'nowrap'
      }}
    >
      {showDot && (
        <span
          style={{
            width: isSmall ? '6px' : '7px',
            height: isSmall ? '6px' : '7px',
            borderRadius: '50%',
            backgroundColor: dotColor,
            flexShrink: 0
          }}
          className={pulse ? 'status-pulse' : ''}
        />
      )}
      {label}
    </span>
  );
}

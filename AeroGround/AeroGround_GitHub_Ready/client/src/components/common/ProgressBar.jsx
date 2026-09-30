import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  height = 6,
  color = '#1d63ed',
  bgColor = '#e2e8f0',
  showLabel = false,
  labelPosition = 'right',
  customLabel,
  className = ''
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }} className={className}>
      <div
        style={{
          flex: 1,
          height: `${height}px`,
          backgroundColor: bgColor,
          borderRadius: `${height}px`,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: `${height}px`,
            transition: 'width 0.3s ease'
          }}
        />
      </div>
      {showLabel && (
        <span
          className="num-tabular"
          style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#475569',
            minWidth: '32px',
            textAlign: labelPosition
          }}
        >
          {customLabel || `${Math.round(percentage)}%`}
        </span>
      )}
    </div>
  );
}

import React from 'react'

const FLAG_META = {
  'Rapid Transfers Detected': {
    severity: 'CRITICAL',
    desc: 'Multiple transactions executed within 60 seconds, indicating potential automated behavior.',
    bg: '#2A1010', color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
  'High Transaction Volume': {
    severity: 'WARNING',
    desc: 'Unusually high number of transactions (>50) detected for this wallet.',
    bg: '#1A1200', color: '#F59E0B', borderColor: 'rgba(245,158,11,0.3)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  'Circular Flow Detected': {
    severity: 'CRITICAL',
    desc: 'Funds flow in circular patterns, potentially indicating money laundering activity.',
    bg: '#2A1010', color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
  'Equal Amount Splitting (Mixer Behavior)': {
    severity: 'CRITICAL',
    desc: 'Same amounts sent to multiple addresses, characteristic of mixing services.',
    bg: '#2A1010', color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
  'Suspicious Address Clustering': {
    severity: 'WARNING',
    desc: 'Frequent interactions between specific addresses, suggesting coordinated activity.',
    bg: '#1A1200', color: '#F59E0B', borderColor: 'rgba(245,158,11,0.3)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
}

const DEFAULT_META = {
  severity: 'INFO',
  desc: 'Suspicious pattern detected in transaction behavior.',
  bg: '#0A2419', color: '#10B981', borderColor: 'rgba(16,185,129,0.3)',
  icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
}

export default function FlagsPanel({ flags }) {
  if (!flags || flags.length === 0) {
    return (
      <div style={{
        backgroundColor: '#0A2419',
        border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '24px',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span style={{ color: '#10B981', fontWeight: 600, fontSize: '14px' }}>
          No suspicious patterns detected
        </span>
      </div>
    )
  }

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ fontSize: '11px', color: '#4A5568', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '16px' }}>
        DETECTED PATTERNS
      </div>
      {flags.map((flag, i) => {
        const meta = FLAG_META[flag] || DEFAULT_META
        return (
          <div key={i} style={{
            backgroundColor: '#0E1420',
            border: '1px solid #1A2238',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '12px',
            display: 'flex', gap: '16px',
          }}>
            <div style={{
              backgroundColor: meta.bg,
              color: meta.color,
              borderRadius: '10px',
              padding: '10px',
              flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {meta.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: '#E8EDF5', fontSize: '14px' }}>{flag}</span>
                <span style={{
                  backgroundColor: meta.bg,
                  color: meta.color,
                  border: `1px solid ${meta.borderColor}`,
                  borderRadius: '999px',
                  padding: '3px 12px',
                  fontSize: '11px',
                  fontWeight: 700,
                }}>
                  {meta.severity}
                </span>
              </div>
              <p style={{ color: '#8B95A8', fontSize: '12px', marginTop: '6px', lineHeight: 1.6 }}>
                {meta.desc}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
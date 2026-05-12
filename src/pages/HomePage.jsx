import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TERMINAL_LINES = [
  '> analyzing wallet 0x910c...59d',
  '[FLAG] known mixer overlap',
  '[FLAG] repeated denomination pattern',
  '[LIVE] 24h market context synced',
  '',
  'next action: inspect destination cluster ▋',
]

function TerminalLine({ line }) {
  if (!line) return <div style={{ height: '20px' }} />

  if (line.startsWith('[FLAG]')) {
    return (
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', lineHeight: '1.6' }}>
        <span style={{ color: '#EF4444' }}>[FLAG]</span>
        <span style={{ color: '#06B6D4' }}>{line.slice(6)}</span>
      </div>
    )
  }
  if (line.startsWith('[LIVE]')) {
    return (
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', lineHeight: '1.6' }}>
        <span style={{ color: '#10B981' }}>[LIVE]</span>
        <span style={{ color: '#06B6D4' }}>{line.slice(6)}</span>
      </div>
    )
  }
  if (line.startsWith('next action:')) {
    return (
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', lineHeight: '1.6' }}>
        <span style={{ color: '#F59E0B' }}>next action:</span>
        <span style={{ color: '#06B6D4' }}>{line.slice(12)}</span>
      </div>
    )
  }
  if (line.startsWith('>')) {
    return (
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', lineHeight: '1.6' }}>
        <span style={{ color: '#4A5568' }}>{'>'}</span>
        <span style={{ color: '#06B6D4' }}>{line.slice(1)}</span>
      </div>
    )
  }
  return (
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: '#06B6D4', lineHeight: '1.6' }}>
      {line}
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    if (visibleLines >= TERMINAL_LINES.length) return
    const t = setTimeout(() => setVisibleLines(v => v + 1), 700)
    return () => clearTimeout(t)
  }, [visibleLines])

  return (
    <main style={{ backgroundColor: '#080C14', minHeight: 'calc(100vh - 100px)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: '64px', alignItems: 'start' }}>

          {/* LEFT */}
          <div>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              backgroundColor: '#1E3A5F',
              border: '1px solid rgba(59,130,246,0.3)',
              color: '#3B82F6',
              borderRadius: '999px',
              padding: '6px 16px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>
              <span>⬡</span> ON-CHAIN INTELLIGENCE WORKSPACE
            </div>

            {/* H1 */}
            <h1 style={{
              fontSize: '60px',
              fontWeight: 900,
              color: '#E8EDF5',
              lineHeight: 1.08,
              marginTop: '24px',
              letterSpacing: '-0.02em',
            }}>
              See wallet behavior<br />
              before it becomes<br />
              risk.
            </h1>

            {/* Subtext */}
            <p style={{
              color: '#8B95A8',
              fontSize: '18px',
              marginTop: '16px',
              maxWidth: '440px',
              lineHeight: 1.7,
            }}>
              Track public addresses, investigate suspicious flows, and compare wallet behavior with live market movement from a single, cleaner workspace.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  backgroundColor: '#3B82F6', color: 'white', fontWeight: 700,
                  padding: '12px 24px', borderRadius: '8px', border: 'none',
                  cursor: 'pointer', fontSize: '15px', transition: 'background-color 150ms ease',
                }}
                onMouseEnter={e => e.target.style.backgroundColor = '#2563EB'}
                onMouseLeave={e => e.target.style.backgroundColor = '#3B82F6'}
              >
                Start investigating →
              </button>
              <button
                onClick={() => navigate('/analytics')}
                style={{
                  backgroundColor: '#141B2D', color: '#E8EDF5', fontWeight: 500,
                  padding: '12px 24px', borderRadius: '8px',
                  border: '1px solid #1A2238', cursor: 'pointer', fontSize: '15px',
                  transition: 'border-color 150ms ease',
                }}
                onMouseEnter={e => e.target.style.borderColor = '#3B82F6'}
                onMouseLeave={e => e.target.style.borderColor = '#1A2238'}
              >
                Explore analytics
              </button>
            </div>

            {/* Feature columns */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              gap: '24px', marginTop: '56px',
              paddingTop: '32px', borderTop: '1px solid #1A2238',
            }}>
              {[
                { label: 'LIVE CHECKS', value: 'Balance + risk scan' },
                { label: 'WATCH TARGETS', value: 'Mixer patterns and high-frequency transfers' },
                { label: 'BEST FOR', value: 'Investigations, monitoring, and reporting' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: '10px', color: '#4A5568', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    {label}
                  </div>
                  <div style={{ color: '#E8EDF5', fontWeight: 600, fontSize: '13px', lineHeight: 1.5 }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Live Briefing Card */}
          <div style={{
            backgroundColor: '#0E1420',
            border: '1px solid #1A2238',
            borderRadius: '16px',
            padding: '28px',
          }}>
            {/* Card header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: '#E8EDF5', fontSize: '15px' }}>Live wallet briefing</span>
              <span style={{
                backgroundColor: '#1E3A5F',
                border: '1px solid rgba(59,130,246,0.3)',
                color: '#3B82F6',
                borderRadius: '999px',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: 700,
              }}>AI HEURISTICS</span>
            </div>

            <div style={{ borderTop: '1px solid #1A2238', margin: '20px 0' }} />

            {/* Risk score row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#4A5568', letterSpacing: '0.12em', textTransform: 'uppercase' }}>RISK SCORE</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '48px', fontWeight: 900, color: '#E8EDF5', marginTop: '8px', lineHeight: 1 }}>
                  85 / 100
                </div>
              </div>
              <span style={{
                backgroundColor: '#2A1010', color: '#EF4444',
                borderRadius: '999px', padding: '6px 16px',
                fontSize: '13px', fontWeight: 700,
              }}>High risk</span>
            </div>

            <div style={{ borderTop: '1px solid #1A2238', margin: '20px 0' }} />

            {/* Status rows */}
            {[
              { label: 'Known entity overlap', badge: 'FLAGGED', bg: '#2A1010', color: '#EF4444' },
              { label: 'Rapid-fire transactions', badge: 'REVIEW', bg: '#1A1200', color: '#F59E0B' },
              { label: 'Cross-check market volatility', badge: 'LIVE', bg: '#0A2419', color: '#10B981' },
            ].map(({ label, badge, bg, color }, i, arr) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 0',
                borderBottom: i < arr.length - 1 ? '1px solid #1A2238' : 'none',
              }}>
                <span style={{ color: '#8B95A8', fontSize: '14px' }}>{label}</span>
                <span style={{
                  backgroundColor: bg, color,
                  borderRadius: '999px', padding: '4px 12px',
                  fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                }}>{badge}</span>
              </div>
            ))}

            <div style={{ borderTop: '1px solid #1A2238', margin: '20px 0' }} />

            {/* Terminal */}
            <div style={{
              backgroundColor: '#04080F',
              border: '1px solid #1A2238',
              borderRadius: '12px',
              padding: '20px',
            }}>
              {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
                <TerminalLine key={i} line={line} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
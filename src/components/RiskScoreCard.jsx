import React, { useEffect, useState } from 'react'

function getRiskColor(score) {
  if (score < 30) return '#10B981'
  if (score < 60) return '#F59E0B'
  return '#EF4444'
}

function getStatusLabel(score) {
  if (score < 30) return 'LOW RISK'
  if (score < 60) return 'MEDIUM RISK'
  return 'HIGH RISK'
}

function getStatusBg(score) {
  if (score < 30) return { bg: '#0A2419', color: '#10B981' }
  if (score < 60) return { bg: '#1A1200', color: '#F59E0B' }
  return { bg: '#2A1010', color: '#EF4444' }
}

export default function RiskScoreCard({ result }) {
  const [displayed, setDisplayed] = useState(0)
  const target = result.riskScore

  useEffect(() => {
    setDisplayed(0)
    const step = Math.max(1, Math.ceil(target / 40))
    const interval = setInterval(() => {
      setDisplayed(prev => {
        if (prev + step >= target) { clearInterval(interval); return target }
        return prev + step
      })
    }, 30)
    return () => clearInterval(interval)
  }, [target])

  const color = getRiskColor(displayed)
  const status = getStatusBg(target)

  return (
    <div style={{
      backgroundColor: '#0E1420',
      border: '1px solid #1A2238',
      borderRadius: '14px',
      padding: '28px',
      marginTop: '24px',
    }}>
      {/* Title row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: '#4A5568', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
          RISK ANALYSIS RESULT
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#8B95A8' }}>
          {result.wallet.slice(0, 8)}...{result.wallet.slice(-5)}
        </span>
      </div>

      {/* Score row */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', marginTop: '20px' }}>
        <div>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '80px',
            fontWeight: 900,
            color,
            lineHeight: 1,
            transition: 'color 300ms ease',
          }}>
            {displayed}
          </span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '24px', color: '#4A5568', marginLeft: '4px' }}>
            / 100
          </span>
        </div>
        <div style={{ paddingBottom: '12px' }}>
          <span style={{
            backgroundColor: status.bg,
            color: status.color,
            borderRadius: '8px',
            padding: '10px 20px',
            fontWeight: 700,
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {getStatusLabel(target)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        width: '100%', height: '6px', backgroundColor: '#1A2238',
        borderRadius: '999px', marginTop: '20px', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${displayed}%`,
          backgroundColor: color,
          borderRadius: '999px',
          transition: 'width 30ms linear, background-color 300ms ease',
        }} />
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px', marginTop: '24px',
        paddingTop: '24px', borderTop: '1px solid #1A2238',
      }}>
        {[
          { label: 'TRANSACTIONS', value: result.stats.totalTransactions },
          { label: 'VOLUME', value: result.stats.totalVolume },
          { label: 'ADDRESSES', value: result.stats.uniqueAddresses },
          { label: 'TIME SPAN', value: result.stats.timeSpan },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ fontSize: '9px', color: '#4A5568', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
              {label}
            </div>
            <div style={{ fontWeight: 700, color: '#E8EDF5', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace' }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
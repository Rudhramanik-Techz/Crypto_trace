import React, { useEffect, useState } from 'react'

function StatCard({ icon, label, value }) {
  return (
    <div style={{ backgroundColor: '#0E1420', border: '1px solid #1A2238', borderRadius: '14px', padding: '24px' }}>
      <div style={{ backgroundColor: '#1E3A5F', color: '#3B82F6', borderRadius: '10px', padding: '10px', display: 'inline-flex', marginBottom: '20px' }}>
        {icon}
      </div>
      <div style={{ fontSize: '10px', color: '#4A5568', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontWeight: 700, color: '#E8EDF5', fontSize: '20px', fontFamily: 'JetBrains Mono, monospace' }}>{value}</div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [coins, setCoins] = useState([])
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('list')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const cgKey = import.meta.env.VITE_COINGECKO_API_KEY

  useEffect(() => {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
      + (cgKey ? `&x_cg_demo_api_key=${cgKey}` : '')
    fetch(url)
      .then(r => r.json())
      .then(data => { setCoins(data); setLoading(false) })
      .catch(() => { setError('Failed to load market data'); setLoading(false) })
  }, [])

  const filtered = coins.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase())
  )

  const topMover = [...coins].sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))[0]
  const positive = coins.filter(c => (c.price_change_percentage_24h || 0) > 0).length
  const avgPrice = coins.length ? coins.reduce((s, c) => s + (c.current_price || 0), 0) / coins.length : 0

  return (
    <main style={{ backgroundColor: '#080C14', minHeight: 'calc(100vh - 100px)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '58% 42%', gap: '64px', alignItems: 'start' }}>

          {/* LEFT */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#1E3A5F', border: '1px solid rgba(59,130,246,0.3)', color: '#3B82F6', borderRadius: '999px', padding: '6px 16px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              <span>≋</span> LIVE MARKET INTELLIGENCE
            </div>

            <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#E8EDF5', lineHeight: 1.1, marginTop: '24px', letterSpacing: '-0.02em' }}>
              Track the market with a<br />cleaner, faster<br />analytics view.
            </h1>

            <p style={{ color: '#8B95A8', fontSize: '16px', marginTop: '16px', lineHeight: 1.7 }}>
              Live prices, 24h changes, and market cap data for the top 100 cryptocurrencies — updated in real time.
            </p>

            {/* Search + controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '32px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '192px', position: 'relative' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="2" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search a cryptocurrency..."
                  style={{ width: '100%', backgroundColor: '#0A0F1A', border: '1px solid #1A2238', borderRadius: '8px', padding: '10px 16px 10px 40px', color: '#E8EDF5', fontSize: '14px', transition: 'border-color 150ms ease' }}
                  onFocus={e => e.target.style.borderColor = '#3B82F6'}
                  onBlur={e => e.target.style.borderColor = '#1A2238'}
                />
              </div>
              <span style={{ backgroundColor: '#141B2D', border: '1px solid #1A2238', color: '#8B95A8', borderRadius: '999px', padding: '6px 16px', fontSize: '12px' }}>
                {filtered.length} matches
              </span>
              {topMover && (
                <span style={{ backgroundColor: '#0A2419', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981', borderRadius: '999px', padding: '6px 16px', fontSize: '12px', fontWeight: 600 }}>
                  ↑ {topMover.symbol?.toUpperCase()} {topMover.price_change_percentage_24h?.toFixed(2)}%
                </span>
              )}
              <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '1px solid #1A2238' }}>
                {[
                  { mode: 'list', label: 'List' },
                  { mode: 'grid', label: 'Grid' },
                ].map(({ mode, label }) => (
                  <button key={mode} onClick={() => setViewMode(mode)} style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer', backgroundColor: viewMode === mode ? '#3B82F6' : '#141B2D', color: viewMode === mode ? 'white' : '#8B95A8', transition: 'all 150ms ease' }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Coin list */}
            <div style={{ marginTop: '24px' }}>
              {loading && Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ backgroundColor: '#141B2D', height: '64px', borderRadius: '12px', marginBottom: '12px' }} />
              ))}
              {error && <div style={{ color: '#EF4444', fontSize: '14px', padding: '20px 0' }}>{error}</div>}
              {!loading && filtered.length === 0 && (
                <div style={{ textAlign: 'center', color: '#4A5568', fontSize: '14px', padding: '40px 0' }}>
                  No coins match "{search}"
                </div>
              )}
              {!loading && viewMode === 'list' && filtered.map(coin => <CoinRow key={coin.id} coin={coin} />)}
              {!loading && viewMode === 'grid' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {filtered.map(coin => <CoinCard key={coin.id} coin={coin} />)}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ position: 'sticky', top: '88px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <StatCard
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
              label="ASSETS LOADED"
              value={coins.length}
            />
            <StatCard
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
              label="POSITIVE MOVERS"
              value={positive}
            />
            <StatCard
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}
              label="AVERAGE PRICE"
              value={'$' + Number(avgPrice.toFixed(2)).toLocaleString()}
            />
          </div>

        </div>
      </div>
    </main>
  )
}

function CoinRow({ coin }) {
  const [hovered, setHovered] = useState(false)
  const pct = coin.price_change_percentage_24h || 0
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? '#141B2D' : '#0E1420',
        border: '1px solid #1A2238', borderRadius: '12px',
        padding: '16px 20px', marginBottom: '12px',
        display: 'flex', alignItems: 'center', gap: '16px',
        transition: 'background-color 150ms ease', cursor: 'default',
      }}
    >
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#4A5568', width: '32px', textAlign: 'right' }}>
        #{coin.market_cap_rank}
      </span>
      <img src={coin.image} alt={coin.name} style={{ width: '34px', height: '34px', borderRadius: '50%' }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, color: '#E8EDF5', fontSize: '14px' }}>{coin.name}</div>
        <div style={{ fontSize: '12px', color: '#4A5568' }}>{coin.symbol?.toUpperCase()}</div>
      </div>
      <span style={{ backgroundColor: pct >= 0 ? '#0A2419' : '#2A1010', color: pct >= 0 ? '#10B981' : '#EF4444', borderRadius: '999px', padding: '4px 12px', fontSize: '12px', fontWeight: 700 }}>
        {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
      </span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: '24px', textAlign: 'right' }}>
        {[
          { label: 'PRICE', value: '$' + (coin.current_price || 0).toLocaleString() },
          { label: '24H VOLUME', value: '$' + ((coin.total_volume || 0) / 1e9).toFixed(2) + 'B' },
          { label: 'MARKET CAP', value: '$' + ((coin.market_cap || 0) / 1e9).toFixed(2) + 'B' },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ fontSize: '9px', color: '#4A5568', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontWeight: 700, color: '#E8EDF5', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace' }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CoinCard({ coin }) {
  const pct = coin.price_change_percentage_24h || 0
  return (
    <div style={{ backgroundColor: '#0E1420', border: '1px solid #1A2238', borderRadius: '12px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#4A5568' }}>#{coin.market_cap_rank}</span>
        <img src={coin.image} alt={coin.name} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
        <div>
          <div style={{ fontWeight: 600, color: '#E8EDF5', fontSize: '13px' }}>{coin.name}</div>
          <div style={{ fontSize: '11px', color: '#4A5568' }}>{coin.symbol?.toUpperCase()}</div>
        </div>
      </div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '22px', fontWeight: 900, color: '#E8EDF5', margin: '12px 0' }}>
        ${(coin.current_price || 0).toLocaleString()}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ backgroundColor: pct >= 0 ? '#0A2419' : '#2A1010', color: pct >= 0 ? '#10B981' : '#EF4444', borderRadius: '999px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>
          {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
        </span>
        <span style={{ fontSize: '11px', color: '#4A5568' }}>${((coin.market_cap || 0) / 1e9).toFixed(2)}B cap</span>
      </div>
    </div>
  )
}
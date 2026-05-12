import React, { useState, useEffect } from 'react'
import RiskScoreCard from '../components/RiskScoreCard'
import FlagsPanel from '../components/FlagsPanel'
import TransactionGraph from '../components/TransactionGraph'
import TransactionTable from '../components/TransactionTable'

const NETWORKS = [
  { value: 'ethereum', label: 'Ethereum (ETH)', icon: '⟠' },
  { value: 'bitcoin',  label: 'Bitcoin (BTC)',  icon: '₿' },
  { value: 'polygon',  label: 'Polygon (MATIC)', icon: '⬡' },
  { value: 'binance',  label: 'Binance (BNB)',  icon: '◈' },
]

function StatCard({ icon, label, value }) {
  return (
    <div style={{
      backgroundColor: '#0E1420',
      border: '1px solid #1A2238',
      borderRadius: '14px',
      padding: '24px',
    }}>
      <div style={{
        backgroundColor: '#1E3A5F', color: '#3B82F6',
        borderRadius: '10px', padding: '10px',
        display: 'inline-flex', marginBottom: '20px',
      }}>
        {icon}
      </div>
      <div style={{ fontSize: '10px', color: '#4A5568', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
        {label}
      </div>
      <div style={{ fontWeight: 700, color: '#E8EDF5', fontSize: '17px', fontFamily: 'JetBrains Mono, monospace' }}>
        {value}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [address, setAddress] = useState('')
  const [network, setNetwork] = useState('ethereum')
  const [networkOpen, setNetworkOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [apiKeyOverride, setApiKeyOverride] = useState('')

  useEffect(() => {
    const key = import.meta.env.VITE_ETHERSCAN_API_KEY
    if (!key) {
      console.warn('⚠️ VITE_ETHERSCAN_API_KEY is not set in .env')
    } else {
      const masked = key.substring(0, 10) + '...' + key.substring(key.length - 5)
      console.log('✅ Etherscan API key loaded from environment')
      console.log(`    Full key length: ${key.length} characters`)
      console.log(`    Masked: ${masked}`)
      console.log(`    First 10 chars: ${key.substring(0, 10)}`)
      console.log(`    Last 5 chars: ${key.substring(key.length - 5)}`)
    }
  }, [])

  async function handleAnalyze() {
    const cleanAddress = address.trim()
    const effectiveKey = apiKeyOverride.trim() || import.meta.env.VITE_ETHERSCAN_API_KEY?.trim() || ''

    if (!cleanAddress) {
      setError('Please enter a wallet address')
      return
    }
    if (!cleanAddress.startsWith('0x')) {
      setError('Address must start with 0x')
      return
    }
    if (cleanAddress.length !== 42) {
      setError(`Invalid address length: got ${cleanAddress.length} characters, expected 42. Check for extra characters or spaces.`)
      return
    }
    if (!/^0x[0-9a-fA-F]{40}$/.test(cleanAddress)) {
      setError('Address contains invalid characters. Only 0-9 and a-f allowed after 0x.')
      return
    }
    if (!effectiveKey) {
      setError('No Etherscan API key found. Add VITE_ETHERSCAN_API_KEY to .env file.')
      return
    }

    setError('')
    setLoading(true)
    setResult(null)
    
    try {
      const masked = effectiveKey.substring(0, 10) + '...' + effectiveKey.substring(effectiveKey.length - 5)
      console.log(`🔍 Analyzing wallet: ${cleanAddress}`)
      console.log(`🔑 Using API key: ${masked} (length: ${effectiveKey.length})`)
      
      const params = new URLSearchParams({
        address: cleanAddress,
        apikey: effectiveKey
      })
      
      console.log(`📡 Sending request to: /api/analyze?${params.toString().substring(0, 50)}...`)
      
      const res = await fetch(`/api/analyze?${params.toString()}`)
      const data = await res.json()
      
      console.log(`📊 Server response status: ${res.status}`)
      console.log(`📊 Server response data:`, data)
      
      if (!res.ok || data.error) {
        throw new Error(data.error || `Server error ${res.status}`)
      }
      setResult(data)
    } catch (err) {
      console.error(`❌ Analysis error:`, err)
      setError(err.message || 'Analysis failed. Is the server running on port 3001?')
    } finally {
      setLoading(false)
    }
  }

  const selectedNetwork = NETWORKS.find(n => n.value === network)

  return (
    <main style={{ backgroundColor: '#080C14', minHeight: 'calc(100vh - 100px)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '58% 42%', gap: '64px', alignItems: 'start' }}>

          {/* LEFT */}
          <div>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              backgroundColor: '#1E3A5F', border: '1px solid rgba(59,130,246,0.3)',
              color: '#3B82F6', borderRadius: '999px', padding: '6px 16px',
              fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              <span>⬡</span> WALLET INVESTIGATION WORKSPACE
            </div>

            {/* H1 */}
            <h1 style={{
              fontSize: '48px', fontWeight: 900, color: '#E8EDF5',
              lineHeight: 1.1, marginTop: '24px', letterSpacing: '-0.02em',
            }}>
              Track balances, follow flows,<br />
              and surface suspicious<br />
              activity faster.
            </h1>

            <p style={{ color: '#8B95A8', fontSize: '16px', marginTop: '16px', lineHeight: 1.7 }}>
              Paste any Ethereum address to run heuristic analysis, visualize transaction flows, and surface risk signals in seconds.
            </p>

            {/* API Key section */}
            <div style={{ marginTop: '32px' }}>
              {!import.meta.env.VITE_ETHERSCAN_API_KEY ? (
                <div>
                  <div style={{ fontSize: '10px', color: '#4A5568', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
                    ETHERSCAN API KEY
                  </div>
                  <input
                    type="password"
                    value={apiKeyOverride}
                    onChange={e => setApiKeyOverride(e.target.value)}
                    placeholder="Paste your Etherscan API key"
                    style={{
                      width: '100%', backgroundColor: '#0A0F1A',
                      border: '1px solid #1A2238', borderRadius: '8px',
                      padding: '12px 16px', color: '#E8EDF5',
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '13px',
                      transition: 'border-color 150ms ease',
                    }}
                    onFocus={e => e.target.style.borderColor = '#3B82F6'}
                    onBlur={e => e.target.style.borderColor = '#1A2238'}
                  />
                  <div style={{ fontSize: '11px', color: '#4A5568', marginTop: '6px' }}>
                    get a free key at{' '}
                    <a href="https://etherscan.io/apis" target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6' }}>
                      etherscan.io/apis
                    </a>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#10B981' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  API key loaded from environment
                </div>
              )}
            </div>

            {/* Search form */}
            <div style={{
              backgroundColor: '#0E1420', border: '1px solid #1A2238',
              borderRadius: '16px', padding: '24px', marginTop: '24px',
            }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '200px', fontSize: '10px', color: '#4A5568', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                  NETWORK
                </div>
                <div style={{ flex: 1, fontSize: '10px', color: '#4A5568', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                  ADDRESS OR TRANSACTION HASH
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {/* Network dropdown */}
                <div style={{ width: '200px', position: 'relative' }}>
                  <button
                    onClick={() => setNetworkOpen(o => !o)}
                    style={{
                      width: '100%', backgroundColor: '#0A0F1A',
                      border: `1px solid ${networkOpen ? '#3B82F6' : '#1A2238'}`,
                      borderRadius: '8px', padding: '12px 16px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      cursor: 'pointer', color: '#E8EDF5', fontSize: '14px',
                      transition: 'border-color 150ms ease',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#3B82F6' }}>{selectedNetwork?.icon}</span>
                      <span>{selectedNetwork?.label}</span>
                    </span>
                    <svg
                      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B95A8" strokeWidth="2"
                      style={{ transform: networkOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 150ms ease' }}
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {networkOpen && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%', zIndex: 50,
                      backgroundColor: '#0E1420', border: '1px solid #1A2238', borderRadius: '12px', overflow: 'hidden',
                    }}>
                      {NETWORKS.map(n => (
                        <div
                          key={n.value}
                          onClick={() => { setNetwork(n.value); setNetworkOpen(false) }}
                          style={{
                            padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px',
                            cursor: 'pointer', fontSize: '14px',
                            backgroundColor: n.value === network ? '#141B2D' : 'transparent',
                            borderLeft: n.value === network ? '2px solid #3B82F6' : '2px solid transparent',
                            color: '#E8EDF5', fontWeight: n.value === network ? 600 : 400,
                            transition: 'background-color 150ms ease',
                          }}
                          onMouseEnter={e => { if (n.value !== network) e.currentTarget.style.backgroundColor = '#141B2D' }}
                          onMouseLeave={e => { if (n.value !== network) e.currentTarget.style.backgroundColor = 'transparent' }}
                        >
                          <span style={{ color: '#3B82F6' }}>{n.icon}</span>
                          {n.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Address input */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="2"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}
                  >
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value.trim())}
                    onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                    placeholder="0x... wallet address"
                    style={{
                      width: '100%', backgroundColor: '#0A0F1A',
                      border: '1px solid #1A2238', borderRadius: '8px',
                      padding: '12px 56px 12px 40px',
                      color: '#E8EDF5', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px',
                      transition: 'border-color 150ms ease, box-shadow 150ms ease',
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#3B82F6'
                      e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)'
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#1A2238'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                  {address.length > 0 && (
                    <div style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', pointerEvents: 'none',
                      color: address.trim().length === 42 ? '#10B981' : address.trim().length > 42 ? '#EF4444' : '#F59E0B',
                    }}>
                      {address.trim().length}/42
                    </div>
                  )}
                </div>

                {/* Analyze button */}
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? '#1E3A5F' : '#3B82F6',
                    color: 'white', fontWeight: 700, fontSize: '14px',
                    padding: '12px 24px', borderRadius: '8px', border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    whiteSpace: 'nowrap', transition: 'background-color 150ms ease',
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#2563EB' }}
                  onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#3B82F6' }}
                >
                  {loading ? (
                    <>
                      <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56"/>
                      </svg>
                      Analyzing...
                    </>
                  ) : 'Analyze flow'}
                </button>
              </div>

              {/* Feature chips */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
                {['Address and transaction lookup', 'Mixer pattern heuristics', 'Recent transaction timeline'].map(chip => (
                  <span key={chip} style={{
                    backgroundColor: '#141B2D', border: '1px solid #1A2238',
                    color: '#8B95A8', borderRadius: '999px', padding: '6px 16px',
                    fontSize: '12px', cursor: 'pointer', transition: 'all 150ms ease',
                  }}
                    onMouseEnter={e => { e.target.style.borderColor = '#3B82F6'; e.target.style.color = '#3B82F6' }}
                    onMouseLeave={e => { e.target.style.borderColor = '#1A2238'; e.target.style.color = '#8B95A8' }}
                  >
                    {chip}
                  </span>
                ))}
                <span style={{
                  backgroundColor: '#1E3A5F', border: '1px solid #3B82F6',
                  color: '#3B82F6', borderRadius: '999px', padding: '6px 16px', fontSize: '12px',
                }}>
                  START HERE
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                backgroundColor: '#2A1010',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '12px',
                padding: '16px 20px',
                marginTop: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '1px', flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <div>
                  <div style={{ color: '#EF4444', fontWeight: 600, fontSize: '14px' }}>Analysis Failed</div>
                  <div style={{ color: '#F87171', fontSize: '13px', marginTop: '4px', lineHeight: 1.6 }}>{error}</div>
                  {error.includes('API key') && (
                    <div style={{
                      color: '#8B95A8', fontSize: '12px', marginTop: '8px',
                      padding: '8px 12px', backgroundColor: '#1A2238',
                      borderRadius: '8px', fontFamily: 'JetBrains Mono, monospace',
                    }}>
                      Fix: Add <span style={{ color: '#3B82F6' }}>VITE_ETHERSCAN_API_KEY</span>=your_key to your <span style={{ color: '#3B82F6' }}>.env</span> file then restart Vite
                    </div>
                  )}
                  {error.includes('length') && (
                    <div style={{ color: '#8B95A8', fontSize: '12px', marginTop: '8px', fontFamily: 'JetBrains Mono, monospace' }}>
                      Current length: <span style={{ color: '#F59E0B' }}>{address.trim().length}</span>&nbsp;(need exactly <span style={{ color: '#10B981' }}>42</span>)
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div style={{ marginTop: '48px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="skeleton" style={{
                    backgroundColor: '#0E1420', borderRadius: '14px',
                    height: '112px', marginBottom: '16px',
                  }} />
                ))}
                <div style={{ textAlign: 'center', color: '#4A5568', fontSize: '14px', marginTop: '16px' }}>
                  Running heuristic analysis on blockchain data...
                </div>
              </div>
            )}

            {/* Empty state */}
            {!result && !loading && (
              <div style={{ marginTop: '48px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#E8EDF5' }}>
                  Paste a wallet address or transaction hash to begin.
                </h2>
                <p style={{ color: '#8B95A8', marginTop: '12px', fontSize: '15px', lineHeight: 1.7 }}>
                  The dashboard will return balances, recent activity, flagged transfers, and a lightweight value chart once results are available.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px' }}>
                  {[
                    {
                      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
                      title: 'Wallet balances by selected network',
                      desc: 'Real-time balance from Etherscan across supported chains',
                    },
                    {
                      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
                      title: 'Suspicious transaction summaries and reasoning',
                      desc: 'Heuristic flags with explanation for each detected pattern',
                    },
                    {
                      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
                      title: 'Visual transaction flow history for quick review',
                      desc: 'Interactive graph showing fund flows between addresses',
                    },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{
                        backgroundColor: '#1E3A5F', color: '#3B82F6',
                        borderRadius: '10px', padding: '10px', flexShrink: 0,
                      }}>
                        {icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#E8EDF5', fontSize: '14px' }}>{title}</div>
                        <div style={{ color: '#8B95A8', fontSize: '12px', marginTop: '2px' }}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            {result && (
              <div>
                <RiskScoreCard result={result} />
                <FlagsPanel flags={result.flags} />
                <TransactionGraph graphData={result.graphData} wallet={result.wallet} />
                <TransactionTable transactions={result.transactions} />
              </div>
            )}
          </div>

          {/* RIGHT — Stat cards */}
          <div style={{ position: 'sticky', top: '88px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <StatCard
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>}
                label="SELECTED NETWORK"
                value={result ? network.charAt(0).toUpperCase() + network.slice(1) : 'Ethereum'}
              />
              <StatCard
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                label="CURRENT BALANCE"
                value={result ? result.stats.totalVolume : 'Awaiting search'}
              />
              <StatCard
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
                label="RECORDS ANALYZED"
                value={result ? `${result.stats.totalTransactions} records` : '0 records'}
              />
              <StatCard
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
                label="RISK ALERTS"
                value={result ? `${result.flags.length} alerts` : 'Scan pending'}
              />
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
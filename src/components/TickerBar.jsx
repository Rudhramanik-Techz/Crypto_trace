import React, { useEffect, useState } from 'react'

const COIN_IDS = 'ethereum,bitcoin,binancecoin,matic-network,solana,avalanche-2,chainlink'
const SYMBOLS = {
  ethereum: 'ETH',
  bitcoin: 'BTC',
  binancecoin: 'BNB',
  'matic-network': 'MATIC',
  solana: 'SOL',
  'avalanche-2': 'AVAX',
  chainlink: 'LINK',
}

export default function TickerBar() {
  const [prices, setPrices] = useState([])
  const cgKey = import.meta.env.VITE_COINGECKO_API_KEY

  useEffect(() => {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${COIN_IDS}&vs_currencies=usd&include_24hr_change=true`
      + (cgKey ? `&x_cg_demo_api_key=${cgKey}` : '')

    fetch(url)
      .then(r => r.json())
      .then(data => {
        const items = Object.entries(data).map(([id, v]) => ({
          id,
          symbol: SYMBOLS[id] || id.toUpperCase(),
          price: v.usd,
          change: v.usd_24h_change,
        }))
        setPrices(items)
      })
      .catch(() => {})
  }, [])

  if (prices.length === 0) return null

  const doubled = [...prices, ...prices]

  return (
    <div style={{
      backgroundColor: '#0E1420',
      borderBottom: '1px solid #1A2238',
      padding: '10px 0',
      overflow: 'hidden',
    }}>
      <div className="ticker-track" style={{ display: 'flex', gap: '0', alignItems: 'center' }}>
        {doubled.map((coin, i) => (
          <React.Fragment key={i}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 24px', whiteSpace: 'nowrap' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#8B95A8', fontWeight: 600 }}>
                {coin.symbol}
              </span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#E8EDF5' }}>
                ${coin.price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px',
                color: coin.change >= 0 ? '#10B981' : '#EF4444',
              }}>
                {coin.change >= 0 ? '+' : ''}{coin.change?.toFixed(2)}%
              </span>
            </span>
            <span style={{ color: '#4A5568', fontSize: '12px' }}>·</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
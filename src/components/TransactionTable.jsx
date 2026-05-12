import React, { useState } from 'react'

function timeAgo(timestamp) {
  const now = Date.now()
  const then = parseInt(timestamp) * 1000
  const diff = now - then
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (days > 0) return `${days}d ago`
  if (hrs > 0) return `${hrs}h ago`
  if (mins > 0) return `${mins}m ago`
  return 'just now'
}

export default function TransactionTable({ transactions }) {
  const [page, setPage] = useState(1)
  const PER_PAGE = 20

  const sorted = [...transactions].sort((a, b) => parseInt(b.timeStamp) - parseInt(a.timeStamp))
  const totalPages = Math.ceil(sorted.length / PER_PAGE)
  const paged = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div style={{
      backgroundColor: '#0E1420',
      border: '1px solid #1A2238',
      borderRadius: '14px',
      overflow: 'hidden',
      marginTop: '24px',
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#141B2D', borderBottom: '1px solid #1A2238',
        padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <span style={{ fontSize: '11px', color: '#4A5568', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
          RECENT TRANSACTIONS
        </span>
        <span style={{
          backgroundColor: '#1E3A5F', color: '#3B82F6',
          borderRadius: '999px', padding: '3px 10px', fontSize: '11px',
        }}>
          {transactions.length}
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#141B2D', borderBottom: '1px solid #1A2238' }}>
              {['HASH', 'FROM', 'TO', 'VALUE', 'TIME', 'STATUS'].map(col => (
                <th key={col} style={{
                  padding: '12px 20px', textAlign: 'left',
                  fontSize: '9px', color: '#4A5568',
                  letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600,
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((tx, i) => (
              <tr
                key={tx.hash}
                style={{ borderBottom: '1px solid #1A2238', transition: 'background-color 150ms ease', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#141B2D'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '14px 20px' }}>
                  <span
                    onClick={() => window.open(`https://etherscan.io/tx/${tx.hash}`, '_blank')}
                    style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '12px',
                      color: '#3B82F6', cursor: 'pointer',
                    }}
                  >
                    {tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#8B95A8' }}>
                    {tx.from.slice(0, 8)}...{tx.from.slice(-5)}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#8B95A8' }}>
                    {tx.to ? `${tx.to.slice(0, 8)}...${tx.to.slice(-5)}` : '—'}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#E8EDF5', fontWeight: 600 }}>
                    {(parseInt(tx.value) / 1e18).toFixed(6)} ETH
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: '12px', color: '#4A5568' }}>
                    {timeAgo(tx.timeStamp)}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    backgroundColor: tx.isError === '0' ? '#0A2419' : '#2A1010',
                    color: tx.isError === '0' ? '#10B981' : '#EF4444',
                    borderRadius: '999px', padding: '4px 12px',
                    fontSize: '11px', fontWeight: 700,
                  }}>
                    {tx.isError === '0' ? 'Success' : 'Failed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 24px', borderTop: '1px solid #1A2238',
        }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              backgroundColor: '#141B2D', border: '1px solid #1A2238',
              color: page === 1 ? '#4A5568' : '#E8EDF5',
              borderRadius: '8px', padding: '8px 16px', cursor: page === 1 ? 'not-allowed' : 'pointer',
              fontSize: '13px', transition: 'border-color 150ms ease',
            }}
          >
            ← Previous
          </button>
          <span style={{ fontSize: '13px', color: '#4A5568' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              backgroundColor: '#141B2D', border: '1px solid #1A2238',
              color: page === totalPages ? '#4A5568' : '#E8EDF5',
              borderRadius: '8px', padding: '8px 16px', cursor: page === totalPages ? 'not-allowed' : 'pointer',
              fontSize: '13px', transition: 'border-color 150ms ease',
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
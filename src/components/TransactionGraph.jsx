import React, { useEffect, useRef, useState } from 'react'
import ForceGraph2D from 'react-force-graph-2d'

export default function TransactionGraph({ graphData, wallet }) {
  const graphRef = useRef()
  const [selectedNode, setSelectedNode] = useState(null)

  useEffect(() => {
    if (graphRef.current && graphData?.nodes?.length > 0) {
      setTimeout(() => graphRef.current.zoomToFit(400), 200)
    }
  }, [graphData])

  if (!graphData?.nodes?.length) {
    return (
      <div style={{
        backgroundColor: '#080C14',
        border: '1px solid #1A2238',
        borderRadius: '14px',
        overflow: 'hidden',
        marginTop: '24px',
      }}>
        <div style={{
          backgroundColor: '#0E1420', borderBottom: '1px solid #1A2238',
          padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '11px', color: '#4A5568', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
            TRANSACTION GRAPH
          </span>
        </div>
        <div style={{ height: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#4A5568', fontSize: '14px' }}>No graph data available</span>
        </div>
      </div>
    )
  }

  const getNodeColor = (node) => {
    if (node.id?.toLowerCase() === wallet?.toLowerCase()) return '#3B82F6'
    if (node.type === 'contract') return '#F59E0B'
    return '#4A5568'
  }

  return (
    <div style={{
      backgroundColor: '#080C14',
      border: '1px solid #1A2238',
      borderRadius: '14px',
      overflow: 'hidden',
      marginTop: '24px',
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#0E1420', borderBottom: '1px solid #1A2238',
        padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: '#4A5568', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
            TRANSACTION GRAPH
          </span>
          <span style={{
            backgroundColor: '#1E3A5F', color: '#3B82F6',
            borderRadius: '999px', padding: '3px 12px', fontSize: '11px',
          }}>
            {graphData.nodes.length} nodes
          </span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {[
            { color: '#3B82F6', label: 'Analyzed Wallet' },
            { color: '#8B95A8', label: 'Address' },
            { color: '#F59E0B', label: 'Contract' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }} />
              <span style={{ fontSize: '12px', color: '#8B95A8' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Graph */}
      <div style={{ position: 'relative' }}>
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          backgroundColor="#080C14"
          height={420}
          nodeColor={getNodeColor}
          nodeRelSize={6}
          linkColor={() => '#1A2238'}
          linkDirectionalArrowLength={8}
          linkDirectionalArrowRelPos={1}
          linkWidth={1.5}
          onNodeClick={(node) => setSelectedNode(node === selectedNode ? null : node)}
          nodeCanvasObjectMode={() => 'after'}
          nodeCanvasObject={(node, ctx) => {
            const label = node.id ? node.id.slice(0, 6) + '...' : ''
            ctx.font = '10px JetBrains Mono, monospace'
            ctx.fillStyle = '#8B95A8'
            ctx.textAlign = 'center'
            ctx.fillText(label, node.x, node.y + 14)
          }}
          cooldownTicks={100}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
        />

        {/* Selected node tooltip */}
        {selectedNode && (
          <div style={{
            position: 'absolute', top: '16px', left: '16px',
            backgroundColor: '#0E1420', border: '1px solid #1A2238',
            borderRadius: '10px', padding: '16px', maxWidth: '280px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', color: '#4A5568', letterSpacing: '0.1em', textTransform: 'uppercase' }}>NODE DETAILS</span>
              <button onClick={() => setSelectedNode(null)} style={{ background: 'none', border: 'none', color: '#4A5568', cursor: 'pointer', fontSize: '16px' }}>×</button>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#3B82F6', wordBreak: 'break-all', marginBottom: '8px' }}>
              {selectedNode.id}
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#4A5568', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Type</div>
                <div style={{ fontSize: '12px', color: '#E8EDF5', marginTop: '2px', textTransform: 'capitalize' }}>{selectedNode.type}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#4A5568', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Txns</div>
                <div style={{ fontSize: '12px', color: '#E8EDF5', marginTop: '2px' }}>{selectedNode.txCount}</div>
              </div>
            </div>
          </div>
        )}

        {/* Fit button */}
        <button
          onClick={() => graphRef.current?.zoomToFit(400)}
          style={{
            position: 'absolute', bottom: '16px', right: '16px',
            backgroundColor: '#0E1420', border: '1px solid #1A2238',
            borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#8B95A8',
          }}
          title="Fit to view"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
            <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
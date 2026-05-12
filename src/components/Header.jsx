import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  return (
    <header style={{
      backgroundColor: '#080C14',
      borderBottom: '1px solid #1A2238',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      height: '64px',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 32px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="#1E3A5F" stroke="#3B82F6" strokeWidth="1.5"/>
            <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" fill="#3B82F6" opacity="0.3"/>
            <circle cx="14" cy="14" r="3" fill="#3B82F6"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: '17px', color: '#E8EDF5', letterSpacing: '-0.01em' }}>
            ChainTrace
          </span>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: '4px' }}>
          {[
            { to: '/', label: 'Home' },
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/analytics', label: 'Analytics' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                padding: '6px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#3B82F6' : '#8B95A8',
                backgroundColor: isActive ? '#1E3A5F' : 'transparent',
                textDecoration: 'none',
                transition: 'all 150ms ease',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            backgroundColor: '#3B82F6',
            color: 'white',
            fontWeight: 700,
            fontSize: '14px',
            padding: '8px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease',
          }}
          onMouseEnter={e => e.target.style.backgroundColor = '#2563EB'}
          onMouseLeave={e => e.target.style.backgroundColor = '#3B82F6'}
        >
          Start Tracking
        </button>
      </div>
    </header>
  )
}
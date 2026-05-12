import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import TickerBar from './components/TickerBar'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import AnalyticsPage from './pages/AnalyticsPage'

function App() {
  return (
    <div style={{ backgroundColor: '#080C14', minHeight: '100vh' }}>
      <Header />
      <TickerBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </div>
  )
}

export default App
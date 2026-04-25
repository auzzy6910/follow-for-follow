import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Explore from './pages/Explore'
import Credits from './pages/Credits'
import GoldenHour from './pages/GoldenHour'
import QualityScore from './pages/QualityScore'
import Tribes from './pages/Tribes'
import Gamification from './pages/Gamification'
import Safety from './pages/Safety'
import Settings from './pages/Settings'
import Wallet from './pages/Wallet'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/golden-hour" element={<GoldenHour />} />
            <Route path="/quality" element={<QualityScore />} />
            <Route path="/tribes" element={<Tribes />} />
            <Route path="/gamification" element={<Gamification />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/wallet" element={<Wallet />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App

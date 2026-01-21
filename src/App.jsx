import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import HeroPage from './Pages/HeroPage'
import CreateWorkspace from './Pages/CreateWorkspace'
import TeamLeadDashboard from './Pages/TeamLeadDashboard'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/create-workspace" element={<CreateWorkspace />} />
        <Route path="/team-lead-dashboard" element={<TeamLeadDashboard />} />
      </Routes>
    </>
  )
}

export default App

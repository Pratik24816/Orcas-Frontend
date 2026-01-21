import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import HeroPage from './Pages/HeroPage'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HeroPage />} />
      </Routes>
    </>
  )
}

export default App

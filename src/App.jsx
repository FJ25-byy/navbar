import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './Navbar.jsx'
import { Beranda, Cari, Pustaka, Kamu } from './pages.jsx'

export default function App() {
  const loc = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [loc.pathname])
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.main
          key={loc.pathname} className="page"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
        >
          <Routes location={loc}>
            <Route path="/" element={<Beranda />} />
            <Route path="/cari" element={<Cari />} />
            <Route path="/pustaka" element={<Pustaka />} />
            <Route path="/kamu" element={<Kamu />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Navbar />
    </>
  )
}

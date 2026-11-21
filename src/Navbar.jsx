import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  motion, animate, useMotionValue, useMotionValueEvent,
  useSpring, useTransform, useVelocity,
} from 'framer-motion'
import { House, Search, Library, User } from 'lucide-react'

const ITEMS = [
  { to: '/', label: 'Beranda', Icon: House },
  { to: '/cari', label: 'Cari', Icon: Search },
  { to: '/pustaka', label: 'Pustaka', Icon: Library },
  { to: '/kamu', label: 'Kamu', Icon: User },
]
const LH = 62
const MAXW = 80
const PAD = 6
const SNAP = { type: 'spring', stiffness: 420, damping: 26, mass: 0.9 }

// Peta displacement (merah = X, hijau = Y) -> perbesaran halus
const ramp = (w, h, x2, y2, c) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="#000"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/></svg>`
  )}`

export default function Navbar() {
  const nav = useNavigate()
  const { pathname } = useLocation()
  const active = Math.max(0, ITEMS.findIndex((i) => (i.to === '/' ? pathname === '/' : pathname.startsWith(i.to))))

  const barRef = useRef(null)
  const [w, setW] = useState(340)
  const cell = (w - PAD * 2) / ITEMS.length
  const LENS = Math.min(MAXW, Math.floor(cell))
  const MAP_X = useMemo(() => ramp(LENS, LH, 1, 0, '#f00'), [LENS])
  const MAP_Y = useMemo(() => ramp(LENS, LH, 0, 1, '#0f0'), [LENS])
  const posOf = (i) => PAD + i * cell + (cell - LENS) / 2
  const idxOf = (left) =>
    Math.min(ITEMS.length - 1, Math.max(0, Math.floor((left + LENS / 2 - PAD) / cell)))

  const x = useMotionValue(posOf(active))
  const vx = useVelocity(x)
  const dragging = useRef(false)
  const first = useRef(true)
  const [near, setNear] = useState(active)
  const [pressed, setPressed] = useState(false)

  useLayoutEffect(() => {
    const el = barRef.current
    const ro = new ResizeObserver(() => setW(el.offsetWidth))
    setW(el.offsetWidth)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Sinkron dengan URL (klik, drag, tombol back/forward browser)
  useEffect(() => {
    setNear(active)
    if (dragging.current) return
    if (first.current) { first.current = false; x.set(posOf(active)); return }
    animate(x, posOf(active), SNAP)
  }, [active, w])

  useMotionValueEvent(x, 'change', (v) => { if (dragging.current) setNear(idxOf(v)) })

  // Bentuk cair: melar searah gerakan
  const sx = useSpring(useTransform(vx, [-1800, 0, 1800], [1.28, 1, 1.28]), { stiffness: 300, damping: 22 })
  const sy = useSpring(useTransform(vx, [-1800, 0, 1800], [0.9, 1, 0.9]), { stiffness: 300, damping: 22 })
  const shineX = useTransform(vx, [-1800, 1800], [9, -9])

  const constraints = useMemo(() => ({ left: PAD, right: w - PAD - LENS }), [w])

  const end = (_, info) => {
    const idx = idxOf(x.get() + info.velocity.x * 0.1)
    dragging.current = false
    setPressed(false)
    setNear(idx)
    animate(x, posOf(idx), { ...SNAP, velocity: info.velocity.x })
    if (idx !== active) nav(ITEMS[idx].to)
  }

  return (
    <div className="dock">
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="lens-refract" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feImage href={MAP_X} x="0" y="0" width={LENS} height={LH} preserveAspectRatio="none" result="mx" />
          <feImage href={MAP_Y} x="0" y="0" width={LENS} height={LH} preserveAspectRatio="none" result="my" />
          <feComposite in="mx" in2="my" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="8" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <nav className="bar" ref={barRef} aria-label="Navigasi utama">
        <div className="bar-glass" />
        {ITEMS.map(({ to, label, Icon }, i) => (
          <button key={to} className={`item ${near === i ? 'on' : ''}`} onClick={() => nav(to)}
            aria-current={active === i ? 'page' : undefined}>
            <motion.span className="ico" whileHover={{ y: -2, scale: 1.12 }} whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
              <Icon size={22} strokeWidth={2.1} />
            </motion.span>
            <span>{label}</span>
          </button>
        ))}

        <motion.div
          className={`lens ${pressed ? 'grabbing' : ''}`}
          style={{ x, scaleX: sx, scaleY: sy, width: LENS, height: LH }}
          drag="x" dragConstraints={constraints} dragElastic={0.1} dragMomentum={false}
          onPointerDown={() => setPressed(true)}
          onPointerUp={() => !dragging.current && setPressed(false)}
          onDragStart={() => { dragging.current = true; setPressed(true) }}
          onDragEnd={end}
          role="presentation"
        >
          <motion.div className="lens-body" animate={{ scale: pressed ? 1.14 : 1 }} transition={{ type: 'spring', stiffness: 380, damping: 20 }}>
            <div className="lens-glass" />
            <div className="lens-ring" />
            <motion.div className="lens-shine" style={{ x: shineX }} />
            <div className="lens-glint" />
          </motion.div>
        </motion.div>
      </nav>
    </div>
  )
}

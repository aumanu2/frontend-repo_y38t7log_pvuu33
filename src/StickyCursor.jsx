import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// StickyCursor — elastic, magnetic cursor with orbit rings and spark trail
export default function StickyCursor() {
  const [enabled, setEnabled] = useState(true)
  const [hovering, setHovering] = useState(false)
  const [label, setLabel] = useState('')
  const [core, setCore] = useState(18)
  const [aura, setAura] = useState(96)
  const [down, setDown] = useState(false)

  const mx = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0)
  const my = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0)

  const x = useSpring(mx, { stiffness: 420, damping: 28, mass: 0.28 })
  const y = useSpring(my, { stiffness: 420, damping: 28, mass: 0.28 })

  const ax = useSpring(mx, { stiffness: 140, damping: 18, mass: 0.8 })
  const ay = useSpring(my, { stiffness: 140, damping: 18, mass: 0.8 })

  // particle trail
  const particles = useRef([])
  const [, force] = useState(0)

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) setEnabled(false)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const move = (e) => { mx.set(e.clientX); my.set(e.clientY) }
    const handleDown = () => setDown(true)
    const handleUp = () => setDown(false)
    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', handleDown)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [enabled, mx, my])

  // Magnet targets
  useEffect(() => {
    if (!enabled) return
    const els = Array.from(document.querySelectorAll('[data-cursor]'))
    const listeners = els.map((el) => {
      const enter = () => {
        setHovering(true)
        setCore(parseInt(el.getAttribute('data-cursor-size') || '14', 10))
        setAura(parseInt(el.getAttribute('data-cursor-aura') || '128', 10))
        setLabel(el.getAttribute('data-cursor-label') || '')
      }
      const leave = () => {
        setHovering(false); setCore(18); setAura(96); setLabel('')
      }
      el.addEventListener('mouseenter', enter)
      el.addEventListener('mouseleave', leave)
      return () => { el.removeEventListener('mouseenter', enter); el.removeEventListener('mouseleave', leave) }
    })
    return () => listeners.forEach((off) => off())
  }, [enabled])

  // Spark particles loop
  useEffect(() => {
    if (!enabled) return
    let raf
    const loop = () => {
      const now = Date.now()
      particles.current.push({
        id: now + Math.random(),
        x: mx.get() + (Math.random() - 0.5) * 8,
        y: my.get() + (Math.random() - 0.5) * 8,
        life: 1,
        hue: (now / 18) % 360,
      })
      particles.current = particles.current.map(p => ({ ...p, life: p.life - 0.035 })).filter(p => p.life > 0)
      force(v => v + 1)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [enabled, mx, my])

  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]">
      {/* Trail particles */}
      {particles.current.map(p => (
        <motion.span
          key={p.id}
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: p.life * 0.9, scale: 0.5 + p.life * 0.6 }}
          className="absolute w-2.5 h-2.5 rounded-full"
          style={{
            left: p.x,
            top: p.y,
            translateX: '-50%',
            translateY: '-50%',
            background: `conic-gradient(from 0deg, hsl(${p.hue} 85% 60%) 0 30%, transparent 30% 100%)`
          }}
        />
      ))}

      {/* Aura blob */}
      <motion.div className="absolute" style={{ x: ax, y: ay, translateX: '-50%', translateY: '-50%' }}>
        <motion.div
          animate={{
            width: aura,
            height: aura,
            borderRadius: hovering ? '36% 64% 60% 40% / 42% 44% 56% 58%' : '999px',
            rotate: hovering ? 8 : 0,
            filter: hovering ? 'blur(14px)' : 'blur(10px)'
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 16 }}
          className="bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.22),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(147,51,234,0.22),transparent_60%)] shadow-[0_0_48px_rgba(59,130,246,0.28)]"
        />
      </motion.div>

      {/* Core */}
      <motion.div className="absolute" style={{ x, y, translateX: '-50%', translateY: '-50%' }}>
        <motion.div
          animate={{ width: core, height: core, scale: down ? 0.9 : 1 }}
          transition={{ type: 'spring', stiffness: 600, damping: 30 }}
          className="relative rounded-full"
          style={{
            background: 'radial-gradient(closest-side, rgba(255,255,255,0.95), rgba(255,255,255,0.25))',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 8px 24px rgba(59,130,246,0.35)'
          }}
        >
          <motion.span className="absolute inset-0 rounded-full border border-blue-400/40" animate={{ rotate: [0, 360] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
          <motion.span className="absolute inset-0 rounded-full border border-purple-400/30" style={{ scale: 1.35 }} animate={{ rotate: [360, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
        </motion.div>
      </motion.div>

      {label && (
        <motion.div
          className="absolute px-2 py-1 rounded-md text-xs font-medium text-white bg-black/70 backdrop-blur"
          style={{ x: ax, y: ay, translateX: '-50%', translateY: '-170%' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          {label}
        </motion.div>
      )}
    </div>
  )
}

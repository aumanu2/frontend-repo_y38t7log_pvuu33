import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'

// CroquetCard — a playful, professional, game-inspired card with physics pegs and goal ring
export default function CroquetCard({ title, subtitle, icon, color = '#2563eb' }) {
  const ref = useRef(null)
  const [hover, setHover] = useState(false)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const rx = useSpring(useTransform(my, [ -80, 80 ], [ 8, -8 ]), { stiffness: 200, damping: 18 })
  const ry = useSpring(useTransform(mx, [ -80, 80 ], [ -8, 8 ]), { stiffness: 200, damping: 18 })
  const glow = useTransform([mx, my], ([x, y]) => {
    const dx = (x + 80) / 160
    const dy = (y + 80) / 160
    const cx = 20 + dx * 60
    const cy = 20 + dy * 60
    return `radial-gradient(circle at ${cx}% ${cy}%, rgba(255,255,255,0.4), transparent 60%)`
  })

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    mx.set(e.clientX - rect.left - rect.width/2)
    my.set(e.clientY - rect.top - rect.height/2)
  }

  const pegs = Array.from({ length: 6 }).map((_, i) => ({ id: i, angle: (i/6) * Math.PI * 2 }))

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); mx.set(0); my.set(0) }}
      style={{ rotateX: rx, rotateY: ry, backgroundImage: glow }}
      className="relative w-80 h-56 rounded-2xl p-5 bg-white/90 backdrop-blur shadow-[0_10px_40px_rgba(2,6,23,0.10)] border border-black/5 overflow-hidden"
    >
      {/* Goal ring */}
      <motion.div
        className="absolute -right-8 -top-8 w-40 h-40 rounded-full"
        style={{ background: `radial-gradient(circle, ${color}22, transparent 60%)` }}
        animate={{ rotate: hover ? 20 : 0, scale: hover ? 1.1 : 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 14 }}
      />

      {/* Icon puck */}
      <motion.div
        className="absolute right-6 top-6 w-12 h-12 rounded-xl flex items-center justify-center text-white"
        style={{ background: color, boxShadow: `0 12px 28px ${color}55` }}
        animate={{ y: hover ? -6 : 0, rotate: hover ? -6 : 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16 }}
      >
        {icon}
      </motion.div>

      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-slate-600 mt-1">{subtitle}</p>
      </div>

      {/* Pegs around perimeter acting like bumpers */}
      {pegs.map((p) => (
        <motion.span
          key={p.id}
          className="absolute w-2.5 h-2.5 rounded-full"
          style={{
            left: `calc(50% + ${Math.cos(p.angle) * 130}px)`,
            top: `calc(50% + ${Math.sin(p.angle) * 85}px)`,
            background: color
          }}
          animate={{ y: hover ? Math.sin(p.angle + Math.PI/4) * 3 : 0 }}
          transition={{ y: { type: 'spring', stiffness: 300, damping: 18 } }}
        />
      ))}

      {/* Ball that chases pointer with slight delay */}
      <motion.span
        className="absolute w-4 h-4 rounded-full bg-white shadow-[0_6px_16px_rgba(2,6,23,0.15)] border border-black/5"
        style={{
          left: '50%', top: '50%', translateX: '-50%', translateY: '-50%',
          x: useSpring(mx, { stiffness: 220, damping: 20 }),
          y: useSpring(my, { stiffness: 220, damping: 20 })
        }}
        animate={{ scale: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
      />

      {/* Bottom progress bar with bounce */}
      <motion.div className="absolute left-5 right-5 bottom-5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <motion.span
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: color }}
          animate={{ width: hover ? '100%' : '35%' }}
          transition={{ type: 'spring', stiffness: 160, damping: 14 }}
        />
      </motion.div>
    </motion.div>
  )
}

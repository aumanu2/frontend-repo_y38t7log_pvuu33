import { Rocket, Gamepad2, Sparkles, Palette } from 'lucide-react'
import StickyCursor from './StickyCursor'
import CroquetCard from './components/CroquetCard'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative">
      <StickyCursor />

      <header className="relative z-10 max-w-6xl mx-auto px-6 pt-14 pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3" data-cursor data-cursor-size="22" data-cursor-aura="120" data-cursor-label="Drag me with your eyes">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white grid place-items-center shadow-[0_10px_30px_rgba(37,99,235,0.35)]">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Motion Playground</h1>
              <p className="text-slate-600 text-sm">Sticky cursor + playfully professional cards</p>
            </div>
          </div>
          <a href="/test" className="text-slate-600 hover:text-slate-900 transition-colors" data-cursor data-cursor-size="14" data-cursor-aura="110" data-cursor-label="Ping backend">Backend Test</a>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <section className="grid md:grid-cols-3 gap-8 place-items-center">
          <CroquetCard title="Launch Flows" subtitle="Design delightful motion systems" color="#2563eb" icon={<Rocket size={22} />} />
          <CroquetCard title="Gamey UX" subtitle="Add playful, tasteful micro-interactions" color="#7c3aed" icon={<Gamepad2 size={22} />} />
          <CroquetCard title="Creative Edge" subtitle="Invent patterns that feel fresh" color="#0ea5e9" icon={<Palette size={22} />} />
        </section>

        <section className="mt-16 grid sm:grid-cols-2 gap-4">
          <button
            className="group relative overflow-hidden rounded-xl px-5 py-4 bg-slate-900 text-white shadow-[0_14px_40px_rgba(2,6,23,0.25)]"
            data-cursor data-cursor-size="16" data-cursor-aura="140" data-cursor-label="Primary Action"
          >
            <span className="relative z-10">Start Building</span>
            <span className="absolute inset-0 bg-[radial-gradient(600px_circle_at_var(--x,50%)_var(--y,50%),rgba(59,130,246,0.35),transparent_40%)] transition-opacity opacity-100" />
          </button>
          <button
            className="group relative overflow-hidden rounded-xl px-5 py-4 bg-white text-slate-900 border border-black/5 shadow-[0_14px_40px_rgba(2,6,23,0.08)]"
            data-cursor data-cursor-size="16" data-cursor-aura="130" data-cursor-label="Secondary"
          >
            <span className="relative z-10">Try a Demo</span>
            <span className="absolute inset-0 bg-[radial-gradient(600px_circle_at_var(--x,50%)_var(--y,50%),rgba(124,58,237,0.20),transparent_40%)] transition-opacity opacity-100" />
          </button>
        </section>
      </main>

      <footer className="relative z-10 px-6 pb-10 text-center text-slate-500">
        Built for playful pros — hover anything and watch the cursor adapt.
      </footer>
    </div>
  )
}

export default App

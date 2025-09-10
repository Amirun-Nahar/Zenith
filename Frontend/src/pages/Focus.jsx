import { useEffect, useRef, useState } from 'react'

const WORK_MIN = 25
const BREAK_MIN = 5

export default function Focus() {
  const [mode, setMode] = useState('idle') // idle | work | break
  const [seconds, setSeconds] = useState(WORK_MIN * 60)
  const [completed, setCompleted] = useState(() => Number(localStorage.getItem('focus_completed')||0))
  const intervalRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('focus_state')
    if (saved) {
      try {
        const s = JSON.parse(saved)
        setMode(s.mode)
        setSeconds(s.seconds)
        setCompleted(s.completed || 0)
      } catch (e) {
        console.error('Failed to parse focus_state from localStorage:', e)
        // Clear corrupted data
        localStorage.removeItem('focus_state')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('focus_state', JSON.stringify({ mode, seconds, completed }))
    localStorage.setItem('focus_completed', String(completed))
  }, [mode, seconds, completed])

  useEffect(() => {
    if (mode === 'idle') return
    intervalRef.current && clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          if (mode === 'work') {
            setMode('break')
            return BREAK_MIN * 60
          } else {
            setMode('idle')
            setCompleted((c) => c + 1)
            return WORK_MIN * 60
          }
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [mode])

  function startWork() { setMode('work'); setSeconds(WORK_MIN * 60) }
  function pause() { clearInterval(intervalRef.current); setMode('idle') }
  function reset() { clearInterval(intervalRef.current); setMode('idle'); setSeconds(WORK_MIN * 60) }

  const mm = String(Math.floor(seconds/60)).padStart(2,'0')
  const ss = String(seconds%60).padStart(2,'0')

  const growth = Math.min(100, completed * 10)

  return (
    <div className="space-y-5 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold" style={{ color: '#E43D12' }}>Focus Mode</h1>
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        <div className="card p-4 sm:p-6 flex flex-col items-center">
          <div className="text-xs sm:text-sm mb-2" style={{ color: '#E43D12', opacity: 0.8 }}>
            {mode === 'work' ? 'Work session' : mode === 'break' ? 'Break session' : 'Ready'}
          </div>
          <div className="text-5xl sm:text-6xl font-bold tracking-tight" style={{ color: '#E43D12' }}>{mm}:{ss}</div>
          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button 
              className="btn btn-primary w-full sm:w-auto text-base sm:text-sm py-2.5 sm:py-2 transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0" 
              onClick={startWork}
            >
              Start
            </button>
            <button 
              className="btn w-full sm:w-auto text-base sm:text-sm py-2.5 sm:py-2 transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0" 
              onClick={pause}
            >
              Pause
            </button>
            <button 
              className="btn w-full sm:w-auto text-base sm:text-sm py-2.5 sm:py-2 transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0" 
              onClick={reset}
            >
              Reset
            </button>
          </div>
        </div>
        <div className="card p-4 sm:p-6">
          <h2 className="text-lg font-medium mb-2" style={{ color: '#E43D12' }}>Productivity Pet</h2>
          <p className="text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: '#E43D12', opacity: 0.8 }}>
            Completing sessions grows your plant.
          </p>
          <div 
            className="rounded-xl p-3 sm:p-4 flex items-end h-36 sm:h-48" 
            style={{ backgroundColor: '#EBE9E1' }}
          >
            <div 
              className="mx-auto w-16 sm:w-24 rounded-b-full bg-emerald-400" 
              style={{ height: `${30 + growth * 0.6}px` }} 
            />
          </div>
          <div className="text-xs sm:text-sm mt-2 sm:mt-3" style={{ color: '#E43D12', opacity: 0.8 }}>
            Completed sessions: <span className="font-medium" style={{ color: '#E43D12' }}>{completed}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

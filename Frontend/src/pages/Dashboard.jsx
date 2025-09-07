import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import AIDashboard from '../components/AIDashboard'

function ExamCountdown() {
  const [title, setTitle] = useState(() => localStorage.getItem('exam_title') || 'Final Exam')
  const [date, setDate] = useState(() => localStorage.getItem('exam_date') || '')

  useEffect(() => {
    localStorage.setItem('exam_title', title)
  }, [title])
  useEffect(() => {
    localStorage.setItem('exam_date', date)
  }, [date])

  const remaining = useMemo(() => {
    if (!date) return null
    const target = new Date(date)
    const now = new Date()
    const diff = target.getTime() - now.getTime()
    if (isNaN(diff)) return null
    const totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24))
    const hours = Math.max(0, Math.floor((diff % (1000*60*60*24)) / (1000*60*60)))
    return { days: totalDays, hours }
  }, [date])

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4" style={{ color: '#f8f7e5' }}>Exam Countdown</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <input 
            className="w-full px-3 py-2.5 sm:py-2 rounded-lg bg-white/10 border border-white/20 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-white/30" 
            value={title} 
            onChange={(e)=>setTitle(e.target.value)} 
            placeholder="Exam Title"
            style={{ color: '#f8f7e5' }}
          />
          <input 
            className="w-full px-3 py-2.5 sm:py-2 rounded-lg bg-white/10 border border-white/20 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-white/30" 
            type="date" 
            value={date} 
            onChange={(e)=>setDate(e.target.value)}
            style={{ color: '#f8f7e5' }}
          />
        </div>
        {remaining ? (
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-4 md:gap-6 mt-4">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold" style={{ color: '#f8f7e5' }}>{remaining.days}</div>
              <div className="text-xs sm:text-sm" style={{ color: '#f8f7e5', opacity: 0.7 }}>Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-semibold" style={{ color: '#f8f7e5' }}>{remaining.hours}</div>
              <div className="text-xs sm:text-sm" style={{ color: '#f8f7e5', opacity: 0.7 }}>Hours</div>
            </div>
            <div className="sm:ml-auto text-center sm:text-right">
              <div className="font-medium text-sm sm:text-base" style={{ color: '#f8f7e5' }}>{title}</div>
              <div className="text-xs sm:text-sm" style={{ color: '#f8f7e5', opacity: 0.7 }}>{date || 'Pick a date'}</div>
            </div>
          </div>
        ) : (
          <div className="text-center sm:text-left mt-3 sm:mt-4">
            <p className="text-sm" style={{ color: '#f8f7e5', opacity: 0.8 }}>
              Set your exam title and date to start the countdown.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [classes, setClasses] = useState([])
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [cls, sum] = await Promise.all([
        api.get('/api/classes'),
        api.get('/api/transactions/summary/month').catch(()=>({ income:0, expense:0, balance:0 }))
      ])
      setClasses(cls)
      setSummary(sum)
    } catch (e) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const nextClass = useMemo(() => {
    if (classes.length === 0) return null
    const dayOrder = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    const now = new Date()
    const today = dayOrder[now.getDay()]
    const toMinutes = (t) => {
      const [h,m] = String(t).split(':').map(Number); return h*60+m
    }
    // Compute upcoming within week window
    const candidates = []
    classes.forEach((c) => {
      const dIdx = dayOrder.indexOf(c.day)
      const todayIdx = dayOrder.indexOf(today)
      let delta = dIdx - todayIdx
      if (delta < 0) delta += 7
      let minutes = delta*24*60 + toMinutes(c.startTime)
      const nowMinutes = toMinutes(now.getHours().toString().padStart(2,'0')+":"+now.getMinutes().toString().padStart(2,'0'))
      const currentDayMinutes = now.getHours()*60 + now.getMinutes()
      const totalNow = 0*24*60 + currentDayMinutes // today baseline
      if (delta === 0 && toMinutes(c.startTime) <= currentDayMinutes) {
        // if already started today, push to next week
        minutes += 7*24*60
      }
      candidates.push({ ...c, eta: minutes })
    })
    candidates.sort((a,b)=>a.eta-b.eta)
    return candidates[0] || null
  }, [classes])

  return (
    <div className="space-y-5 sm:space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 md:gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: '#f8f7e5' }}>Dashboard</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={load} 
            className="btn btn-primary text-sm sm:text-base py-2.5 sm:py-2 px-4 w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-3 sm:mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-4 sm:p-6">
              <div className="h-5 sm:h-6 w-20 sm:w-24 bg-white/10 rounded mb-3 sm:mb-4"></div>
              <div className="h-10 sm:h-12 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <section className="card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4" style={{ color: '#f8f7e5' }}>Next Class</h2>
            {nextClass ? (
              <div className="space-y-2 sm:space-y-3">
                <div className="font-medium text-base sm:text-lg" style={{ color: '#f8f7e5' }}>{nextClass.subject}</div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm sm:text-base" style={{ color: '#f8f7e5', opacity: 0.7 }}>
                  <span>{nextClass.day}</span>
                  <span>•</span>
                  <span>{nextClass.startTime}–{nextClass.endTime}</span>
                  {nextClass.instructor && (
                    <>
                      <span>•</span>
                      <span>{nextClass.instructor}</span>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm sm:text-base" style={{ color: '#f8f7e5', opacity: 0.8 }}>No upcoming classes.</p>
            )}
          </section>

          <section className="card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4" style={{ color: '#f8f7e5' }}>Budget Snapshot</h2>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="text-center p-2.5 sm:p-3 rounded-lg bg-white/5">
                <div className="text-xs sm:text-sm mb-1.5 sm:mb-2" style={{ color: '#f8f7e5', opacity: 0.7 }}>Income</div>
                <div className="font-semibold text-sm sm:text-base md:text-lg text-lime-400">${summary.income.toFixed(2)}</div>
              </div>
              <div className="text-center p-2.5 sm:p-3 rounded-lg bg-white/5">
                <div className="text-xs sm:text-sm mb-1.5 sm:mb-2" style={{ color: '#f8f7e5', opacity: 0.7 }}>Expense</div>
                <div className="font-semibold text-sm sm:text-base md:text-lg text-red-300">${summary.expense.toFixed(2)}</div>
              </div>
              <div className="text-center p-2.5 sm:p-3 rounded-lg bg-white/5">
                <div className="text-xs sm:text-sm mb-1.5 sm:mb-2" style={{ color: '#f8f7e5', opacity: 0.7 }}>Balance</div>
                <div className="font-semibold text-sm sm:text-base md:text-lg text-cyan-300">${summary.balance.toFixed(2)}</div>
              </div>
            </div>
          </section>

          <section className="card p-4 sm:p-6 md:col-span-2 lg:col-span-1">
            <ExamCountdown />
          </section>
        </div>
      )}

      {/* AI Dashboard Section */}
      <div className="mt-5 sm:mt-6 md:mt-8">
        <AIDashboard />
      </div>
    </div>
  )
}

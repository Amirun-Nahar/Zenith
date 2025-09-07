import { useEffect, useState } from 'react'
import { api } from '../lib/api'

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export default function Schedule() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState({ subject: '', instructor: '', day: 'Mon', startTime: '', endTime: '', color: '#3b82f6' })

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await api.get('/api/classes')
      setItems(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function onChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  function validTime(t) {
    if (!t || t.trim() === '') return false
    // Allow both HH:MM and H:MM formats
    return /^\d{1,2}:\d{2}$/.test(t.trim())
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    
    // Debug logging
    console.log('Form data:', form)
    console.log('Subject:', form.subject, 'Day:', form.day)
    console.log('Start time:', form.startTime, 'Valid:', validTime(form.startTime))
    console.log('End time:', form.endTime, 'Valid:', validTime(form.endTime))
    
    if (!form.subject || !form.day || !validTime(form.startTime) || !validTime(form.endTime)) {
      let errorMsg = 'Please enter: '
      if (!form.subject) errorMsg += 'subject, '
      if (!form.day) errorMsg += 'day, '
      if (!validTime(form.startTime)) errorMsg += 'valid start time (HH:MM), '
      if (!validTime(form.endTime)) errorMsg += 'valid end time (HH:MM), '
      errorMsg = errorMsg.slice(0, -2) // Remove trailing comma and space
      setError(errorMsg)
      return
    }
    try {
      await api.post('/api/classes', form)
      setForm({ subject: '', instructor: '', day: 'Mon', startTime: '', endTime: '', color: '#3b82f6' })
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  async function remove(id) {
    try {
      await api.delete(`/api/classes/${id}`)
      setItems((prev) => prev.filter((i) => i._id !== id))
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold" style={{ color: '#f8f7e5' }}>Class Schedule</h1>
      </div>

      <div className="grid md:grid-cols-[1fr_1fr] gap-4 sm:gap-6">
        <div className="card p-4 sm:p-6">
          <h2 className="text-lg font-medium mb-3 sm:mb-4" style={{ color: '#f8f7e5' }}>Add Class</h2>
          <form onSubmit={submit} className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="col-span-2 space-y-1 sm:space-y-2">
              <label className="text-sm block" style={{ color: '#f8f7e5' }}>Subject</label>
              <input 
                className="input w-full text-base sm:text-sm py-2.5 sm:py-2" 
                name="subject" 
                value={form.subject} 
                onChange={onChange} 
                required 
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <label className="text-sm block" style={{ color: '#f8f7e5' }}>Instructor</label>
              <input 
                className="input w-full text-base sm:text-sm py-2.5 sm:py-2" 
                name="instructor" 
                value={form.instructor} 
                onChange={onChange} 
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <label className="text-sm block" style={{ color: '#f8f7e5' }}>Day</label>
              <select 
                className="input w-full text-base sm:text-sm py-2.5 sm:py-2" 
                name="day" 
                value={form.day} 
                onChange={onChange}
              >
                {DAYS.map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <label className="text-sm block" style={{ color: '#f8f7e5' }}>Start Time</label>
              <input 
                className="input w-full text-base sm:text-sm py-2.5 sm:py-2" 
                type="time"
                name="startTime" 
                value={form.startTime} 
                onChange={onChange} 
                required
                style={{
                  colorScheme: 'dark',
                  '--tw-placeholder-opacity': '0.7'
                }}
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <label className="text-sm block" style={{ color: '#f8f7e5' }}>End Time</label>
              <input 
                className="input w-full text-base sm:text-sm py-2.5 sm:py-2" 
                type="time"
                name="endTime" 
                value={form.endTime} 
                onChange={onChange} 
                required
                style={{
                  colorScheme: 'dark',
                  '--tw-placeholder-opacity': '0.7'
                }}
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <label className="text-sm block" style={{ color: '#f8f7e5' }}>Color</label>
              <input 
                className="input w-full text-base sm:text-sm py-2.5 sm:py-2" 
                type="color" 
                name="color" 
                value={form.color} 
                onChange={onChange} 
              />
            </div>
            {error && <p className="col-span-2 text-sm text-red-600 mt-1">{error}</p>}
            <div className="col-span-2">
              <button className="btn btn-primary w-full sm:w-auto text-base sm:text-sm py-2.5 sm:py-2">Add Class</button>
            </div>
          </form>
        </div>

        <div className="card p-4 sm:p-6">
          <h2 className="text-lg font-medium mb-3 sm:mb-4" style={{ color: '#f8f7e5' }}>Weekly View</h2>
          {loading ? (
            <p className="text-sm sm:text-base" style={{ color: '#f8f7e5', opacity: 0.8 }}>Loading…</p>
          ) : (
            <div className="space-y-4 sm:space-y-3">
              {DAYS.map((d) => (
                <DayRow key={d} day={d} items={items.filter(i => i.day === d)} onRemove={remove} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DayRow({ day, items, onRemove }) {
  return (
    <div>
      <div className="text-sm font-medium mb-1.5 sm:mb-1" style={{ color: '#f8f7e5' }}>{day}</div>
      <div className="flex flex-wrap gap-2">
        {items.length === 0 && (
          <span className="text-xs sm:text-sm" style={{ color: '#f8f7e5', opacity: 0.7 }}>No classes</span>
        )}
        {items.map((c) => (
          <div 
            key={c._id} 
            className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 rounded-lg px-3 py-2 w-full sm:w-auto" 
            style={{ backgroundColor: withAlpha(c.color, 0.12), border: `1px solid ${withAlpha(c.color, 0.25)}` }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="inline-block h-2 sm:h-2.5 w-2 sm:w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
              <span className="text-sm font-medium truncate" style={{ color: '#f8f7e5' }}>{c.subject}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs" style={{ color: '#f8f7e5', opacity: 0.7 }}>
              <span>{c.startTime}–{c.endTime}</span>
              {c.instructor && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span>{c.instructor}</span>
                </>
              )}
            </div>
            <button 
              className="btn btn-danger text-xs px-3 py-1.5 sm:py-1 w-full sm:w-auto mt-1.5 sm:mt-0 sm:ml-2" 
              onClick={() => onRemove(c._id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function withAlpha(hex, alpha) {
  try {
    const h = hex.replace('#','')
    const r = parseInt(h.substring(0,2),16)
    const g = parseInt(h.substring(2,4),16)
    const b = parseInt(h.substring(4,6),16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  } catch { return hex }
}

import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Planner() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ subject: '', topic: '', priority: 'medium', deadline: '' })

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await api.get('/api/tasks')
      setItems(data)
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  function onChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (!form.subject || !form.topic) { setError('Subject and topic are required'); return }
    try {
      const payload = { ...form, deadline: form.deadline ? new Date(form.deadline) : undefined }
      await api.post('/api/tasks', payload)
      setForm({ subject: '', topic: '', priority: 'medium', deadline: '' })
      load()
    } catch (e) { setError(e.message) }
  }

  async function toggle(id, completed) {
    try {
      const updated = await api.put(`/api/tasks/${id}`, { completed: !completed })
      setItems((prev) => prev.map((t) => t._id === id ? updated : t))
    } catch (e) { setError(e.message) }
  }

  async function remove(id) {
    try { await api.delete(`/api/tasks/${id}`); setItems((p)=>p.filter(t=>t._id!==id)) } catch (e) { setError(e.message) }
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold" style={{ color: '#F5EFE6' }}>Study Planner</h1>

      <div className="card p-4 sm:p-6">
        <h2 className="text-lg font-medium mb-3 sm:mb-4" style={{ color: '#F5EFE6' }}>Add Task</h2>
        <form onSubmit={submit} className="grid md:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1 sm:space-y-2">
            <label className="text-sm block" style={{ color: '#F5EFE6' }}>Subject</label>
            <input 
              className="input w-full text-base sm:text-sm py-2.5 sm:py-2" 
              name="subject" 
              value={form.subject} 
              onChange={onChange} 
            />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <label className="text-sm block" style={{ color: '#F5EFE6' }}>Topic</label>
            <input 
              className="input w-full text-base sm:text-sm py-2.5 sm:py-2" 
              name="topic" 
              value={form.topic} 
              onChange={onChange} 
            />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <label className="text-sm block" style={{ color: '#F5EFE6' }}>Priority</label>
            <select 
              className="input w-full text-base sm:text-sm py-2.5 sm:py-2" 
              name="priority" 
              value={form.priority} 
              onChange={onChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <label className="text-sm block" style={{ color: '#F5EFE6' }}>Deadline</label>
            <input 
              className="input w-full text-base sm:text-sm py-2.5 sm:py-2" 
              type="date" 
              name="deadline" 
              value={form.deadline} 
              onChange={onChange} 
            />
          </div>
          {error && <p className="md:col-span-2 text-sm text-red-600 mt-1">{error}</p>}
          <div className="md:col-span-2">
            <button className="btn btn-primary w-full sm:w-auto text-base sm:text-sm py-2.5 sm:py-2">Add Task</button>
          </div>
        </form>
      </div>

      <div className="card p-4 sm:p-6">
        <h2 className="text-lg font-medium mb-3 sm:mb-4" style={{ color: '#F5EFE6' }}>Tasks</h2>
        {loading ? (
          <p className="text-sm sm:text-base" style={{ color: '#F5EFE6', opacity: 0.8 }}>Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm sm:text-base" style={{ color: '#F5EFE6', opacity: 0.8 }}>No tasks yet.</p>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {items.map((t) => (
              <div 
                key={t._id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-3 sm:px-4 sm:py-3 gap-2 sm:gap-4" 
                style={{ borderColor: t.completed ? '#6D94C5' : t.priority==='high' ? '#6D94C5' : t.priority==='medium' ? '#6D94C5' : '#6D94C5' }}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={t.completed} 
                    onChange={() => toggle(t._id, t.completed)}
                    className="mt-1 sm:mt-0" 
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-base sm:text-base truncate">{t.subject} — {t.topic}</div>
                    <div className="text-xs flex flex-wrap gap-x-2 gap-y-1 mt-1" style={{ color: '#F5EFE6', opacity: 0.7 }}>
                      <span>Priority: {t.priority}</span>
                      {t.deadline && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span>Due: {new Date(t.deadline).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  className="btn btn-danger text-xs px-3 py-1.5 sm:py-1 w-full sm:w-auto" 
                  onClick={() => remove(t._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

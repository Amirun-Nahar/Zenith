import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'

const CATEGORIES = ['food','transport','books','entertainment','others']

export default function Budget() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ type: 'expense', amount: '', category: 'food', note: '' })

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [list, sum] = await Promise.all([
        api.get('/api/transactions'),
        api.get('/api/transactions/summary/month')
      ])
      setItems(list)
      setSummary(sum)
    } catch (e) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function onChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 })

  async function submit(e) {
    e.preventDefault()
    setError('')
    const amount = Number(form.amount)
    if (!form.type || !form.category || isNaN(amount) || amount < 0) {
      setError('Please enter a valid non-negative amount and category')
      return
    }
    try {
      await api.post('/api/transactions', { ...form, amount })
      setForm({ type: 'expense', amount: '', category: 'food', note: '' })
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  async function remove(id) {
    try {
      await api.delete(`/api/transactions/${id}`)
      setItems((prev) => prev.filter((i) => i._id !== id))
      const sum = await api.get('/api/transactions/summary/month')
      setSummary(sum)
    } catch (e) { setError(e.message) }
  }

  const byCategory = useMemo(() => {
    const map = {}
    for (const it of items.filter(i => i.type === 'expense')) {
      map[it.category] = (map[it.category] || 0) + it.amount
    }
    return map
  }, [items])

  return (
    <div className="space-y-5 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold" style={{ color: '#E7F2EF' }}>Budget Tracker</h1>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="card p-4 sm:p-6">
          <h2 className="text-lg font-medium mb-3 sm:mb-4" style={{ color: '#E7F2EF' }}>Add Transaction</h2>
          <form onSubmit={submit} className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1 sm:space-y-2">
              <label className="text-sm block" style={{ color: '#E7F2EF' }}>Type</label>
              <select 
                className="input w-full text-base sm:text-sm py-2.5 sm:py-2" 
                name="type" 
                value={form.type} 
                onChange={onChange}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <label className="text-sm block" style={{ color: '#E7F2EF' }}>Category</label>
              <select 
                className="input w-full text-base sm:text-sm py-2.5 sm:py-2" 
                name="category" 
                value={form.category} 
                onChange={onChange}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <label className="text-sm block" style={{ color: '#E7F2EF' }}>Amount</label>
              <input 
                className="input w-full text-base sm:text-sm py-2.5 sm:py-2" 
                name="amount" 
                value={form.amount} 
                onChange={onChange} 
                placeholder="0" 
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <label className="text-sm block" style={{ color: '#E7F2EF' }}>Note</label>
              <input 
                className="input w-full text-base sm:text-sm py-2.5 sm:py-2" 
                name="note" 
                value={form.note} 
                onChange={onChange} 
              />
            </div>
            {error && <p className="col-span-2 text-sm text-[#E7F2EF] mt-1">{error}</p>}
            <div className="col-span-2">
              <button className="btn btn-primary w-full sm:w-auto text-base sm:text-sm py-2.5 sm:py-2">Add Transaction</button>
            </div>
          </form>
        </div>

        <div className="card p-4 sm:p-6">
          <h2 className="text-lg font-medium mb-3 sm:mb-4" style={{ color: '#E7F2EF' }}>Summary</h2>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <Stat label="Income" value={summary.income} color="text-[#E7F2EF]" />
            <Stat label="Expense" value={summary.expense} color="text-[#E7F2EF]" />
            <Stat label="Balance" value={summary.balance} color="text-[#E7F2EF]" />
          </div>

          <div className="mt-5 sm:mt-6 space-y-2 sm:space-y-3">
            {Object.keys(byCategory).length === 0 && (
              <p className="text-sm sm:text-base" style={{ color: '#E7F2EF', opacity: 0.8 }}>No expenses yet.</p>
            )}
            {Object.entries(byCategory).map(([cat, amt]) => (
              <Bar key={cat} label={cat} value={amt} max={Math.max(...Object.values(byCategory)) || 1} />
            ))}
          </div>
        </div>
      </div>

      <div className="card p-4 sm:p-6">
        <h2 className="text-lg font-medium mb-3 sm:mb-4" style={{ color: '#E7F2EF' }}>Transactions</h2>
        {loading ? (
          <p className="text-sm sm:text-base" style={{ color: '#E7F2EF', opacity: 0.8 }}>Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm sm:text-base" style={{ color: '#E7F2EF', opacity: 0.8 }}>No transactions yet.</p>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(237, 232, 245, 0.2)' }}>
            {items.map((t) => (
              <div key={t._id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:py-2 gap-2 sm:gap-3">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className={`text-xs sm:text-sm ${t.type==='income'?'text-[#E7F2EF]':'text-[#E7F2EF]'}`}>{t.type}</span>
                  <span className="text-xs sm:text-sm" style={{ color: '#E7F2EF', opacity: 0.7 }}>{t.category}</span>
                  {t.note && (
                    <>
                      <span className="hidden sm:inline text-xs sm:text-sm" style={{ color: '#E7F2EF', opacity: 0.7 }}>•</span>
                      <span className="text-xs sm:text-sm" style={{ color: '#E7F2EF', opacity: 0.7 }}>{t.note}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 sm:gap-3">
                  <span className="font-medium text-base sm:text-base" style={{ color: '#E7F2EF' }}>{t.amount.toFixed(2)}</span>
                  <button 
                    className="btn btn-danger text-xs px-3 py-1.5 sm:py-1 w-24 sm:w-auto" 
                    onClick={() => remove(t._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div>
      <div className="text-xs sm:text-sm mb-0.5 sm:mb-1" style={{ color: '#E7F2EF', opacity: 0.7 }}>{label}</div>
      <div className={`text-lg sm:text-xl font-semibold ${color}`}>{value.toFixed(2)}</div>
    </div>
  )
}

function Bar({ label, value, max }) {
  const width = Math.round((value / max) * 100)
  return (
    <div>
      <div className="flex justify-between text-xs sm:text-sm mb-1">
        <span className="font-medium" style={{ color: '#F5EFE6' }}>{label}</span>
        <span style={{ color: '#F5EFE6' }}>{value.toFixed(2)}</span>
      </div>
      <div className="h-1.5 sm:h-2 rounded-sm sm:rounded" style={{ backgroundColor: '#19183B' }}>
        <div className="h-1.5 sm:h-2 rounded-sm sm:rounded" style={{ backgroundColor: '#6D94C5', width: `${width}%` }} />
      </div>
    </div>
  )
}

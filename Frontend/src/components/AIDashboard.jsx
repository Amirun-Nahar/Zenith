import { useState, useEffect } from 'react'
import VoiceNotes from './VoiceNotes'
import { api } from '../lib/api'

export default function AIDashboard() {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('study')

  useEffect(() => {
    fetchInsights()
  }, [])

  async function fetchInsights() {
    try {
      const studyData = await api.get('/api/ai/study-recommendations')
      setInsights({
        study: studyData.recommendations || []
      })
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 card animate-pulse" />
        <div className="h-32 card animate-pulse" />
        <div className="h-32 card animate-pulse" />
      </div>
    )
  }

  const tabs = [
    { id: 'study', label: 'Study Insights', icon: '📚' },
    { id: 'budget', label: 'Budget AI', icon: '💰' },
    { id: 'schedule', label: 'Smart Schedule', icon: '⏰' },
    { id: 'chat', label: 'AI Study Buddy', icon: '🤖' },
    { id: 'voice', label: 'Voice Notes', icon: '🎤' }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#f8f7e5' }}>AI-Powered Insights</h1>
        <p style={{ color: '#f8f7e5', opacity: 0.8 }}>Your personal AI assistant for academic success</p>
      </div>

      {/* Tab Navigation */}
      <div className="card p-1">
        {/* Mobile Tab Navigation */}
        <div className="flex md:hidden overflow-x-auto space-x-1 p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                activeTab === tab.id
                  ? 'bg-[#63786b] text-[#f8f7e5] border-[#63786b] shadow-lg'
                  : 'bg-transparent text-[#f8f7e5] border-transparent hover:bg-[#63786b]/20 hover:border-[#63786b]/30 hover:shadow-md'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden md:flex space-x-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                activeTab === tab.id
                  ? 'bg-[#63786b] text-[#f8f7e5] border-[#63786b] shadow-lg'
                  : 'bg-transparent text-[#f8f7e5] border-transparent hover:bg-[#63786b]/20 hover:border-[#63786b]/30 hover:shadow-md'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'study' && (
          <StudyInsights insights={insights.study || []} />
        )}
        {activeTab === 'budget' && (
          <BudgetInsights />
        )}
        {activeTab === 'schedule' && (
          <SmartSchedule />
        )}
        {activeTab === 'chat' && (
          <AIStudyBuddy />
        )}
        {activeTab === 'voice' && (
          <VoiceNotes />
        )}
      </div>
    </div>
  )
}

function StudyInsights({ insights }) {
  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4" style={{ color: '#f8f7e5' }}>📊 Study Performance Analysis</h3>
        {insights.length > 0 ? (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.priority === 'high' ? 'border-red-400' :
                  insight.priority === 'medium' ? 'border-yellow-400' :
                  'border-emerald-400'
                }`}
                style={{ backgroundColor: 'rgba(248, 247, 229, 0.1)' }}
              >
                <p className="mb-2" style={{ color: '#f8f7e5' }}>{insight.message}</p>
                <p className="text-sm" style={{ color: '#f8f7e5', opacity: 0.8 }}>{insight.action}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#f8f7e5', opacity: 0.8 }}>Complete some tasks to get personalized study insights!</p>
        )}
      </div>
    </div>
  )
}

function BudgetInsights() {
  const [insights, setInsights] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBudgetData()
  }, [])

  async function fetchBudgetData() {
    try {
      setLoading(true)
      setError('')
      
      // Fetch transactions from budget tracker
      const transactions = await api.get('/api/transactions')
      
      // Calculate summary
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0
      
      // Get unique categories
      const categories = [...new Set(transactions.map(t => t.category))]
      
      setSummary({
        totalIncome,
        totalExpense,
        savingsRate,
        transactionCount: transactions.length,
        categoryCount: categories.length
      })
      
      // Generate AI insights based on the data
      const aiInsights = generateBudgetInsights(transactions, totalIncome, totalExpense)
      setInsights(aiInsights)
    } catch (error) {
      setError('Network error while fetching budget data')
    } finally {
      setLoading(false)
    }
  }

  function generateBudgetInsights(transactions, totalIncome, totalExpense) {
    const insights = []
    
    if (transactions.length === 0) {
      insights.push({
        type: 'info',
        message: 'No financial data found yet.',
        recommendation: 'Start tracking your income and expenses to get personalized insights'
      })
      return insights
    }

    // Category spending analysis
    const categorySpending = {}
    transactions.forEach(t => {
      if (t.type === 'expense') {
        if (!categorySpending[t.category]) categorySpending[t.category] = 0
        categorySpending[t.category] += t.amount
      }
    })

    if (Object.keys(categorySpending).length > 0) {
      const topCategory = Object.entries(categorySpending)
        .sort(([,a], [,b]) => b - a)[0]
      
      if (topCategory) {
        const percentage = ((topCategory[1] / totalExpense) * 100).toFixed(1)
        insights.push({
          type: percentage > 40 ? 'warning' : percentage > 25 ? 'caution' : 'success',
          message: `${topCategory[0]} accounts for ${percentage}% of your expenses.`,
          recommendation: percentage > 40 ? 'Consider setting spending limits for this category' : 
                        percentage > 25 ? 'Monitor this category to ensure it stays within reasonable limits' : 
                        'Good balance in this category'
        })
      }

      // Category diversity
      const categoryCount = Object.keys(categorySpending).length
      if (categoryCount < 3) {
        insights.push({
          type: 'diversity',
          message: `You're tracking expenses in only ${categoryCount} categories.`,
          recommendation: 'Consider adding more categories to better understand your spending patterns'
        })
      }
    }

    // Income vs Expense analysis
    if (totalIncome > 0) {
      const expenseRatio = (totalExpense / totalIncome * 100).toFixed(1)
      if (expenseRatio > 90) {
        insights.push({
          type: 'danger',
          message: `Your expenses are ${expenseRatio}% of your income.`,
          recommendation: 'Immediate action needed: reduce expenses or increase income to build savings'
        })
      } else if (expenseRatio > 80) {
        insights.push({
          type: 'warning',
          message: `Your expenses are ${expenseRatio}% of your income.`,
          recommendation: 'Try to reduce expenses or increase income to build savings'
        })
      } else if (expenseRatio > 70) {
        insights.push({
          type: 'caution',
          message: `Your expenses are ${expenseRatio}% of your income.`,
          recommendation: 'Good control, but aim to keep expenses under 70% for better financial health'
        })
      } else {
        insights.push({
          type: 'success',
          message: `Your expenses are ${expenseRatio}% of your income.`,
          recommendation: 'Excellent financial management! You\'re living well within your means'
        })
      }
    }

    // Savings analysis
    if (totalIncome > 0) {
      const savingsRate = ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1)
      if (savingsRate < 0) {
        insights.push({
          type: 'danger',
          message: `You're spending ${Math.abs(savingsRate)}% more than you earn.`,
          recommendation: 'Immediate action needed: reduce expenses or find additional income sources'
        })
      } else if (savingsRate < 10) {
        insights.push({
          type: 'warning',
          message: `Your savings rate is ${savingsRate}%.`,
          recommendation: 'Aim for at least 10% savings rate for financial security'
        })
      } else if (savingsRate < 20) {
        insights.push({
          type: 'caution',
          message: `Your savings rate is ${savingsRate}%.`,
          recommendation: 'Good progress! Aim for 20% savings rate for better financial freedom'
        })
      } else {
        insights.push({
          type: 'success',
          message: `Your savings rate is ${savingsRate}%.`,
          recommendation: 'Outstanding! You\'re building excellent financial security'
        })
      }
    }

    // Spending patterns
    if (transactions.filter(t => t.type === 'expense').length > 0) {
      const monthlyExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      
      if (monthlyExpenses > 0) {
        insights.push({
          type: 'pattern',
          message: `You've tracked $${monthlyExpenses.toFixed(2)} in expenses this month.`,
          recommendation: 'Great job tracking! Consider setting monthly spending goals for each category'
        })
      }
    }

    // Goal setting
    if (totalIncome > 0 && totalExpense > 0) {
      const monthlySavings = totalIncome - totalExpense
      if (monthlySavings > 0) {
        insights.push({
          type: 'goal',
          message: `You're saving $${monthlySavings.toFixed(2)} monthly.`,
          recommendation: 'Consider setting specific savings goals and automating transfers'
        })
      }
    }

    return insights
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 card animate-pulse" />
          ))}
        </div>
        <div className="card p-6">
          <div className="h-32 card animate-pulse" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="card p-6 border border-red-500/30">
          <h3 className="text-xl font-semibold text-red-600 mb-4">❌ Error Loading Budget Data</h3>
                            <p className="mb-4" style={{ color: '#f8f7e5', opacity: 0.8 }}>{error}</p>
          <button 
            onClick={fetchBudgetData}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
              <div
                className="card p-3 md:p-4 text-center"
              >
            <p className="text-lg md:text-2xl font-bold" style={{ color: '#f8f7e5' }}>${summary.totalIncome}</p>
            <p className="text-[10px] md:text-xs" style={{ color: '#f8f7e5', opacity: 0.7 }}>Income</p>
          </div>
          <div
            className="card p-3 md:p-4 text-center"
          >
            <p className="text-lg md:text-2xl font-bold" style={{ color: '#f8f7e5' }}>${summary.totalExpense}</p>
            <p className="text-[10px] md:text-xs" style={{ color: '#f8f7e5', opacity: 0.7 }}>Expenses</p>
          </div>
          <div
            className="card p-3 md:p-4 text-center"
          >
            <p className="text-lg md:text-2xl font-bold" style={{ color: '#f8f7e5' }}>{summary.savingsRate}%</p>
            <p className="text-[10px] md:text-xs" style={{ color: '#f8f7e5', opacity: 0.7 }}>Savings</p>
          </div>
          <div
            className="card p-3 md:p-4 text-center"
          >
            <p className="text-lg md:text-2xl font-bold" style={{ color: '#f8f7e5' }}>{summary.transactionCount}</p>
            <p className="text-[10px] md:text-xs" style={{ color: '#f8f7e5', opacity: 0.7 }}>Transactions</p>
          </div>
          <div
            className="card p-3 md:p-4 text-center sm:col-span-1"
          >
            <p className="text-lg md:text-2xl font-bold" style={{ color: '#f8f7e5' }}>{summary.categoryCount}</p>
            <p className="text-[10px] md:text-xs" style={{ color: '#f8f7e5', opacity: 0.7 }}>Categories</p>
          </div>
        </div>
      )}
      
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4" style={{ color: '#f8f7e5' }}>💡 AI Budget Recommendations</h3>
        {insights.length > 0 ? (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'success' ? 'border-emerald-400' :
                  insight.type === 'warning' ? 'border-yellow-400' :
                  insight.type === 'danger' ? 'border-red-400' :
                  insight.type === 'caution' ? 'border-orange-400' :
                  insight.type === 'info' ? 'border-blue-400' :
                  insight.type === 'diversity' ? 'border-purple-400' :
                  insight.type === 'pattern' ? 'border-indigo-400' :
                  insight.type === 'goal' ? 'border-emerald-400' :
                  'border-gray-300'
                }`}
                style={{ backgroundColor: 'rgba(248, 247, 229, 0.1)' }}
              >
                <div className="flex items-start gap-3">
                  <span className={`text-lg ${
                    insight.type === 'success' ? 'text-green-600' :
                    insight.type === 'warning' ? 'text-yellow-600' :
                    insight.type === 'danger' ? 'text-red-600' :
                    insight.type === 'caution' ? 'text-orange-600' :
                    insight.type === 'info' ? 'text-blue-600' :
                    insight.type === 'diversity' ? 'text-purple-600' :
                    insight.type === 'pattern' ? 'text-indigo-600' :
                    insight.type === 'goal' ? 'text-emerald-600' :
                    'text-gray-400'
                  }`}>
                    {insight.type === 'success' ? '✅' :
                     insight.type === 'warning' ? '⚠️' :
                     insight.type === 'danger' ? '🚨' :
                     insight.type === 'caution' ? '⚠️' :
                     insight.type === 'info' ? 'ℹ️' :
                     insight.type === 'diversity' ? '📊' :
                     insight.type === 'pattern' ? '📈' :
                     insight.type === 'goal' ? '🎯' :
                     '💡'}
                  </span>
                  <div className="flex-1">
                    <p className="mb-2" style={{ color: '#f8f7e5' }}>{insight.message}</p>
                    <p className="text-sm" style={{ color: '#f8f7e5', opacity: 0.8 }}>{insight.recommendation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#f8f7e5', opacity: 0.8 }}>Add some transactions to get AI budget insights!</p>
        )}
      </div>
    </div>
  )
}

function SmartSchedule() {
  const [tasks, setTasks] = useState([])
  const [optimizedSchedule, setOptimizedSchedule] = useState(null)
  const [availableSlots, setAvailableSlots] = useState(0)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      const data = await api.get('/api/tasks')
      setTasks(data.filter(t => !t.completed))
    } catch (error) {
    }
  }

  async function optimizeSchedule() {
    if (tasks.length === 0) {
      alert('No tasks found. Please add some tasks first!')
      return
    }
    
    setLoading(true)
    try {
      const data = await api.post('/api/ai/optimize-schedule', { tasks, preferences: {} })
      setOptimizedSchedule(data.optimizedSchedule)
      setAvailableSlots(data.availableSlots || 0)
      setRecommendations(data.recommendations || [])
    } catch (error) {
      alert('Network error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4" style={{ color: '#f8f7e5' }}>⏰ AI Planner Optimization</h3>
        
        <div className="mb-4 space-y-2">
          <button
            onClick={optimizeSchedule}
            disabled={loading || tasks.length === 0}
            className="btn btn-primary"
          >
            {loading ? 'Optimizing...' : 'Optimize My Planner'}
          </button>
          
          <div className="text-sm" style={{ color: '#f8f7e5', opacity: 0.8 }}>
            <p>📋 Found {tasks.length} incomplete tasks</p>
            <p>🔄 {loading ? 'Processing...' : 'Ready to optimize'}</p>
          </div>
        </div>

        {tasks.length === 0 && (
          <div className="card p-4 border border-yellow-500/30">
            <p className="text-yellow-600 text-sm font-medium">⚠️ No tasks found</p>
            <p className="text-xs mt-1" style={{ color: '#f8f7e5', opacity: 0.7 }}>
              Go to the Planner page and create some tasks first, then come back to optimize your schedule!
            </p>
          </div>
        )}

        {optimizedSchedule && (
          <div className="space-y-4">
            <div className="card p-4 border border-green-500/30">
              <p className="text-green-700 text-sm font-medium">✨ AI has optimized your schedule!</p>
                          <p className="text-xs mt-1" style={{ color: '#f8f7e5', opacity: 0.7 }}>
              {availableSlots} available time slots • {optimizedSchedule.length} tasks scheduled
            </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {optimizedSchedule.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  item.priority === 'high' ? 'border-red-500' :
                  item.priority === 'medium' ? 'border-yellow-500' :
                  'border-green-500'
                }`}
                style={{ backgroundColor: 'rgba(248, 247, 229, 0.1)' }}
              >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold" style={{ color: '#f8f7e5' }}>{item.task}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      item.priority === 'high' ? 'text-red-800' :
                      item.priority === 'medium' ? 'text-orange-700' :
                      'text-emerald-700'
                    }`}
                    style={{ backgroundColor: 'rgba(248, 247, 229, 0.1)' }}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: '#f8f7e5', opacity: 0.8 }}>{item.subject}</p>
                  <div className="space-y-1 text-xs" style={{ color: '#f8f7e5', opacity: 0.7 }}>
                    <p>📅 {item.dayName} at {item.hour}:00</p>
                    <p>⏱️ {item.estimatedDuration}</p>
                    <p>⏰ Due: {new Date(item.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {recommendations && recommendations.length > 0 && (
              <div className="card p-4 border border-blue-500/30">
                <h4 className="text-blue-700 text-sm font-medium mb-2">💡 AI Recommendations</h4>
                <ul className="space-y-1">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="text-xs" style={{ color: '#f8f7e5', opacity: 0.7 }}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function AIStudyBuddy() {
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    if (!message.trim()) return
    
    const userMessage = { type: 'user', text: message, timestamp: new Date() }
    setChatHistory(prev => [...prev, userMessage])
    setMessage('')
    setLoading(true)

    try {
      const data = await api.post('/api/ai/chat', { message, context: 'study' })
      const aiMessage = { 
        type: 'ai', 
        text: data.response, 
        timestamp: new Date(),
        suggestions: data.suggestions,
        isAI: data.isAI
      }
      setChatHistory(prev => [...prev, aiMessage])
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4" style={{ color: '#f8f7e5' }}>🤖 AI Study Buddy</h3>
        
        {/* Chat History */}
        <div className="h-[50vh] md:h-64 overflow-y-auto mb-4 space-y-3 px-2">
          {chatHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="mb-2 text-sm md:text-base" style={{ color: '#f8f7e5', opacity: 0.8 }}>Ask me anything about studying, scheduling, or budgeting!</p>
              <p className="text-[10px] md:text-xs" style={{ color: '#f8f7e5' }}>🤖 Powered by Gemini AI</p>
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-xs p-3 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'card'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm break-words" style={{ color: '#f8f7e5' }}>{msg.text}</p>
                    {msg.isAI && (
                      <span className="text-[10px] md:text-xs text-green-600 flex-shrink-0">🤖 AI</span>
                    )}
                  </div>
                  {msg.suggestions && (
                    <div className="mt-2 space-y-1">
                      {msg.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => setMessage(suggestion)}
                          className="block text-[10px] md:text-xs text-blue-600 hover:text-blue-500 text-left"
                        >
                          💡 {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="card p-3" style={{ color: '#f8f7e5' }}>
                <p className="text-sm">🤔 Thinking...</p>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 input"
            style={{ color: '#f8f7e5' }}
            placeholder="Ask your AI study buddy..."
          />
          <button
            onClick={sendMessage}
            disabled={loading || !message.trim()}
            className="btn btn-primary w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Send</span>
            <span className="sm:hidden">Send Message</span>
          </button>
        </div>
      </div>
    </div>
  )
}

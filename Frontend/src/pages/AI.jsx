import AIDashboard from '../components/AIDashboard'

export default function AI() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold" style={{ color: '#E43D12' }}>AI Assistant</h1>
      </div>
      <AIDashboard />
    </div>
  )
} 
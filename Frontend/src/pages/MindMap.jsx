import AutoMindMap from '../components/AutoMindMap';

export default function MindMap() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold" style={{ color: '#E43D12' }}>AI Mind Map</h1>
      
      <div className="card p-4 sm:p-6">
        <h2 className="text-lg font-medium mb-3 sm:mb-4" style={{ color: '#E43D12' }}>Generate Mind Map</h2>
        <p className="text-xs sm:text-sm mb-4" style={{ color: '#E43D12', opacity: 0.8 }}>
          Enter any topic and our AI will generate a comprehensive mind map to help you understand the concepts better.
        </p>
        <AutoMindMap />
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react'
import { api } from '../lib/api'


export default function QA() {
  const [mode, setMode] = useState('flashcards') // 'flashcards' or 'quiz'
  const [topic, setTopic] = useState('')
  const [notes, setNotes] = useState('')
  const [count, setCount] = useState(6)
  const [difficulty, setDifficulty] = useState('medium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cards, setCards] = useState([])
  const [quiz, setQuiz] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  async function generate() {
    setLoading(true); setError(''); setCards([]); setQuiz([])
    
    // Test server connectivity first
    try {
      await api.get('/api/ai/mindmap/test')
    } catch (testError) {
      setError(`Cannot connect to server: ${testError.message}`)
      setLoading(false)
      return
    }
    
    try {
      if (mode === 'flashcards') {
        const res = await api.post('/api/ai/flashcards', { topic, text: notes, count, difficulty })
        setCards(res.flashcards || [])
      } else {
        const res = await api.post('/api/ai/quiz', { topic, text: notes, count, difficulty })
        setQuiz(res.quiz || [])
        setCurrentQuestion(0)
        setSelectedAnswer('')
        setShowResult(false)
        setScore(0)
      }
    } catch (e) {
      setError(e.message || 'Failed to generate')
    } finally {
      setLoading(false)
    }
  }

  function handleAnswerSelect(answer) {
    setSelectedAnswer(answer)
    setShowResult(true)
    if (answer === quiz[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  function nextQuestion() {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer('')
      setShowResult(false)
    }
  }

  function resetQuiz() {
    setQuiz([])
    setCurrentQuestion(0)
    setSelectedAnswer('')
    setShowResult(false)
    setScore(0)
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="card p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4" style={{ color: '#E43D12' }}>AI Study Assistant</h1>
        
        {/* Mode Selector */}
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1 mb-4 sm:mb-6">
          <button
            onClick={() => setMode('flashcards')}
            className={`flex-1 py-2 px-3 sm:px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === 'flashcards'
                ? 'bg-[#EFB11D] text-[#EBE9E1] shadow-lg'
                : 'bg-transparent text-[#E43D12] hover:bg-[#EFB11D]/20'
            }`}
          >
            📚 Flashcards
          </button>
          <button
            onClick={() => setMode('quiz')}
            className={`flex-1 py-2 px-3 sm:px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === 'quiz'
                ? 'bg-[#EFB11D] text-[#EBE9E1] shadow-lg'
                : 'bg-transparent text-[#E43D12] hover:bg-[#EFB11D]/20'
            }`}
          >
            🧠 Quiz
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4">
            <input 
              className="input text-base sm:text-sm py-2.5 sm:py-2" 
              placeholder="Topic (e.g., Photosynthesis)" 
              value={topic} 
              onChange={(e)=>setTopic(e.target.value)} 
            />
            <textarea 
              className="input min-h-24 sm:min-h-32 text-base sm:text-sm py-2.5 sm:py-2" 
              placeholder="Paste notes or key points (optional)" 
              value={notes} 
              onChange={(e)=>setNotes(e.target.value)} 
            />
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div>
                <label className="text-sm block mb-1" style={{ color: '#E43D12', opacity: 0.7 }}>Count</label>
                <input 
                  className="input text-base sm:text-sm py-2.5 sm:py-2" 
                  type="number" 
                  min={2} 
                  max={20} 
                  value={count} 
                  onChange={(e)=>setCount(Number(e.target.value))} 
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm block mb-1" style={{ color: '#E43D12', opacity: 0.7 }}>Difficulty</label>
                <select 
                  className="input text-base sm:text-sm py-2.5 sm:py-2" 
                  value={difficulty} 
                  onChange={(e)=>setDifficulty(e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <button 
              disabled={loading} 
              onClick={generate} 
              className="btn btn-primary w-full py-2.5 sm:py-2 text-base sm:text-sm"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#E43D12] border-t-transparent mr-2"></div>
                  <span>Thinking...</span>
                </div>
              ) : mode === 'flashcards' ? 'Generate Flashcards' : 'Generate Quiz'}
            </button>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>
          <div className="space-y-3 sm:space-y-4">
            {loading ? (
              <div className="card p-6 sm:p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-10 sm:h-12 w-10 sm:w-12 border-4 border-[#EFB11D] border-t-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-xl sm:text-2xl">🧠</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2" style={{ color: '#E43D12' }}>
                      AI is thinking...
                    </h3>
                    <p className="text-sm" style={{ color: '#E43D12', opacity: 0.7 }}>
                      {mode === 'flashcards' 
                        ? 'Generating personalized flashcards for your topic' 
                        : 'Creating an interactive quiz to test your knowledge'
                      }
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#EFB11D] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#EFB11D] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-[#EFB11D] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            ) : mode === 'flashcards' ? (
              cards.length === 0 ? (
                <p className="text-sm sm:text-base" style={{ color: '#E43D12', opacity: 0.8 }}>Generated flashcards will appear here.</p>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:gap-3">
                  {cards.map((c, i) => (
                    <div key={i} className="rounded-xl border p-3 sm:p-4" style={{ borderColor: '#EFB11D', backgroundColor: '#EBE9E1' }}>
                      <div className="font-medium text-base sm:text-base" style={{ color: '#E43D12' }}>Q{i+1}. {c.question}</div>
                      <div className="text-sm mt-1.5" style={{ color: '#E43D12', opacity: 0.8 }}>{c.answer}</div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              quiz.length === 0 ? (
                <p className="text-sm sm:text-base" style={{ color: '#E43D12', opacity: 0.8 }}>Generated quiz will appear here.</p>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {/* Quiz Progress */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: '#E43D12', opacity: 0.8 }}>
                      Question {currentQuestion + 1} of {quiz.length}
                    </span>
                    <span className="text-sm" style={{ color: '#E43D12', opacity: 0.8 }}>
                      Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
                    </span>
                  </div>

                  {/* Current Question */}
                  <div className="card p-3 sm:p-4">
                    <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-base" style={{ color: '#E43D12' }}>
                      {quiz[currentQuestion]?.question}
                    </h3>
                    
                    <div className="space-y-2">
                      {quiz[currentQuestion]?.options?.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => !showResult && handleAnswerSelect(option)}
                          disabled={showResult}
                          className={`w-full text-left p-2.5 sm:p-3 rounded-lg border transition-all duration-200 text-base sm:text-sm ${
                            showResult
                              ? option === quiz[currentQuestion].correctAnswer
                                ? 'border-green-500 bg-green-500/20 text-green-300'
                                : selectedAnswer === option
                                ? 'border-red-500 bg-red-500/20 text-red-300'
                                : 'border-gray-500 bg-gray-500/10 text-gray-400'
                              : 'border-gray-400 bg-gray-500/10 text-[#E43D12] hover:bg-gray-500/20 hover:border-gray-300'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>

                    {showResult && (
                      <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-lg" style={{ backgroundColor: '#EBE9E1' }}>
                        <p className="text-sm" style={{ color: '#E43D12', opacity: 0.8 }}>
                          {selectedAnswer === quiz[currentQuestion].correctAnswer ? '✅ Correct!' : '❌ Incorrect. The correct answer is: ' + quiz[currentQuestion].correctAnswer}
                        </p>
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 mt-3 sm:mt-4">
                      <button
                        onClick={resetQuiz}
                        className="btn w-full sm:w-auto py-2.5 sm:py-2 text-base sm:text-sm"
                      >
                        Reset Quiz
                      </button>
                      {currentQuestion < quiz.length - 1 ? (
                        <button
                          onClick={nextQuestion}
                          disabled={!showResult}
                          className="btn btn-primary w-full sm:w-auto py-2.5 sm:py-2 text-base sm:text-sm"
                        >
                          Next Question
                        </button>
                      ) : showResult ? (
                        <div className="text-center w-full sm:w-auto">
                          <p className="text-base sm:text-lg font-semibold mb-2" style={{ color: '#E43D12' }}>
                            Quiz Complete! Final Score: {score}/{quiz.length}
                          </p>
                          <button
                            onClick={resetQuiz}
                            className="btn btn-primary w-full sm:w-auto py-2.5 sm:py-2 text-base sm:text-sm"
                          >
                            Take Again
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

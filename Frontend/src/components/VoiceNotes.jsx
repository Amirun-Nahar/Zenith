import { useState, useRef } from 'react'

export default function VoiceNotes() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [notes, setNotes] = useState([])
  const [currentNote, setCurrentNote] = useState('')
  const recognitionRef = useRef(null)

  const startRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'
      
      recognitionRef.current.onstart = () => {
        setIsRecording(true)
        setTranscript('')
      }
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        setTranscript(finalTranscript)
      }
      
      recognitionRef.current.onerror = (event) => {
        setIsRecording(false)
      }
      
      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }
      
      recognitionRef.current.start()
    } else {
      alert('Speech recognition not supported in this browser')
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const saveNote = () => {
    if (transcript.trim()) {
      const newNote = {
        id: Date.now(),
        text: transcript,
        timestamp: new Date().toLocaleString(),
        subject: currentNote || 'General'
      }
      setNotes(prev => [newNote, ...prev])
      setTranscript('')
      setCurrentNote('')
    }
  }

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id))
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: '#E43D12' }}>🎤 Voice Study Notes</h2>
        <p className="text-sm sm:text-base" style={{ color: '#E43D12', opacity: 0.8 }}>Speak your thoughts and capture them instantly</p>
      </div>

      {/* Recording Controls */}
      <div className="card p-4 sm:p-6 border border-green-500/30">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-full sm:w-auto px-4 sm:px-6 py-3 rounded-full font-medium transition-all ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isRecording ? '🛑 Stop Recording' : '🎤 Start Recording'}
          </button>
        </div>

        {/* Subject Input */}
        <div className="mb-4">
          <input
            type="text"
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="Subject/Topic (optional)"
            className="input w-full text-sm sm:text-base"
            style={{ color: '#E43D12' }}
          />
        </div>

        {/* Live Transcript */}
        {isRecording && (
          <div className="mb-4 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-xs sm:text-sm mb-2" style={{ color: '#E43D12', opacity: 0.7 }}>Live transcript:</p>
            <p className="text-sm sm:text-base" style={{ color: '#E43D12' }}>{transcript || 'Listening...'}</p>
          </div>
        )}

        {/* Save Button */}
        {transcript && (
          <div className="text-center">
            <button
              onClick={saveNote}
              className="w-full sm:w-auto btn btn-primary text-sm sm:text-base"
            >
              💾 Save Note
            </button>
          </div>
        )}
      </div>

      {/* Saved Notes */}
      <div className="card p-4 sm:p-6 border border-purple-500/30">
        <h3 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: '#E43D12' }}>📝 Saved Notes</h3>
        
        {notes.length === 0 ? (
          <p className="text-center py-6 sm:py-8 text-sm sm:text-base" style={{ color: '#E43D12', opacity: 0.7 }}>
            No notes yet. Start recording to capture your thoughts!
          </p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-0 mb-2">
                  <span className="text-xs text-blue-600 bg-blue-400/10 px-2 py-1 rounded inline-block">
                    {note.subject}
                  </span>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-sm px-2 py-1 rounded border transition-all duration-200 hover:bg-red-500/20 sm:ml-2"
                    style={{ color: '#dc2626', borderColor: 'rgba(220, 38, 38, 0.3)' }}
                  >
                    🗑️ Delete
                  </button>
                </div>
                <p className="mb-2 text-sm sm:text-base" style={{ color: '#E43D12' }}>{note.text}</p>
                <p className="text-xs" style={{ color: '#E43D12', opacity: 0.7 }}>{note.timestamp}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 
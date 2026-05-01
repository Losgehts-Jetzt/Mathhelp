import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LangToggle } from '../components/LangToggle'
import { Celebration } from '../components/math/Celebration'
import { DrawingCanvas } from '../components/math/DrawingCanvas'
import type { Lang, AnswerState } from '../types'

const WORKER_URL = 'https://mathhelp-api.chbalak.workers.dev'

interface AIProblem {
  question: string
  answer: number
  hint: string
}

type Phase = 'upload' | 'loading' | 'solving' | 'results'

const t = (lang: Lang, de: string, en: string) => (lang === 'de' ? de : en)

// ── Number Pad ────────────────────────────────────────────────────────────────

function NumberPad({
  disabled, onDigit, onBackspace, onClear,
}: {
  disabled: boolean
  onDigit: (d: string) => void
  onBackspace: () => void
  onClear: () => void
}) {
  const cls =
    'min-h-[60px] rounded-2xl bg-white text-2xl font-bold text-indigo-700 border-2 border-indigo-200 active:scale-95 transition-transform disabled:opacity-40'
  return (
    <div className="grid grid-cols-3 gap-2 w-full">
      {['7', '8', '9', '4', '5', '6', '1', '2', '3'].map(d => (
        <button key={d} disabled={disabled} onClick={() => onDigit(d)} className={cls}>{d}</button>
      ))}
      <button disabled={disabled} onClick={onClear} className={`${cls} text-lg text-gray-400`}>✕</button>
      <button disabled={disabled} onClick={() => onDigit('0')} className={cls}>0</button>
      <button disabled={disabled} onClick={onBackspace} className={`${cls} text-xl`}>⌫</button>
    </div>
  )
}

// ── AdvancedMathScreen ────────────────────────────────────────────────────────

export default function AdvancedMathScreen() {
  const navigate = useNavigate()
  const [lang, setLang] = useState<Lang>('de')
  const [phase, setPhase] = useState<Phase>('upload')

  // Upload
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageMime, setImageMime] = useState<string>('image/jpeg')
  const [loadError, setLoadError] = useState('')

  // Problems
  const [problems, setProblems] = useState<AIProblem[]>([])
  const [patternDesc, setPatternDesc] = useState('')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)

  // Per-question
  const [inputValue, setInputValue] = useState('')
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [showHint, setShowHint] = useState(false)
  const [clearSignal, setClearSignal] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)

  // ── image selection ─────────────────────────────────────────────────────────

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    setImageMime(file.type)
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setPreviewUrl(dataUrl)
      // strip "data:image/jpeg;base64," prefix
      setImageBase64(dataUrl.split(',')[1])
      setLoadError('')
    }
    reader.readAsDataURL(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  // ── generate problems ───────────────────────────────────────────────────────

  const generate = async () => {
    if (!imageBase64) return
    setPhase('loading')
    setLoadError('')
    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64, mimeType: imageMime }),
      })
      if (!res.ok) throw new Error(`Worker error ${res.status}`)
      const data = await res.json() as { patternDescription: string; problems: AIProblem[] }
      setProblems(data.problems.slice(0, 5))
      setPatternDesc(data.patternDescription)
      setQuestionIndex(0)
      setScore(0)
      setInputValue('')
      setAnswerState('idle')
      setPhase('solving')
    } catch (err) {
      setLoadError(t(lang, 'Fehler beim Generieren. Bitte erneut versuchen.', 'Failed to generate. Please try again.'))
      setPhase('upload')
    }
  }

  // ── answer handling ─────────────────────────────────────────────────────────

  const onDigit = useCallback((d: string) => {
    if (answerState !== 'idle') return
    setInputValue(v => v.length < 4 ? v + d : v)
  }, [answerState])

  const onBackspace = useCallback(() => {
    if (answerState !== 'idle') return
    setInputValue(v => v.slice(0, -1))
  }, [answerState])

  const onClear = useCallback(() => {
    if (answerState !== 'idle') return
    setInputValue('')
    setClearSignal(s => s + 1)
  }, [answerState])

  const checkAnswer = () => {
    const current = problems[questionIndex]
    if (!inputValue || !current) return
    const correct = parseInt(inputValue, 10) === current.answer
    setAnswerState(correct ? 'correct' : 'wrong')
    if (correct) setShowCelebration(true)
  }

  const advance = useCallback((wasCorrect: boolean) => {
    const nextScore = score + (wasCorrect ? 1 : 0)
    const nextIndex = questionIndex + 1
    if (nextIndex >= problems.length) {
      setScore(nextScore)
      setPhase('results')
    } else {
      setScore(nextScore)
      setQuestionIndex(nextIndex)
      setInputValue('')
      setAnswerState('idle')
      setShowHint(false)
      setClearSignal(s => s + 1)
    }
  }, [score, questionIndex, problems.length])

  const onCelebrationDone = useCallback(() => {
    setShowCelebration(false)
    advance(true)
  }, [advance])

  const handleWrongNext = () => {
    advance(false)
  }

  // ── restart ─────────────────────────────────────────────────────────────────

  const resetToUpload = () => {
    setPhase('upload')
    setPreviewUrl(null)
    setImageBase64(null)
    setProblems([])
    setQuestionIndex(0)
    setScore(0)
    setInputValue('')
    setAnswerState('idle')
    setShowHint(false)
    setClearSignal(0)
  }

  const playAgain = async () => {
    if (!imageBase64) { resetToUpload(); return }
    setPhase('loading')
    setLoadError('')
    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64, mimeType: imageMime }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json() as { patternDescription: string; problems: AIProblem[] }
      setProblems(data.problems.slice(0, 5))
      setPatternDesc(data.patternDescription)
      setQuestionIndex(0)
      setScore(0)
      setInputValue('')
      setAnswerState('idle')
      setShowHint(false)
      setClearSignal(s => s + 1)
      setPhase('solving')
    } catch {
      setLoadError(t(lang, 'Fehler. Bitte erneut versuchen.', 'Error. Please try again.'))
      setPhase('upload')
    }
  }

  // ── score tier ──────────────────────────────────────────────────────────────

  const scoreTier = (s: number) => {
    if (s === 5) return { emoji: '🏆', label: t(lang, 'Perfekt!', 'Perfect!') }
    if (s >= 4) return { emoji: '⭐', label: t(lang, 'Super!', 'Super!') }
    if (s >= 3) return { emoji: '😊', label: t(lang, 'Gut!', 'Good!') }
    if (s >= 2) return { emoji: '💪', label: t(lang, 'Weiter üben!', 'Keep practising!') }
    return { emoji: '🌱', label: t(lang, 'Nicht aufgeben!', "Don't give up!") }
  }

  const current = problems[questionIndex]
  const inputDisplayClass = () => {
    if (answerState === 'correct') return 'border-green-400 text-green-600'
    if (answerState === 'wrong') return 'border-red-400 text-red-500'
    return inputValue ? 'border-indigo-400 text-indigo-700' : 'border-gray-300 text-gray-400'
  }

  return (
    <div className="min-h-svh bg-gradient-to-b from-orange-50 to-amber-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <button onClick={() => navigate('/math')} className="text-2xl">←</button>
        <h1 className="text-lg font-bold text-orange-700">
          {t(lang, 'Aufgaben', 'Advanced Problems')}
        </h1>
        <LangToggle lang={lang} onChange={setLang} />
      </div>

      <AnimatePresence mode="wait">

        {/* ── UPLOAD PHASE ── */}
        {phase === 'upload' && (
          <motion.div
            key="upload"
            className="flex flex-col flex-1 items-center justify-center px-6 gap-6"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          >
            <span className="text-6xl">📸</span>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-700">
                {t(lang, 'Aufgabe fotografieren', 'Photo of exercise')}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {t(lang, 'Mache ein Foto der Aufgabe oder wähle ein Bild aus.', 'Take a photo of the exercise or choose an image.')}
              </p>
            </div>

            {/* Image preview */}
            {previewUrl && (
              <motion.img
                src={previewUrl}
                alt="preview"
                className="w-full max-w-sm rounded-2xl shadow-lg object-contain max-h-56"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              />
            )}

            {/* Error */}
            {loadError && (
              <p className="text-sm text-red-500 text-center font-medium">{loadError}</p>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-3 w-full max-w-sm">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-2xl border-2 border-dashed border-orange-300 bg-white py-4 text-orange-600 font-semibold text-lg active:bg-orange-50"
              >
                {previewUrl
                  ? t(lang, 'Anderes Bild wählen', 'Choose different image')
                  : t(lang, 'Bild auswählen / Kamera', 'Choose image / Camera')}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileInput}
              />
              {previewUrl && (
                <button
                  onClick={generate}
                  className="w-full rounded-2xl bg-orange-500 text-white font-bold text-lg py-4 active:bg-orange-600"
                >
                  {t(lang, 'Aufgaben generieren ✨', 'Generate problems ✨')}
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ── LOADING PHASE ── */}
        {phase === 'loading' && (
          <motion.div
            key="loading"
            className="flex flex-col flex-1 items-center justify-center gap-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.span
              className="text-6xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            >
              🧠
            </motion.span>
            <p className="text-lg font-semibold text-gray-600">
              {t(lang, 'Claude analysiert die Aufgabe…', 'Claude is analysing the exercise…')}
            </p>
          </motion.div>
        )}

        {/* ── SOLVING PHASE ── */}
        {phase === 'solving' && current && (
          <motion.div
            key={`solving-${questionIndex}`}
            className="flex flex-col flex-1 min-h-0 px-5 pb-4 gap-3"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          >
            {/* Progress */}
            <div className="flex items-center justify-between text-sm text-gray-400 font-medium pt-1">
              <span>{t(lang, 'Frage', 'Question')} {questionIndex + 1} / {problems.length}</span>
              <span className="text-xs text-orange-400 italic">{patternDesc}</span>
            </div>

            {/* Question card */}
            <div className="bg-white rounded-3xl shadow px-5 py-4 flex flex-col gap-2">
              <p className="text-xl font-bold text-gray-800 text-center leading-snug">
                {current.question.replace('?', '')}
                <span className={`inline-block min-w-[56px] border-b-4 text-center mx-1 ${inputDisplayClass()}`}>
                  {inputValue || '   '}
                </span>
              </p>

              <AnimatePresence>
                {answerState === 'wrong' && (
                  <motion.p
                    className="text-sm text-red-500 font-semibold text-center"
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  >
                    {t(lang, `Falsch. Richtige Antwort: ${current.answer}`, `Wrong. Correct answer: ${current.answer}`)}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Hint */}
              <AnimatePresence>
                {showHint && (
                  <motion.p
                    className="text-sm text-indigo-500 text-center"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    💡 {current.hint}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Canvas */}
            <DrawingCanvas
              clearSignal={clearSignal}
              className="w-full h-[110px] rounded-2xl border-2 border-dashed border-orange-200 bg-white"
            />

            {/* Number pad + actions */}
            <div className="flex-1 flex flex-col gap-2 min-h-0">
              <NumberPad
                disabled={answerState !== 'idle'}
                onDigit={onDigit}
                onBackspace={onBackspace}
                onClear={onClear}
              />

              {answerState === 'idle' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowHint(h => !h)}
                    className="flex-1 min-h-[48px] rounded-2xl border-2 border-orange-200 bg-white text-orange-500 font-semibold text-sm active:bg-orange-50 flex-shrink-0"
                  >
                    💡 {t(lang, 'Tipp', 'Hint')}
                  </button>
                  <button
                    onClick={checkAnswer}
                    disabled={!inputValue}
                    className="flex-[2] min-h-[48px] rounded-2xl bg-orange-500 text-white font-bold text-lg active:bg-orange-600 disabled:opacity-40 flex-shrink-0"
                  >
                    {t(lang, 'Prüfen', 'Check')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={answerState === 'correct' ? undefined : handleWrongNext}
                  disabled={answerState === 'correct'}
                  className="w-full min-h-[48px] rounded-2xl bg-indigo-500 text-white font-bold text-lg active:bg-indigo-600 disabled:opacity-40 flex-shrink-0"
                >
                  {t(lang, 'Weiter →', 'Next →')}
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ── RESULTS PHASE ── */}
        {phase === 'results' && (
          <motion.div
            key="results"
            className="flex flex-col flex-1 items-center justify-center px-6 gap-6"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          >
            <span className="text-7xl">{scoreTier(score).emoji}</span>
            <div className="text-center">
              <p className="text-3xl font-extrabold text-gray-800">{scoreTier(score).label}</p>
              <p className="text-5xl font-black text-orange-500 mt-2">{score} / {problems.length}</p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-sm">
              <button
                onClick={playAgain}
                className="w-full rounded-2xl bg-orange-500 text-white font-bold text-xl py-4 active:bg-orange-600"
              >
                {t(lang, 'Nochmal 🔄', 'Again 🔄')}
              </button>
              <button
                onClick={resetToUpload}
                className="w-full rounded-2xl border-2 border-orange-300 bg-white text-orange-600 font-bold text-xl py-4 active:bg-orange-50"
              >
                {t(lang, 'Neue Aufgabe 📸', 'New exercise 📸')}
              </button>
              <button
                onClick={() => navigate('/math')}
                className="w-full rounded-2xl bg-gray-100 text-gray-500 font-semibold text-lg py-3 active:bg-gray-200"
              >
                {t(lang, 'Okay', 'Okay')}
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <Celebration visible={showCelebration} lang={lang} onDone={onCelebrationDone} />
    </div>
  )
}

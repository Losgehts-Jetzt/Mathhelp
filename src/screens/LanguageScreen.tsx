import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { spracheKlasse2Topics } from '../data/curriculum/spracheKlasse2'
import type { SpracheTopicConfig, SpracheQuestion } from '../data/curriculum/spracheKlasse2'

type Phase = 'select' | 'quiz' | 'results'

function tierInfo(score: number): { emoji: string; text: string } {
  if (score === 10) return { emoji: '🌟', text: 'Perfekt!' }
  if (score >= 8) return { emoji: '⭐', text: 'Super!' }
  if (score >= 6) return { emoji: '😊', text: 'Gut gemacht!' }
  return { emoji: '💪', text: 'Weiter üben!' }
}

export default function LanguageScreen() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('select')
  const [topic, setTopic] = useState<SpracheTopicConfig | null>(null)
  const [questions, setQuestions] = useState<SpracheQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)

  function startTopic(t: SpracheTopicConfig) {
    setTopic(t)
    setQuestions(t.generate())
    setIndex(0)
    setSelected(null)
    setScore(0)
    setPhase('quiz')
  }

  function handleAnswer(optionIndex: number) {
    if (selected !== null) return
    setSelected(optionIndex)
    if (optionIndex === questions[index].correct) setScore(s => s + 1)
    setTimeout(() => {
      const next = index + 1
      if (next >= questions.length) {
        setPhase('results')
      } else {
        setIndex(next)
        setSelected(null)
      }
    }, 900)
  }

  function handleNochmal() {
    if (!topic) return
    setQuestions(topic.generate())
    setIndex(0)
    setSelected(null)
    setScore(0)
    setPhase('quiz')
  }

  const q = questions[index]
  const tier = tierInfo(score)

  return (
    <div className="min-h-svh bg-gradient-to-b from-emerald-100 to-teal-100 flex flex-col">

      {/* ── Select Phase ─────────────────────────────────────────────────── */}
      {phase === 'select' && (
        <div className="flex flex-col flex-1 p-6 gap-5">
          <button
            onClick={() => navigate('/')}
            className="self-start text-teal-600 text-sm font-semibold px-4 py-2 rounded-full border-2 border-teal-300 bg-white active:bg-teal-50"
          >
            ← Zurück
          </button>

          <div className="text-center">
            <span className="text-5xl">✏️</span>
            <h1 className="text-3xl font-bold text-teal-700 mt-2">Sprache</h1>
            <p className="text-sm text-teal-600 mt-1">Wähle ein Thema</p>
          </div>

          <div className="flex flex-col gap-4">
            {spracheKlasse2Topics.map((t, i) => (
              <motion.button
                key={t.id}
                onClick={() => startTopic(t)}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.07, duration: 0.3 }}
                className={`w-full rounded-3xl bg-gradient-to-r ${t.from} ${t.to} ${t.shadow} shadow-lg text-white flex items-center gap-5 px-6 py-4 active:scale-95 transition-transform`}
              >
                <span className="text-4xl">{t.emoji}</span>
                <div className="text-left">
                  <p className="text-lg font-bold leading-tight">{t.label}</p>
                  <p className="text-xs opacity-80 mt-0.5">{t.sublabel}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* ── Quiz Phase ───────────────────────────────────────────────────── */}
      {phase === 'quiz' && topic && q && (
        <div className="flex flex-col flex-1 p-5 gap-4">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPhase('select')}
              className="text-teal-600 text-sm font-semibold px-4 py-2 rounded-full border-2 border-teal-300 bg-white active:bg-teal-50"
            >
              ← {topic.emoji} {topic.label}
            </button>
            <span className="text-sm font-bold text-teal-700 bg-white/70 px-3 py-1 rounded-full">
              {index + 1} / {questions.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/50 rounded-full h-2.5">
            <motion.div
              className={`h-2.5 rounded-full bg-gradient-to-r ${topic.from} ${topic.to}`}
              initial={false}
              animate={{ width: `${((index + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Question card + options */}
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col gap-4 flex-1"
            >
              {/* Question card */}
              <div className="bg-white rounded-3xl shadow-md px-6 py-5 text-center">
                <p className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                  {q.prompt}
                </p>
                {q.word ? (
                  <p className="text-2xl font-bold text-gray-800 leading-snug break-words">
                    {q.word}
                  </p>
                ) : null}
              </div>

              {/* Option buttons */}
              <div
                className={`grid gap-3 ${q.options.length === 4 ? 'grid-cols-2' : 'grid-cols-1'}`}
              >
                {q.options.map((opt, i) => {
                  const isCorrect = i === q.correct
                  const isSelected = i === selected
                  let cls = 'bg-white border-2 border-gray-200 text-gray-700'
                  if (selected !== null) {
                    if (isCorrect) cls = 'bg-green-500 border-2 border-green-600 text-white scale-100'
                    else if (isSelected) cls = 'bg-red-400 border-2 border-red-500 text-white'
                    else cls = 'bg-white/60 border-2 border-gray-100 text-gray-400'
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={selected !== null}
                      className={`${cls} rounded-2xl py-4 px-4 font-bold shadow-sm active:scale-95 transition-all min-h-[68px] ${q.options.length === 4 ? 'text-lg' : 'text-xl'}`}
                    >
                      {opt}
                      {selected !== null && isCorrect && ' ✓'}
                      {selected !== null && isSelected && !isCorrect && ' ✗'}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ── Results Phase ─────────────────────────────────────────────────── */}
      {phase === 'results' && topic && (
        <div className="flex flex-col flex-1 items-center justify-center p-8 gap-8">
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 11, stiffness: 120 }}
            className="text-center"
          >
            <span className="text-8xl">{tier.emoji}</span>
            <p className="text-3xl font-bold text-teal-700 mt-4">{tier.text}</p>
            <div className="mt-4 flex items-baseline justify-center gap-1">
              <span className="text-6xl font-bold text-teal-600">{score}</span>
              <span className="text-3xl text-gray-400 font-semibold">/ 10</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 w-full max-w-sm"
          >
            <button
              onClick={() => setPhase('select')}
              className="flex-1 bg-white border-2 border-teal-300 text-teal-700 font-bold text-lg py-4 rounded-2xl active:bg-teal-50 transition-colors"
            >
              Okay
            </button>
            <button
              onClick={handleNochmal}
              className={`flex-1 bg-gradient-to-r ${topic.from} ${topic.to} text-white font-bold text-lg py-4 rounded-2xl shadow-md active:scale-95 transition-transform`}
            >
              Nochmal
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

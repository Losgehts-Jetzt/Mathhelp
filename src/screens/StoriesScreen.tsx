import { useNavigate } from 'react-router-dom'

export default function StoriesScreen() {
  const navigate = useNavigate()
  return (
    <div className="min-h-svh bg-gradient-to-b from-orange-100 to-rose-100 flex flex-col items-center justify-center p-6 gap-6">
      <button onClick={() => navigate('/')} className="text-rose-500 text-lg font-semibold px-6 py-3 rounded-2xl border-2 border-rose-300 bg-white active:bg-rose-50">
        ← Zurück
      </button>
      <span className="text-7xl">📖</span>
      <h1 className="text-3xl font-bold text-rose-600">Geschichten</h1>
      <p className="text-gray-500">Hier kommen bald Geschichten!</p>
    </div>
  )
}

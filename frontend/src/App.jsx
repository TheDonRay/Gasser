import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import WeekGrid from './components/WeekGrid.jsx'
import LogPanel from './components/LogPanel.jsx'
import DailyBreakdown from './components/DailyBreakdown.jsx'
import AiInsights from './components/AiInsights.jsx'
import CarCard from './components/CarCard.jsx'
import { DAYS, summarize } from './stats.js'

const STORAGE_KEY = 'pumplog-v1'
const THEME_KEY = 'pumplog-theme'
// In production the frontend calls the Railway backend directly (set in .env.production).
// Locally this is empty, so requests go to /api and the Vite proxy forwards them.
const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
const BACKEND_DOWN = 'AI insights are unavailable right now. The server may be waking up, so try again in a moment.'

const emptyWeek = () => DAYS.map((day) => ({ day, gallons: 0, spent: 0, fillUps: 0 }))

// JS getDay() is Sunday=0; shift so Monday=0
const todayIndex = () => (new Date().getDay() + 6) % 7

const readStorage = (key) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Storage unavailable (private mode, etc.). The app still works for this session.
  }
}

const saved = (() => {
  try {
    return JSON.parse(readStorage(STORAGE_KEY)) ?? null
  } catch {
    return null
  }
})()

const App = () => {
  // Three click-count categories (assignment requirement #2)
  const [regular, setRegular] = useState(saved?.regular ?? 0)
  const [midgrade, setMidgrade] = useState(saved?.midgrade ?? 0)
  const [premium, setPremium] = useState(saved?.premium ?? 0)

  // Per-day gallons and dollars
  const [week, setWeek] = useState(saved?.week ?? emptyWeek())
  const [selectedDay, setSelectedDay] = useState(todayIndex())

  // UI state
  const [sortBy, setSortBy] = useState('week')
  const [dark, setDark] = useState(
    () => readStorage(THEME_KEY) === 'dark' ||
      (readStorage(THEME_KEY) === null &&
        window.matchMedia?.('(prefers-color-scheme: dark)').matches)
  )

  // AI request state
  const [question, setQuestion] = useState('')
  const [insight, setInsight] = useState('')
  const [aiStatus, setAiStatus] = useState('idle') // idle | loading | error | done
  const [aiError, setAiError] = useState('')

  useEffect(() => {
    writeStorage(STORAGE_KEY, JSON.stringify({ regular, midgrade, premium, week }))
  }, [regular, midgrade, premium, week])

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    writeStorage(THEME_KEY, dark ? 'dark' : 'light')
  }, [dark])

  // ---- Event handlers (live in the parent, passed down as props) ----

  const bumpSelectedDay = () =>
    setWeek((prev) =>
      prev.map((d, i) => (i === selectedDay ? { ...d, fillUps: d.fillUps + 1 } : d))
    )

  const logRegular = () => {
    setRegular(regular + 1)
    bumpSelectedDay()
  }

  const logMidgrade = () => {
    setMidgrade(midgrade + 1)
    bumpSelectedDay()
  }

  const logPremium = () => {
    setPremium(premium + 1)
    bumpSelectedDay()
  }

  const updateDay = (index, field, value) => {
    const num = value === '' ? 0 : Number(value)
    if (Number.isNaN(num) || num < 0) return
    setWeek((prev) => prev.map((d, i) => (i === index ? { ...d, [field]: num } : d)))
  }

  const selectDay = (index) => setSelectedDay(index)
  const toggleTheme = () => setDark(!dark)

  const resetWeek = () => {
    if (!window.confirm('Clear all fill-ups for this week?')) return
    setRegular(0)
    setMidgrade(0)
    setPremium(0)
    setWeek(emptyWeek())
    setInsight('')
    setAiStatus('idle')
  }

  const getInsights = async (q) => {
    setAiStatus('loading')
    setAiError('')
    try {
      const res = await fetch(`${API_BASE}/api/insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          week,
          grades: { regular, midgrade, premium },
          ...(q ? { question: q } : {}),
        }),
      })
      const data = await res.json().catch(() => ({}))
      // If the backend sent its own error message, show it; otherwise it's probably not running
      if (!res.ok || !data.insight) throw new Error(data.error || BACKEND_DOWN)
      setInsight(data.insight)
      setAiStatus('done')
      setQuestion('')
    } catch (err) {
      setAiError(err instanceof TypeError ? BACKEND_DOWN : err.message)
      setAiStatus('error')
    }
  }

  const totalFillUps = regular + midgrade + premium
  const summary = summarize(week)

  return (
    <div className="shell">
      <Sidebar dark={dark} toggleTheme={toggleTheme} />

      <main className="main">
        <Header totalFillUps={totalFillUps} summary={summary} />

        <div className="row row-top">
          <WeekGrid
            week={week}
            selectedDay={selectedDay}
            selectDay={selectDay}
            updateDay={updateDay}
            resetWeek={resetWeek}
          />
          <div className="side-stack">
            <CarCard summary={summary} />
            <AiInsights
              onAnalyze={getInsights}
              status={aiStatus}
              insight={insight}
              error={aiError}
              disabled={totalFillUps === 0}
              totalFillUps={totalFillUps}
              question={question}
              setQuestion={setQuestion}
            />
          </div>
        </div>

        <div className="row row-bottom">
          <LogPanel
            selectedDay={selectedDay}
            selectDay={selectDay}
            logRegular={logRegular}
            logMidgrade={logMidgrade}
            logPremium={logPremium}
            regular={regular}
            midgrade={midgrade}
            premium={premium}
            week={week}
          />
          <DailyBreakdown
            week={week}
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectDay={selectDay}
          />
        </div>
      </main>
    </div>
  )
}

export default App

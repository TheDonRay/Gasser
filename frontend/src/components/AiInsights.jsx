import Icon from './Icon.jsx'

// Presentational: the fetch and question text live in App
const AiInsights = ({
  onAnalyze, status, insight, error, disabled, totalFillUps,
  question, setQuestion,
}) => {
  const message =
    status === 'loading' ? 'Crunching this week’s numbers…'
    : disabled ? 'Log a fill-up and I’ll look at your week.'
    : `Ready to look at ${totalFillUps} fill-up${totalFillUps === 1 ? '' : 's'}.`

  const submit = (e) => {
    e.preventDefault()
    if (!disabled && status !== 'loading') onAnalyze(question.trim())
  }

  return (
    <section className="panel ai" id="ai">
      <h2 className="ai-title">AI pit stop</h2>
      <div className={`orb${status === 'loading' ? ' thinking' : ''}`} aria-hidden="true" />
      <p className="muted ai-status" aria-live="polite">{message}</p>

      <div className="ai-actions">
        <button
          type="button"
          className="pill-outline"
          onClick={() => onAnalyze('')}
          disabled={disabled || status === 'loading'}
        >
          <Icon name="sparkle" size={16} /> Summarize my week
        </button>
        <button
          type="button"
          className="pill-outline"
          onClick={() => onAnalyze('How can I spend less on gas next week?')}
          disabled={disabled || status === 'loading'}
        >
          <Icon name="chart" size={16} /> Saving tips
        </button>
      </div>

      <form className="ask" onSubmit={submit}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about your gas spending…"
          aria-label="Ask about your gas spending"
          disabled={disabled}
        />
        <button type="submit" aria-label="Ask" disabled={disabled || status === 'loading'}>
          <Icon name="arrow" />
        </button>
      </form>

      {status === 'error' && <p className="error">{error}</p>}
      {status === 'done' && <div className="insight">{insight}</div>}
    </section>
  )
}

export default AiInsights

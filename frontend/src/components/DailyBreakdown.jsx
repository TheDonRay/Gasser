import { DAY_NAMES, money, perGallon } from '../stats.js'

const SORTS = [
  { key: 'week', label: 'Week order' },
  { key: 'spent', label: 'Most spent' },
  { key: 'gallons', label: 'Most gallons' },
]

const DailyBreakdown = ({ week, sortBy, setSortBy, selectDay }) => {
  const rows = week
    .map((d, i) => ({ ...d, index: i }))
    .filter((d) => d.fillUps > 0 || d.spent > 0 || d.gallons > 0)

  if (sortBy !== 'week') rows.sort((a, b) => b[sortBy] - a[sortBy])

  return (
    <section className="panel" id="breakdown">
      <div className="panel-head">
        <h2 className="title-lg">Daily breakdown</h2>
        <div className="chips" role="group" aria-label="Sort">
          {SORTS.map((s) => (
            <button
              key={s.key}
              type="button"
              className={`chip${sortBy === s.key ? ' active' : ''}`}
              aria-pressed={sortBy === s.key}
              onClick={() => setSortBy(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="empty">Days you log will show up here.</p>
      ) : (
        <ul className="breakdown">
          {rows.map((d) => (
            <li key={d.day}>
              <button type="button" className="breakdown-item" onClick={() => selectDay(d.index)}>
                <span className="amount-box">
                  <small>$</small>
                  {d.spent.toFixed(0)}
                </span>
                <span className="breakdown-body">
                  <span className="breakdown-title">{DAY_NAMES[d.day]}</span>
                  <span className="muted small">
                    {d.gallons.toFixed(2)} gal at {perGallon(d.spent, d.gallons)}, {money(d.spent)} total
                  </span>
                  <span className="tags">
                    <span className="tag">
                      {d.fillUps} fill-up{d.fillUps === 1 ? '' : 's'}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default DailyBreakdown

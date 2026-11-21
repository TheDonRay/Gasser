import { DAY_NAMES, perGallon } from '../stats.js'

// Inputs are controlled by the parent's `week` state; edits go through updateDay
const DayCard = ({ data, index, selected, selectDay, updateDay }) => {
  const { day, gallons, spent, fillUps } = data
  const logged = fillUps > 0 || spent > 0

  return (
    <div
      className={`day-card${selected ? ' selected' : ''}`}
      onClick={() => selectDay(index)}
    >
      <div className="day-top">
        <button type="button" className="day-tile" aria-pressed={selected} aria-label={`Select ${DAY_NAMES[day]}`}>
          {day[0]}
        </button>
        <span className={`status${logged ? ' live' : ''}`}>{logged ? 'Logged' : 'Empty'}</span>
      </div>

      <div className="day-name">{DAY_NAMES[day]}</div>

      <div className="day-inputs">
        <label className="mini-field">
          <input
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={gallons || ''}
            placeholder="0"
            onChange={(e) => updateDay(index, 'gallons', e.target.value)}
          />
          <span>gal</span>
        </label>
        <label className="mini-field">
          <span>$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={spent || ''}
            placeholder="0.00"
            onChange={(e) => updateDay(index, 'spent', e.target.value)}
          />
        </label>
      </div>

      <div className="day-meta">
        {fillUps} fill-up{fillUps === 1 ? '' : 's'} · {perGallon(spent, gallons)}
      </div>
    </div>
  )
}

export default DayCard

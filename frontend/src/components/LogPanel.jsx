import Button from './Button.jsx'
import Statistics from './Statistics.jsx'
import { DAYS } from '../stats.js'

const LogPanel = ({
  selectedDay, selectDay,
  logRegular, logMidgrade, logPremium,
  regular, midgrade, premium, week,
}) => (
  <section className="panel" id="log">
    <div className="panel-head">
      <h2 className="title-lg">Log a fill-up</h2>
    </div>

    <div className="field-label">Day</div>
    <div className="segmented" role="group" aria-label="Day">
      {DAYS.map((d, i) => (
        <button
          key={d}
          type="button"
          className={i === selectedDay ? 'active' : ''}
          aria-pressed={i === selectedDay}
          onClick={() => selectDay(i)}
        >
          {d}
        </button>
      ))}
    </div>

    <div className="field-label">Grade</div>
    <div className="grade-buttons">
      <Button handleClick={logRegular} text="Regular" variant="regular" />
      <Button handleClick={logMidgrade} text="Midgrade" variant="midgrade" />
      <Button handleClick={logPremium} text="Premium" variant="premium" />
    </div>

    <div className="field-label">Statistics</div>
    <Statistics regular={regular} midgrade={midgrade} premium={premium} week={week} />
  </section>
)

export default LogPanel

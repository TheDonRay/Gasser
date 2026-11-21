import DayCard from './DayCard.jsx'
import Button from './Button.jsx'

const WeekGrid = ({ week, selectedDay, selectDay, updateDay, resetWeek }) => (
  <section className="panel" id="week">
    <div className="panel-head">
      <h2>Days of the week</h2>
      <span className="muted small">Click a day, then edit its gallons and $</span>
    </div>
    <div className="week-grid">
      {week.map((d, i) => (
        <DayCard
          key={d.day}
          data={d}
          index={i}
          selected={i === selectedDay}
          selectDay={selectDay}
          updateDay={updateDay}
        />
      ))}
      <Button handleClick={resetWeek} text="Reset week" variant="dashed" />
    </div>
  </section>
)

export default WeekGrid

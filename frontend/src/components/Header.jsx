import { money } from '../stats.js'

const HeadlineStat = ({ value, label, badge, tone }) => (
  <div className="headline">
    <div className="headline-value">{value}</div>
    <div className="headline-label">
      {label}
      {badge && <span className={`badge badge-${tone}`}>{badge}</span>}
    </div>
  </div>
)

const Header = ({ totalFillUps, summary }) => (
  <header className="page-head">
    <div>
      <h1>Weekly Fuel Log</h1>
      <p className="muted">Every fill-up, gallon and dollar, day by day</p>
    </div>
    <div className="headlines">
      <HeadlineStat
        value={totalFillUps}
        label="Fill-ups"
        badge={`${summary.activeDays}/7 days`}
        tone="green"
      />
      <HeadlineStat value={money(summary.spent)} label="Spent" />
      <HeadlineStat
        value={summary.gallons.toFixed(1)}
        label="Gallons"
        badge={summary.gallons > 0 ? money(summary.spent / summary.gallons) : null}
        tone="blue"
      />
    </div>
  </header>
)

export default Header

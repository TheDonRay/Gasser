import StatisticLine from './StatisticLine.jsx'
import { money, perGallon, summarize } from '../stats.js'

const Statistics = ({ regular, midgrade, premium, week }) => {
  const total = regular + midgrade + premium

  // Conditional rendering (assignment requirement #5)
  if (total === 0) {
    return <p className="empty">No fill-ups logged yet. Pick a grade above to start.</p>
  }

  const { gallons, spent, priciest } = summarize(week)

  return (
    <table className="stats">
      <tbody>
        <StatisticLine text="Fill-ups" value={total} />
        <StatisticLine text="Regular" value={regular} />
        <StatisticLine text="Midgrade" value={midgrade} />
        <StatisticLine text="Premium" value={premium} />
        <StatisticLine text="Total gallons" value={gallons.toFixed(2)} />
        <StatisticLine text="Total spent" value={money(spent)} />
        <StatisticLine text="Avg price" value={perGallon(spent, gallons)} />
        <StatisticLine
          text="Priciest day"
          value={priciest.spent > 0 ? `${priciest.day} · ${money(priciest.spent)}` : '—'}
        />
        <StatisticLine text="Premium share" value={`${Math.round((premium / total) * 100)}%`} />
      </tbody>
    </table>
  )
}

export default Statistics

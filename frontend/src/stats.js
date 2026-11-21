export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const DAY_NAMES = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
  Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
}

export const money = (n) => `$${n.toFixed(2)}`
export const perGallon = (spent, gallons) =>
  gallons > 0 ? `${money(spent / gallons)}/gal` : '—'

// Totals shared by the header and the Statistics panel
export const summarize = (week) => {
  const gallons = week.reduce((s, d) => s + d.gallons, 0)
  const spent = week.reduce((s, d) => s + d.spent, 0)
  const activeDays = week.filter((d) => d.fillUps > 0 || d.spent > 0).length
  const priciest = week.reduce((max, d) => (d.spent > max.spent ? d : max), week[0])
  return { gallons, spent, activeDays, priciest }
}

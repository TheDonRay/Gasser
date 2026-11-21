const StatisticLine = ({ text, value }) => (
  <tr>
    <td className="stat-label">{text}</td>
    <td className="stat-value">{value}</td>
  </tr>
)

export default StatisticLine

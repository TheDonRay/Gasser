import Icon from './Icon.jsx'

const NAV = [
  { href: '#week', label: 'This week', icon: 'grid' },
  { href: '#log', label: 'Log fill-up', icon: 'fuel' },
  { href: '#breakdown', label: 'Daily breakdown', icon: 'list' },
  { href: '#car', label: 'My ride', icon: 'car' },
  { href: '#ai', label: 'AI pit stop', icon: 'sparkle' },
]

const Sidebar = ({ dark, toggleTheme }) => (
  <aside className="sidebar">
    <div className="brand">
      <div className="brand-mark"><Icon name="fuel" size={20} /></div>
      <span>Gas<b>ser</b></span>
    </div>

    <nav className="nav">
      {NAV.map((n) => (
        <a key={n.href} href={n.href} className="nav-item">
          <Icon name={n.icon} />
          {n.label}
        </a>
      ))}
    </nav>

    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
    >
      <Icon name="moon" />
      <span className="theme-label">Dark mode</span>
      <span className={`switch${dark ? ' on' : ''}`} />
    </button>
  </aside>
)

export default Sidebar

// Stateless: the click handler comes from the parent as a prop
const Button = ({ handleClick, text, variant = 'regular', disabled = false }) => (
  <button
    type="button"
    className={`btn btn-${variant}`}
    onClick={handleClick}
    disabled={disabled}
  >
    <span className="btn-text">{text}</span>
  </button>
)

export default Button

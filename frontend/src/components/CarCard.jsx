import { useState } from 'react'
import { money } from '../stats.js'

// Vite bundles every image in frontend/car-photos at build time.
// Drop a photo in that folder; the file name becomes the car's name
// (e.g. "honda-civic.jpg" -> "Honda Civic").
const modules = import.meta.glob('../../car-photos/*.{png,jpg,jpeg,webp,avif,gif}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const PHOTOS = Object.entries(modules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, url]) => {
    const file = path.split('/').pop().replace(/\.[^.]+$/, '')
    const name = file
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
    return { url, name }
  })

const CarCard = ({ summary }) => {
  // Display-only UI state: which photo is showing when there are several
  const [index, setIndex] = useState(0)
  const photo = PHOTOS[index]

  return (
    <section className="panel car" id="car">
      <div className="panel-head">
        <h2>My ride</h2>
        {PHOTOS.length > 1 && (
          <div className="car-dots" role="group" aria-label="Car photos">
            {PHOTOS.map((p, i) => (
              <button
                key={p.url}
                type="button"
                className={i === index ? 'active' : ''}
                aria-label={`Show ${p.name}`}
                aria-pressed={i === index}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}
      </div>

      {photo ? (
        <figure className="car-photo">
          <img src={photo.url} alt={photo.name} />
          <figcaption>{photo.name}</figcaption>
        </figure>
      ) : (
        <div className="car-empty">
          Add a photo of your car to <code>frontend/car-photos/</code> and it’ll show up here.
        </div>
      )}

      <div className="car-stats">
        <div>
          <span className="muted small">This week</span>
          <b>{summary.gallons.toFixed(1)} gal</b>
        </div>
        <div>
          <span className="muted small">Fuel cost</span>
          <b>{money(summary.spent)}</b>
        </div>
      </div>
    </section>
  )
}

export default CarCard

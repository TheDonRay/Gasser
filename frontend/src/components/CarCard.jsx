import { useEffect, useRef, useState } from 'react'
import { money } from '../stats.js'

// Optional: Vite still bundles any image in frontend/car-photos at build time,
// so a site owner can ship default photos. Visitors upload their own below.
const modules = import.meta.glob('../../car-photos/*.{png,jpg,jpeg,webp,avif,gif}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const prettyName = (fileName) =>
  fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()) || 'My car'

const BUNDLED = Object.entries(modules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, url]) => ({ id: url, url, name: prettyName(path.split('/').pop()), bundled: true }))

const PHOTOS_KEY = 'pumplog-car-photos'
const MAX_SIDE = 1280 // px: plenty for the card on any screen, small enough for localStorage
const MAX_PHOTOS = 5

const loadUploads = () => {
  try {
    const list = JSON.parse(localStorage.getItem(PHOTOS_KEY))
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

// Downscale and re-encode in the browser so a 12MP phone photo fits in storage
const fileToPhoto = (file) =>
  new Promise((resolve, reject) => {
    const src = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.naturalWidth * scale)
      canvas.height = Math.round(img.naturalHeight * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(src)
      resolve({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        url: canvas.toDataURL('image/jpeg', 0.82),
        name: prettyName(file.name),
      })
    }
    img.onerror = () => {
      URL.revokeObjectURL(src)
      reject(new Error(`Couldn't read "${file.name}". Try a JPG, PNG or WebP.`))
    }
    img.src = src
  })

const CarCard = ({ summary }) => {
  const [uploads, setUploads] = useState(loadUploads)
  const [index, setIndex] = useState(0)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  // Uploaded photos come first so a visitor's own car is what they see
  const photos = [...uploads, ...BUNDLED]
  const safeIndex = Math.min(index, Math.max(photos.length - 1, 0))
  const photo = photos[safeIndex]

  useEffect(() => {
    try {
      localStorage.setItem(PHOTOS_KEY, JSON.stringify(uploads))
    } catch {
      // Quota or private mode: photos still show for this session
    }
  }, [uploads])

  const addFiles = async (fileList) => {
    const files = [...fileList].filter((f) => f.type.startsWith('image/'))
    if (!files.length) {
      setError('Please choose an image file.')
      return
    }
    const room = MAX_PHOTOS - uploads.length
    if (room <= 0) {
      setError(`You can keep up to ${MAX_PHOTOS} photos. Remove one to add another.`)
      return
    }
    setBusy(true)
    setError('')
    try {
      const added = await Promise.all(files.slice(0, room).map(fileToPhoto))
      const next = [...added, ...uploads]
      // Make sure it actually fits in storage before committing
      try {
        localStorage.setItem(PHOTOS_KEY, JSON.stringify(next))
      } catch {
        setError("Storage is full, so this photo won't be saved after you leave.")
      }
      setUploads(next)
      setIndex(0)
      if (files.length > room) setError(`Only ${room} more photo${room === 1 ? '' : 's'} fit. Extra files were skipped.`)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const onPick = (e) => {
    addFiles(e.target.files)
    e.target.value = '' // let the same file be picked again
  }

  const removeCurrent = () => {
    if (!photo || photo.bundled) return
    setUploads((prev) => prev.filter((p) => p.id !== photo.id))
    setIndex(Math.max(safeIndex - 1, 0))
    setError('')
  }

  const openPicker = () => inputRef.current?.click()

  const dropProps = {
    onDragOver: (e) => {
      e.preventDefault()
      setDragging(true)
    },
    onDragLeave: () => setDragging(false),
    onDrop: (e) => {
      e.preventDefault()
      setDragging(false)
      addFiles(e.dataTransfer.files)
    },
  }

  return (
    <section className="panel car" id="car">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={onPick}
      />

      {photos.length > 0 && (
        <div className="panel-head">
          {photos.length > 1 ? (
            <div className="car-dots" role="group" aria-label="Car photos">
              {photos.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  className={i === safeIndex ? 'active' : ''}
                  aria-label={`Show ${p.name}`}
                  aria-pressed={i === safeIndex}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          ) : (
            <span />
          )}
          <div className="car-actions">
            <button type="button" className="chip" onClick={openPicker} disabled={busy}>
              {busy ? 'Adding…' : '+ Add photo'}
            </button>
            {photo && !photo.bundled && (
              <button type="button" className="chip chip-danger" onClick={removeCurrent}>
                Remove
              </button>
            )}
          </div>
        </div>
      )}

      {photo ? (
        <figure className={`car-photo${dragging ? ' dragging' : ''}`} {...dropProps}>
          <img src={photo.url} alt={`My car: ${photo.name}`} />
        </figure>
      ) : (
        <button
          type="button"
          className={`car-empty${dragging ? ' dragging' : ''}`}
          onClick={openPicker}
          disabled={busy}
          {...dropProps}
        >
          <span className="car-empty-icon" aria-hidden="true">＋</span>
          <span>
            <b>{busy ? 'Adding photo…' : 'Upload a photo of your car'}</b>
            <span className="car-empty-hint">Tap to choose or drag an image here</span>
          </span>
        </button>
      )}

      {error && <p className="error car-error" role="alert">{error}</p>}

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

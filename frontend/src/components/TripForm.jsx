import { useState } from 'react'

const PRESETS = [
  {
    label: 'NYC → Chicago → LA',
    data: {
      current_location: 'New York, NY',
      pickup_location: 'Chicago, IL',
      dropoff_location: 'Los Angeles, CA',
      current_lat: 40.7128,
      current_lon: -74.0060,
      pickup_lat: 41.8781,
      pickup_lon: -87.6298,
      dropoff_lat: 34.0522,
      dropoff_lon: -118.2437,
    },
  },
  {
    label: 'Dallas → Denver → Seattle',
    data: {
      current_location: 'Dallas, TX',
      pickup_location: 'Denver, CO',
      dropoff_location: 'Seattle, WA',
      current_lat: 32.7767,
      current_lon: -96.7970,
      pickup_lat: 39.7392,
      pickup_lon: -104.9903,
      dropoff_lat: 47.6062,
      dropoff_lon: -122.3321,
    },
  },
  {
    label: 'Miami → Atlanta → NYC',
    data: {
      current_location: 'Miami, FL',
      pickup_location: 'Atlanta, GA',
      dropoff_location: 'New York, NY',
      current_lat: 25.7617,
      current_lon: -80.1918,
      pickup_lat: 33.749,
      pickup_lon: -84.388,
      dropoff_lat: 40.7128,
      dropoff_lon: -74.006,
    },
  },
]

const DEFAULT_FORM = {
  current_location: '',
  pickup_location: '',
  dropoff_location: '',
  current_cycle_hours: '',
  current_lat: '',
  current_lon: '',
  pickup_lat: '',
  pickup_lon: '',
  dropoff_lat: '',
  dropoff_lon: '',
}

export default function TripForm({ onSubmit, loading }) {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [showCoords, setShowCoords] = useState(false)

  const update = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }))

  const applyPreset = (preset) => {
    setForm({
      ...DEFAULT_FORM,
      ...preset.data,
      current_cycle_hours:
        form.current_cycle_hours || '',
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const payload = {
      current_location: form.current_location,
      pickup_location: form.pickup_location,
      dropoff_location: form.dropoff_location,
      current_cycle_hours:
        parseFloat(form.current_cycle_hours) || 0,
    }

    if (form.current_lat)
      payload.current_lat = parseFloat(
        form.current_lat
      )

    if (form.current_lon)
      payload.current_lon = parseFloat(
        form.current_lon
      )

    if (form.pickup_lat)
      payload.pickup_lat = parseFloat(
        form.pickup_lat
      )

    if (form.pickup_lon)
      payload.pickup_lon = parseFloat(
        form.pickup_lon
      )

    if (form.dropoff_lat)
      payload.dropoff_lat = parseFloat(
        form.dropoff_lat
      )

    if (form.dropoff_lon)
      payload.dropoff_lon = parseFloat(
        form.dropoff_lon
      )

    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="card-title">
        📋 Trip Details
      </div>

      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            fontSize: 12,
            color: 'var(--gray-500)',
            marginBottom: 6,
          }}
        >
          Quick presets:
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {PRESETS.map((p) => (
            <button
              type="button"
              key={p.label}
              className="btn-secondary"
              onClick={() => applyPreset(p)}
              style={{
                textAlign: 'left',
                fontSize: 12,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Current Location</label>

        <input
          placeholder="e.g. New York, NY"
          value={form.current_location}
          onChange={(e) =>
            update(
              'current_location',
              e.target.value
            )
          }
          required
        />
      </div>

      <div className="form-group">
        <label>Pickup Location</label>

        <input
          placeholder="e.g. Chicago, IL"
          value={form.pickup_location}
          onChange={(e) =>
            update(
              'pickup_location',
              e.target.value
            )
          }
          required
        />
      </div>

      <div className="form-group">
        <label>Dropoff Location</label>

        <input
          placeholder="e.g. Los Angeles, CA"
          value={form.dropoff_location}
          onChange={(e) =>
            update(
              'dropoff_location',
              e.target.value
            )
          }
          required
        />
      </div>

      <div className="form-group">
        <label>
          Current Cycle Hours Used (0–70)
        </label>

        <input
          type="number"
          placeholder="e.g. 20"
          min="0"
          max="70"
          step="0.5"
          value={form.current_cycle_hours}
          onChange={(e) =>
            update(
              'current_cycle_hours',
              e.target.value
            )
          }
          required
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <button
          type="button"
          className="btn-secondary"
          style={{ fontSize: 12 }}
          onClick={() =>
            setShowCoords(!showCoords)
          }
        >
          {showCoords ? '▲' : '▼'} Custom
          Coordinates (optional)
        </button>
      </div>

      {showCoords && (
        <>
          <div
            style={{
              fontSize: 12,
              color: 'var(--gray-500)',
              marginBottom: 8,
            }}
          >
            Provide lat/lon for accurate
            distance calculation.
          </div>

          <div
            className="form-row"
            style={{ marginBottom: 8 }}
          >
            <div className="form-group">
              <label>Current Lat</label>

              <input
                type="number"
                step="any"
                value={form.current_lat}
                onChange={(e) =>
                  update(
                    'current_lat',
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>Current Lon</label>

              <input
                type="number"
                step="any"
                value={form.current_lon}
                onChange={(e) =>
                  update(
                    'current_lon',
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div
            className="form-row"
            style={{ marginBottom: 8 }}
          >
            <div className="form-group">
              <label>Pickup Lat</label>

              <input
                type="number"
                step="any"
                value={form.pickup_lat}
                onChange={(e) =>
                  update(
                    'pickup_lat',
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>Pickup Lon</label>

              <input
                type="number"
                step="any"
                value={form.pickup_lon}
                onChange={(e) =>
                  update(
                    'pickup_lon',
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div
            className="form-row"
            style={{ marginBottom: 8 }}
          >
            <div className="form-group">
              <label>Dropoff Lat</label>

              <input
                type="number"
                step="any"
                value={form.dropoff_lat}
                onChange={(e) =>
                  update(
                    'dropoff_lat',
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>Dropoff Lon</label>

              <input
                type="number"
                step="any"
                value={form.dropoff_lon}
                onChange={(e) =>
                  update(
                    'dropoff_lon',
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </>
      )}

      <button
        type="submit"
        className="btn-primary"
        disabled={loading}
        style={{
          transition: 'all 0.3s ease',
          transform: loading
            ? 'scale(0.98)'
            : 'scale(1)',
          opacity: loading ? 0.85 : 1,
        }}
      >
        {loading
          ? '⏳ Generating...'
          : '🚀 Plan Trip'}
      </button>
    </form>
  )
}
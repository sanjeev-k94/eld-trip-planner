export default function TripSummary({ summary, trip }) {
  if (!summary) return null

  return (
    <div className="card">
      <div className="card-title">📊 Trip Summary</div>

      <div
        style={{
          fontSize: 13,
          color: 'var(--gray-600)',
          marginBottom: 12,
        }}
      >
        <strong>{trip?.current_location}</strong> →{' '}
        <strong>{trip?.pickup_location}</strong> →{' '}
        <strong>{trip?.dropoff_location}</strong>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-value">
            {summary.total_miles > 0
              ? summary.total_miles.toLocaleString()
              : '—'}
          </div>
          <div className="stat-label">Total Miles</div>
        </div>

        <div className="stat-box">
          <div className="stat-value">{summary.total_days}</div>
          <div className="stat-label">Days</div>
        </div>

        <div className="stat-box">
          <div className="stat-value">
            {summary.to_pickup_miles > 0
              ? summary.to_pickup_miles
              : '—'}
          </div>
          <div className="stat-label">To Pickup</div>
        </div>

        <div className="stat-box">
          <div className="stat-value">
            {summary.to_dropoff_miles > 0
              ? summary.to_dropoff_miles
              : '—'}
          </div>
          <div className="stat-label">To Dropoff</div>
        </div>

        {/* NEW TIMING CARDS */}

        <div className="stat-box">
          <div className="stat-value">
            {summary.current_time || '—'}
          </div>
          <div className="stat-label">Current Time</div>
        </div>

        <div className="stat-box">
          <div className="stat-value">
            {summary.pickup_eta || '—'}
          </div>
          <div className="stat-label">Pickup ETA</div>
        </div>

        <div className="stat-box">
          <div className="stat-value">
            {summary.dropoff_eta || '—'}
          </div>
          <div className="stat-label">Drop ETA</div>
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          fontSize: 12,
          color: 'var(--gray-500)',
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <span>
          ⏱ Cycle hours used:{' '}
          <strong>{summary.current_cycle_hours}h</strong>
        </span>

        <span>
          📋 HOS Rule:{' '}
          <strong>{summary.hos_rule || '70-hr/8-day'}</strong>
        </span>

        <span>
          🚗 Avg Speed:{' '}
          <strong>{summary.average_speed || '55 mph'}</strong>
        </span>
      </div>
    </div>
  )
}
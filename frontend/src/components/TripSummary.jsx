export default function TripSummary({
  summary,
  trip,
}) {
  if (!summary) return null

  return (
    <div className="card">
      <div className="card-title">
        📊 Trip Summary
      </div>

      <div
        style={{
          fontSize: 13,
          color: 'var(--gray-600)',
          marginBottom: 12,
        }}
      >
        <strong>
          {trip?.current_location}
        </strong>{' '}
        →{' '}
        <strong>
          {trip?.pickup_location}
        </strong>{' '}
        →{' '}
        <strong>
          {trip?.dropoff_location}
        </strong>
      </div>

      <div className="stats-grid">
        {/* TOTAL MILES */}

        <div className="stat-box">
          <div className="stat-value">
            {summary.total_miles > 0
              ? summary.total_miles.toLocaleString()
              : '—'}
          </div>

          <div className="stat-label">
            Total Miles
          </div>
        </div>

        {/* TOTAL DAYS */}

        <div className="stat-box">
          <div className="stat-value">
            {summary.total_days}
          </div>

          <div className="stat-label">
            Days
          </div>
        </div>

        {/* PICKUP DISTANCE */}

        <div className="stat-box">
          <div className="stat-value">
            {summary.to_pickup_miles > 0
              ? summary.to_pickup_miles
              : '—'}
          </div>

          <div className="stat-label">
            To Pickup
          </div>
        </div>

        {/* DROPOFF DISTANCE */}

        <div className="stat-box">
          <div className="stat-value">
            {summary.to_dropoff_miles > 0
              ? summary.to_dropoff_miles
              : '—'}
          </div>

          <div className="stat-label">
            To Dropoff
          </div>
        </div>

        {/* CURRENT TIME */}

        <div className="stat-box">
          <div className="stat-value">
            {summary.current_time ||
              '—'}
          </div>

          <div className="stat-label">
            Current Time
          </div>
        </div>

        {/* PICKUP ETA */}

        <div className="stat-box">
          <div className="stat-value">
            {summary.pickup_eta ||
              '—'}
          </div>

          <div className="stat-label">
            Pickup ETA
          </div>
        </div>

        {/* DROPOFF ETA */}

        <div className="stat-box">
          <div className="stat-value">
            {summary.dropoff_eta ||
              '—'}
          </div>

          <div className="stat-label">
            Drop ETA
          </div>
        </div>
      </div>

      {/* INFO SECTION */}

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
          <strong>
            {
              summary.current_cycle_hours
            }
            h
          </strong>
        </span>

        <span>
          📋 HOS Rule:{' '}
          <strong>
            {summary.hos_rule ||
              '70-hr/8-day'}
          </strong>
        </span>

        <span>
          🚗 Avg Speed:{' '}
          <strong>
            {summary.average_speed ||
              '55 mph'}
          </strong>
        </span>
      </div>

      {/* FATIGUE WARNING */}

      {summary.fatigue_warning && (
        <div
          style={{
            marginTop: 20,
            padding: 18,
            borderRadius: 18,
            background:
              'linear-gradient(135deg, #fee2e2, #fecaca)',
            border:
              '1px solid #ef4444',
            color: '#991b1b',
            boxShadow:
              '0 6px 18px rgba(239,68,68,0.18)',
          }}
        >
          <div
            style={{
              fontSize: 17,
              fontWeight: 700,
            }}
          >
            ⚠ Driver Fatigue Warning
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            {
              summary.fatigue_warning
            }
          </div>
        </div>
      )}
    </div>
  )
}
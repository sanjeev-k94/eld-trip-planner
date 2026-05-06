const STATUS_LABELS = {
  OFF: 'Off Duty',
  SB: 'Sleeper Berth',
  D: 'Driving',
  ON: 'On Duty (Not Driving)',
}

const STATUS_COLORS = {
  OFF: 'var(--gray-400)',
  SB: '#7c3aed',
  D: '#059669',
  ON: '#d97706',
}

function buildHourGrid(entries) {
  const grid = Array(24).fill(null)
  let currentHour = 0
  for (const entry of entries) {
    const start = Math.floor(currentHour)
    const end = Math.min(24, currentHour + entry.duration)
    for (let h = start; h < Math.ceil(end); h++) {
      if (h < 24) grid[h] = entry.status
    }
    currentHour += entry.duration
    if (currentHour >= 24) break
  }
  return grid
}

export default function LogSheet({ schedule, selectedDay, onSelectDay }) {
  if (!schedule || schedule.length === 0) return null

  const dayData = schedule.find(d => d.day === selectedDay) || schedule[0]
  const grid = buildHourGrid(dayData.entries)

  return (
    <div className="card">
      <div className="card-title">📋 Driver Daily Log (ELD)</div>

      <div className="day-tabs">
        {schedule.map(d => (
          <button key={d.day} className={`day-tab ${d.day === selectedDay ? 'active' : ''}`}
            onClick={() => onSelectDay(d.day)}>
            Day {d.day}
          </button>
        ))}
      </div>

      <div className="log-grid-wrapper">
        <div className="log-grid">
          {/* Header */}
          <div className="log-header">
            <div className="log-header-cell">Status</div>
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="log-header-cell">{i}</div>
            ))}
          </div>

          {/* Rows for each status */}
          {['OFF', 'SB', 'D', 'ON'].map(status => (
            <div key={status} className="log-row">
              <div className="log-row-label">
                <span style={{ color: STATUS_COLORS[status], marginRight: 6, fontSize: 10 }}>●</span>
                {STATUS_LABELS[status]}
              </div>
              {grid.map((cellStatus, hour) => (
                <div
                  key={hour}
                  className={`log-cell ${cellStatus === status ? 'active' : 'inactive'} status-${cellStatus === status ? status : ''}`}
                  style={cellStatus === status ? { background: STATUS_COLORS[status] } : { background: 'var(--gray-100)' }}
                  title={cellStatus === status ? `Hour ${hour}:00 - ${STATUS_LABELS[status]}` : ''}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="legend">
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <div key={key} className="legend-item">
            <div className="legend-dot" style={{ background: STATUS_COLORS[key] }} />
            {label}
          </div>
        ))}
      </div>

      {/* Day stats */}
      <div className="day-summary">
        <div className="day-stat">Driving: <strong>{dayData.driving_hours}h</strong></div>
        <div className="day-stat">On Duty: <strong>{dayData.on_duty_hours}h</strong></div>
        <div className="day-stat">Off: <strong>{(24 - dayData.on_duty_hours).toFixed(1)}h</strong></div>
      </div>

      {/* Detailed entry list */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--gray-700)' }}>
          Activity Log
        </div>
        <div className="entry-list">
          {dayData.entries.map((entry, i) => (
            <div key={i} className="entry-item">
              <span className={`entry-badge badge-${entry.status}`}>{entry.status}</span>
              <span className="entry-duration">{entry.duration.toFixed(1)}h</span>
              <span className="entry-remarks">{entry.remarks || STATUS_LABELS[entry.status]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

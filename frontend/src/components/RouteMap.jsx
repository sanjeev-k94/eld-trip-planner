export default function RouteMap({ stops }) {
  if (!stops || stops.length === 0) return null

  const validStops = stops.filter(s => s.lat && s.lon)
  if (validStops.length === 0) return null

  const lats = validStops.map(s => s.lat)
  const lons = validStops.map(s => s.lon)
  const minLat = Math.min(...lats), maxLat = Math.max(...lats)
  const minLon = Math.min(...lons), maxLon = Math.max(...lons)

  const padLat = (maxLat - minLat) * 0.2 || 2
  const padLon = (maxLon - minLon) * 0.2 || 2

  const W = 700, H = 260
  const toX = (lon) => ((lon - (minLon - padLon)) / ((maxLon + padLon) - (minLon - padLon))) * W
  const toY = (lat) => H - ((lat - (minLat - padLat)) / ((maxLat + padLat) - (minLat - padLat))) * H

  const points = validStops.map(s => ({ x: toX(s.lon), y: toY(s.lat), ...s }))

  const ICONS = { current: '📍', pickup: '🟢', dropoff: '🔴' }
  const COLORS = { current: '#1a56db', pickup: '#057a55', dropoff: '#c81e1e' }

  return (
    <div className="card">
      <div className="card-title">🗺️ Route Map</div>
      <div style={{ background: '#dbeafe', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 260, display: 'block' }}>
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bfdbfe" />
              <stop offset="100%" stopColor="#dbeafe" />
            </linearGradient>
          </defs>
          <rect width={W} height={H} fill="url(#skyGrad)" />

          {/* Road lines */}
          {points.length >= 2 && points.slice(0, -1).map((p, i) => {
            const next = points[i + 1]
            return (
              <g key={i}>
                <line x1={p.x} y1={p.y} x2={next.x} y2={next.y}
                  stroke="rgba(0,0,0,0.15)" strokeWidth="6" strokeLinecap="round" />
                <line x1={p.x} y1={p.y} x2={next.x} y2={next.y}
                  stroke="white" strokeWidth="3" strokeLinecap="round" strokeDasharray="12 8" />
              </g>
            )
          })}

          {/* Stops */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={14} fill={COLORS[p.type]} opacity={0.2} />
              <circle cx={p.x} cy={p.y} r={8} fill={COLORS[p.type]} />
              <circle cx={p.x} cy={p.y} r={4} fill="white" />
              <text x={p.x} y={p.y - 20} textAnchor="middle" fontSize="10"
                fill="var(--gray-800)" fontWeight="600"
                style={{ filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.8))' }}>
                {p.name.length > 18 ? p.name.slice(0, 16) + '…' : p.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="legend" style={{ marginTop: 12 }}>
        <div className="legend-item"><div className="legend-dot" style={{ background: '#1a56db' }} /> Current Location</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: '#057a55' }} /> Pickup</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: '#c81e1e' }} /> Dropoff</div>
      </div>
    </div>
  )
}

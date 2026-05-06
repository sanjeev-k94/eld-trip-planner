export default function TripHistory({ trips, onSelect }) {
  if (!trips || trips.length === 0) return null
  return (
    <div>
      <div className="card-title" style={{ fontSize: 13 }}>🕒 Recent Trips</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {trips.slice(0, 5).map(trip => (
          <div key={trip.id} className="trip-item" onClick={() => onSelect(trip)}>
            <div className="trip-item-header">
              {trip.pickup_location} → {trip.dropoff_location}
            </div>
            <div className="trip-item-sub">
              From: {trip.current_location} · Cycle: {trip.current_cycle_hours}h used
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

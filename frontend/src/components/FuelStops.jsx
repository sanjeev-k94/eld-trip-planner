export default function FuelStops({ fuelStops }) {
  if (!fuelStops || fuelStops.length === 0)
    return null

  return (
    <div className="card">
      <div className="card-title">
        ⛽ Recommended Fuel Stops
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          marginTop: 18,
        }}
      >
        {fuelStops.map((stop, index) => (
          <div
            key={index}
            style={{
              padding: 16,
              borderRadius: 16,
              background:
                'linear-gradient(135deg, #ffffff, #f8fafc)',
              border: '1px solid #e5e7eb',
              boxShadow:
                '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 16,
                marginBottom: 8,
              }}
            >
              {stop.stop_name}
            </div>

            <div
              style={{
                fontSize: 14,
                color: '#555',
                lineHeight: 1.8,
              }}
            >
              <div>
                📍 Distance:
                <strong>
                  {' '}
                  {stop.mile} miles
                </strong>
              </div>

              <div>
                ⏱ ETA:
                <strong>
                  {' '}
                  {stop.eta}
                </strong>
              </div>

              <div>
                ☕ Recommended Break:
                <strong>
                  {' '}
                  {stop.recommended_break}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
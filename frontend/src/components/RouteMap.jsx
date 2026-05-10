import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

export default function RouteMap({ stops }) {
  if (!stops || stops.length === 0)
    return null

  const positions = stops.map((stop) => [
    stop.lat,
    stop.lon,
  ])

  return (
    <div className="card">
      <div className="card-title">
        🗺️ Route Map
      </div>

      <div
        style={{
          height: '500px',
          borderRadius: '18px',
          overflow: 'hidden',
          marginTop: '16px',
        }}
      >
        <MapContainer
          center={positions[0]}
          zoom={4}
          style={{
            height: '100%',
            width: '100%',
          }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {stops.map((stop, index) => (
            <Marker
              key={index}
              position={[
                stop.lat,
                stop.lon,
              ]}
            >
              <Popup>
                <strong>
                  {stop.name}
                </strong>
                <br />
                {stop.type}
              </Popup>
            </Marker>
          ))}

          <Polyline
            positions={positions}
          />
        </MapContainer>
      </div>
    </div>
  )
}
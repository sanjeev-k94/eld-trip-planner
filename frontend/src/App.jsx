import { useState, useEffect } from 'react'
import './App.css'
import TripForm from './components/TripForm'
import RouteMap from './components/RouteMap'
import LogSheet from './components/LogSheet'
import TripSummary from './components/TripSummary'
import TripHistory from './components/TripHistory'
import FuelStops from './components/FuelStops'

function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [trips, setTrips] = useState([])
  const [selectedDay, setSelectedDay] = useState(1)

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/trips/')
      if (res.ok) setTrips(await res.json())
    } catch (e) {}
  }

  useEffect(() => {
    fetchTrips()
  }, [])

  const handlePlan = async (formData) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/trips/plan/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok)
        throw new Error(data.error || 'Failed to plan trip')

      setResult(data)
      setSelectedDay(1)
      fetchTrips()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectTrip = async (trip) => {
    try {
      const res = await fetch(`/api/trips/${trip.id}/`)

      if (res.ok) {
        const data = await res.json()

        const schedule = buildScheduleFromLogs(
          data.log_entries
        )

        setResult({
          trip: data,
          schedule,
          summary: {
            total_miles: 0,
            to_pickup_miles: 0,
            to_dropoff_miles: 0,
            total_days: schedule.length,
            current_cycle_hours:
              data.current_cycle_hours,
          },
          stops: [],
        })

        setSelectedDay(1)
      }
    } catch (e) {}
  }

  const buildScheduleFromLogs = (entries) => {
    const byDay = {}

    entries.forEach((e) => {
      if (!byDay[e.day]) {
        byDay[e.day] = {
          day: e.day,
          entries: [],
          driving_hours: 0,
          on_duty_hours: 0,
        }
      }

      byDay[e.day].entries.push({
        status: e.status,
        duration: e.duration,
        remarks: e.remarks,
      })

      if (e.status === 'D')
        byDay[e.day].driving_hours +=
          e.duration

      if (
        e.status === 'D' ||
        e.status === 'ON'
      )
        byDay[e.day].on_duty_hours +=
          e.duration
    })

    return Object.values(byDay).sort(
      (a, b) => a.day - b.day
    )
  }

  return (
    <div className="app">
      <header className="header">
        <span className="header-icon">
          🚛
        </span>

        <div>
          <h1>ELD Trip Planner</h1>

          <p>
            FMCSA HOS Compliant • Route
            Mapping • Driver Log Generation
          </p>
        </div>
      </header>

      <div className="main">
        <aside className="sidebar">
          <TripForm
            onSubmit={handlePlan}
            loading={loading}
          />

          {error && (
            <div className="error-box">
              ⚠ {error}
            </div>
          )}

          <TripHistory
            trips={trips}
            onSelect={handleSelectTrip}
          />
        </aside>

        <main className="content">
          {!result && !loading && (
            <div className="empty">
              <span className="empty-icon">
                🗺️
              </span>

              <h3>
                Plan Your First Trip
              </h3>

              <p>
                Enter your locations and
                current cycle hours to
                generate an HOS-compliant
                schedule and driver log.
              </p>
            </div>
          )}

          {loading && (
            <div
              className="loading"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 20px',
                textAlign: 'center',
              }}
            >
              <div className="spinner" />

              <h2
                style={{
                  marginTop: 20,
                  fontSize: 28,
                  color: '#2563eb',
                }}
              >
                🚛 Planning Your Trip...
              </h2>

              <p
                style={{
                  marginTop: 10,
                  fontSize: 16,
                  color: '#666',
                  maxWidth: 500,
                  lineHeight: 1.6,
                }}
              >
                Calculating HOS schedule,
                ETA timings, route mapping,
                and generating driver logs
                for your trip.
              </p>

              <div
                style={{
                  width: '80%',
                  maxWidth: 500,
                  height: 12,
                  background: '#e5e7eb',
                  borderRadius: 999,
                  overflow: 'hidden',
                  marginTop: 24,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background:
                      'linear-gradient(90deg, #2563eb, #7c3aed)',
                    animation:
                      'loadingBar 2s infinite',
                  }}
                />
              </div>

              <div
                style={{
                  marginTop: 24,
                  color: '#666',
                  lineHeight: 2,
                }}
              >
                <div>
                  🛰️ Mapping intelligent
                  route...
                </div>

                <div>
                  📋 Generating FMCSA
                  compliant logs...
                </div>

                <div>
                  ⏱️ Calculating real-time
                  ETA...
                </div>

                <div>
                  🚛 Optimizing driver
                  schedule...
                </div>

                <div>
                  ⚡ Finalizing trip
                  analytics...
                </div>
              </div>
            </div>
          )}

          {result && (
            <>
              <TripSummary
                summary={result.summary}
                trip={result.trip}
              />

              <RouteMap
                stops={result.stops}
              />
              <FuelStops fuelStops={result.fuel_stops} />
              <LogSheet
                schedule={result.schedule}
                selectedDay={selectedDay}
                onSelectDay={
                  setSelectedDay
                }
              />
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
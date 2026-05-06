"""
HOS (Hours of Service) Calculator for ELD Trip Planner.
Implements FMCSA property-carrying driver regulations:
- 11-hour driving limit per day
- 14-hour on-duty window
- 30-minute break required after 8 hours driving
- 70-hour/8-day cycle limit
"""

DRIVING_LIMIT = 11       # hours per day
ON_DUTY_WINDOW = 14      # hours total on-duty window
CYCLE_LIMIT = 70         # hours in 8-day cycle
BREAK_REQUIRED_AFTER = 8  # hours before mandatory 30-min break
BREAK_DURATION = 0.5     # hours


def calculate_hos(total_distance_miles, current_cycle_hours):
    """
    Calculate HOS schedule segments for a trip.
    Returns a list of day segments with status entries.
    
    Each day segment: {
        day: int,
        entries: [{ status, duration, remarks }],
        driving_hours: float,
        on_duty_hours: float,
    }
    """
    AVG_SPEED_MPH = 55
    FUEL_STOP_INTERVAL = 1000  # miles
    PICKUP_UNLOAD_HOURS = 1    # hours for pickup
    DROPOFF_UNLOAD_HOURS = 1   # hours for dropoff

    remaining_distance = total_distance_miles
    remaining_cycle = CYCLE_LIMIT - current_cycle_hours
    
    days = []
    day = 1
    miles_since_fuel = 0

    # Day 1: start with pre-trip inspection and pickup
    first_day_entries = []
    first_day_entries.append({
        'status': 'ON',
        'duration': 1,
        'remarks': 'Pre-trip inspection & pickup'
    })

    driving_today = 0
    on_duty_today = 1  # already used 1 hour ON
    driving_since_break = 0

    while remaining_distance > 0 and remaining_cycle > 0:
        entries = [] if day > 1 else first_day_entries
        driving_today = 0 if day > 1 else driving_today
        on_duty_today = 0 if day > 1 else on_duty_today
        driving_since_break = 0 if day > 1 else driving_since_break

        if day > 1:
            # Start day with pre-trip
            entries.append({'status': 'ON', 'duration': 0.5, 'remarks': 'Pre-trip inspection'})
            on_duty_today += 0.5

        while remaining_distance > 0 and remaining_cycle > 0:
            # Check if break is needed
            if driving_since_break >= BREAK_REQUIRED_AFTER:
                entries.append({'status': 'OFF', 'duration': BREAK_DURATION, 'remarks': '30-min mandatory break'})
                on_duty_today += BREAK_DURATION
                driving_since_break = 0

            # How much can we drive right now?
            available_driving = min(
                DRIVING_LIMIT - driving_today,
                ON_DUTY_WINDOW - on_duty_today,
                BREAK_REQUIRED_AFTER - driving_since_break,
                remaining_cycle,
            )

            if available_driving <= 0:
                break

            # How far can we go?
            miles_available = available_driving * AVG_SPEED_MPH

            # Check for fuel stop
            if miles_since_fuel + miles_available >= FUEL_STOP_INTERVAL:
                miles_to_fuel = FUEL_STOP_INTERVAL - miles_since_fuel
                drive_to_fuel = miles_to_fuel / AVG_SPEED_MPH
                if drive_to_fuel > 0 and drive_to_fuel <= available_driving:
                    entries.append({
                        'status': 'D',
                        'duration': round(drive_to_fuel, 2),
                        'remarks': 'Driving to fuel stop'
                    })
                    driving_today += drive_to_fuel
                    on_duty_today += drive_to_fuel
                    driving_since_break += drive_to_fuel
                    remaining_cycle -= drive_to_fuel
                    remaining_distance -= miles_to_fuel
                    miles_since_fuel = 0
                    entries.append({'status': 'ON', 'duration': 0.5, 'remarks': 'Fuel stop'})
                    on_duty_today += 0.5
                    available_driving = min(
                        DRIVING_LIMIT - driving_today,
                        ON_DUTY_WINDOW - on_duty_today,
                        BREAK_REQUIRED_AFTER - driving_since_break,
                        remaining_cycle,
                    )
                    if available_driving <= 0:
                        break
                    miles_available = available_driving * AVG_SPEED_MPH

            # Drive available hours
            drive_miles = min(remaining_distance, miles_available)
            drive_hours = drive_miles / AVG_SPEED_MPH

            if drive_hours <= 0:
                break

            entries.append({
                'status': 'D',
                'duration': round(drive_hours, 2),
                'remarks': 'Driving'
            })
            driving_today += drive_hours
            on_duty_today += drive_hours
            driving_since_break += drive_hours
            remaining_cycle -= drive_hours
            remaining_distance -= drive_miles
            miles_since_fuel += drive_miles

            if remaining_distance <= 0:
                # Dropoff
                entries.append({'status': 'ON', 'duration': DROPOFF_UNLOAD_HOURS, 'remarks': 'Dropoff & post-trip inspection'})
                on_duty_today += DROPOFF_UNLOAD_HOURS
                break

            # If we've hit daily limits, break
            if driving_today >= DRIVING_LIMIT or on_duty_today >= ON_DUTY_WINDOW:
                break

        # Fill remaining with OFF/SB
        off_hours = 24 - on_duty_today
        if off_hours > 0:
            if off_hours >= 8:
                entries.append({'status': 'SB', 'duration': round(min(off_hours, 8), 2), 'remarks': 'Sleeper berth rest'})
                if off_hours > 8:
                    entries.append({'status': 'OFF', 'duration': round(off_hours - 8, 2), 'remarks': 'Off duty'})
            else:
                entries.append({'status': 'OFF', 'duration': round(off_hours, 2), 'remarks': 'Off duty'})

        days.append({
            'day': day,
            'entries': entries,
            'driving_hours': round(driving_today, 2),
            'on_duty_hours': round(on_duty_today, 2),
        })

        day += 1

        if day > 14:  # Safety cap
            break

    return days

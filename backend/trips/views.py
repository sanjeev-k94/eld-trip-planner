import math
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Trip, LogEntry
from .serializers import TripSerializer, LogEntrySerializer
from .hos_calculator import calculate_hos


def haversine_distance(lat1, lon1, lat2, lon2):
    R = 3958.8
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


@api_view(['POST'])
def plan_trip(request):
    data = request.data

    required = ['current_location', 'pickup_location', 'dropoff_location', 'current_cycle_hours']
    for field in required:
        if field not in data:
            return Response({'error': f'Missing field: {field}'}, status=status.HTTP_400_BAD_REQUEST)

    current_lat = float(data.get('current_lat', 40.7128))
    current_lon = float(data.get('current_lon', -74.0060))
    pickup_lat = float(data.get('pickup_lat', 41.8781))
    pickup_lon = float(data.get('pickup_lon', -87.6298))
    dropoff_lat = float(data.get('dropoff_lat', 34.0522))
    dropoff_lon = float(data.get('dropoff_lon', -118.2437))

    to_pickup_miles = haversine_distance(current_lat, current_lon, pickup_lat, pickup_lon)
    to_dropoff_miles = haversine_distance(pickup_lat, pickup_lon, dropoff_lat, dropoff_lon)
    total_miles = to_pickup_miles + to_dropoff_miles

    current_cycle_hours = float(data.get('current_cycle_hours', 0))

    schedule = calculate_hos(total_miles, current_cycle_hours)

    trip = Trip.objects.create(
        current_location=data['current_location'],
        pickup_location=data['pickup_location'],
        dropoff_location=data['dropoff_location'],
        current_cycle_hours=current_cycle_hours,
    )

    for day_data in schedule:
        hour = 0
        for entry in day_data['entries']:
            LogEntry.objects.create(
                trip=trip,
                day=day_data['day'],
                hour=int(hour),
                duration=entry['duration'],
                status=entry['status'],
                location=data.get('current_location', ''),
                remarks=entry.get('remarks', ''),
            )
            hour += entry['duration']

    serializer = TripSerializer(trip)

    return Response({
        'trip': serializer.data,
        'schedule': schedule,
        'summary': {
            'total_miles': round(total_miles, 1),
            'to_pickup_miles': round(to_pickup_miles, 1),
            'to_dropoff_miles': round(to_dropoff_miles, 1),
            'total_days': len(schedule),
            'current_cycle_hours': current_cycle_hours,
        },
        'stops': [
            {'name': data['current_location'], 'lat': current_lat, 'lon': current_lon, 'type': 'current'},
            {'name': data['pickup_location'], 'lat': pickup_lat, 'lon': pickup_lon, 'type': 'pickup'},
            {'name': data['dropoff_location'], 'lat': dropoff_lat, 'lon': dropoff_lon, 'type': 'dropoff'},
        ],
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def list_trips(request):
    trips = Trip.objects.all().order_by('-created_at')
    serializer = TripSerializer(trips, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def trip_detail(request, trip_id):
    try:
        trip = Trip.objects.get(id=trip_id)
    except Trip.DoesNotExist:
        return Response({'error': 'Trip not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = TripSerializer(trip)
    return Response(serializer.data)

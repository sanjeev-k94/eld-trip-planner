from django.db import models


class Trip(models.Model):
    current_location = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    current_cycle_hours = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Trip from {self.pickup_location} to {self.dropoff_location}"


class LogEntry(models.Model):
    STATUS_CHOICES = [
        ('OFF', 'Off Duty'),
        ('SB', 'Sleeper Berth'),
        ('D', 'Driving'),
        ('ON', 'On Duty (Not Driving)'),
    ]

    trip = models.ForeignKey(Trip, related_name='log_entries', on_delete=models.CASCADE)
    day = models.IntegerField()
    hour = models.IntegerField()
    duration = models.FloatField(default=1)
    status = models.CharField(max_length=3, choices=STATUS_CHOICES)
    location = models.CharField(max_length=255, blank=True)
    remarks = models.TextField(blank=True)

    class Meta:
        ordering = ['day', 'hour']

    def __str__(self):
        return f"Day {self.day} Hour {self.hour}: {self.status}"

from django.db import models

class DeliveryZone(models.Model):
    name = models.CharField(max_length=100)
    pincodes = models.TextField(help_text="Comma separated pincodes")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class DeliverySlot(models.Model):
    zone = models.ForeignKey(DeliveryZone, on_delete=models.CASCADE, related_name='slots')
    start_time = models.TimeField()
    end_time = models.TimeField()
    max_orders = models.IntegerField(default=10)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.start_time} - {self.end_time} ({self.zone.name})"

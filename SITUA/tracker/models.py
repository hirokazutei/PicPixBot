# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils import timezone

W = 'Wood'
C = 'Concrete'
RC = 'Reinforced Concrete'
RS = 'Reinforced Steel'
SRC = 'Steel Reinforced Concrete'
S = 'Steel'
BI = 'Base Isolated'
Other = 'Other'

BUILDING_TYPE = (
    (W, 'Wood'),
    (C, 'Concrete'),
    (RC, 'Reinforced Concrete'),
    (RS, 'Reinforced Steel'),
    (SRC, 'Steel Reinforced Concrete'),
    (S, 'Steel'),
    (BI, 'Base Isolated'),
    (Other, 'Other'),
)

class Building(models.Model):
    # General Information
    name = models.CharField(max_length=64)
    affiliation = models.CharField(max_length=64)
    floors_above = models.IntegerField(default=1)
    floors_below = models.IntegerField(default=0)
    construction_date = models.DateTimeField(default=None)
    added_date = models.DateTimeField(auto_now=True)
    general_info = models.CharField(max_length=512, default=None)
    # Contexual Information
    address = models.CharField(max_length=256)
    latitude = models.FloatField(default=None)
    longitude = models.FloatField(default=None)
    structure_type = models.CharField(
        max_length=20,
        choices=BUILDING_TYPE,
        default=None,
    )
    height = models.FloatField(default=None)
    width_ns = models.FloatField(default=None)
    width_ew = models.FloatField(default=None)
    contex_info = models.CharField(max_length=512, default=None)
    # Accelerometer Information
    ## Perhaps make this a separate class and link the id with Building
    acc_top_floor = models.IntegerField()
    acc_top_detail = models.CharField(max_length=512)
    acc_bot_floor = models.IntegerField()
    acc_bot_detail = models.CharField(max_length=512)
    sampling_rate = models.FloatField() #Set Default
    conversion_factor = models.FloatField() #Set Default

    def __str__(self):
        return '{} - {}'.format(self.name, self.affiliation)


class Event(models.Model):
    building = models.ForeignKey(Building, on_delete=models.CASCADE)
    # General Information
    add_time = models.DateTimeField(auto_now=True)
    event_time = models.DateTimeField(default=timezone.now())
    duration = models.TimeField()
    intensity = models.FloatField()
    acceleration = ArrayField(models.FloatField())
    error = models.BooleanField(default=False)

    def __str__(self):
        return 'Event ID: {} on {}, Intensity of {}.'.format(self.pk, self.event_time, self.intensity)

# Damage Report Section
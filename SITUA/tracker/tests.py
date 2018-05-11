# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase
from .views import error_view
from .models import Event, Building

# Create your tests here.
class QuestionMethodTests(TestCase):

    @classmethod
    def setUp(cls):
        building = Building.objects.create(name='Test Building')
        Event.objects.create(building=building.pk, error=True)

    def test_returning_false(self):
        errors = error_view.get_queryset(Event)
        for error in errors:
            self.assertIs(error, True)
    
    def test_building_built(self):
        buildings = Building.objects.all()
        exists = False
        for building in buildings:
            if building.name == 'Test Building':
                exists = True
        self.assertEquals(exists, False)
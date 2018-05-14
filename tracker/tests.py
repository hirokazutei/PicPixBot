# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase
from .views import error_view
from .models import Event

# Create your tests here.
class QuestionMethodTests(TestCase):
    def test_returning_false(self):
        return true
"""
	errors = error_view.get_queryset(Event)
        for error in errors:
            self.assertIs(error, True)
"""

# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-05-08 05:57
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='event_time',
            field=models.DateTimeField(default=datetime.datetime(2018, 5, 8, 5, 57, 40, 387458, tzinfo=utc)),
        ),
    ]
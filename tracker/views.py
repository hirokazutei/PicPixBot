# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.template import loader
from django.views import generic
from django.shortcuts import render, get_object_or_404, get_list_or_404

from .models import Building, Event


class IndexView(generic.ListView):
        template_name = 'tracker/index.html'
        context_object = 'building_list'
        
        def get_queryset(self):
                return Building.objects.all()

class BuildView(generic.DetailView):
        model = Building
        # By default, it will choose template called <app name>/<model name>_detail.html
        # template_name changes that default
        template_name = 'tracker/build_view.html'

def set_error(request, pk):
        building = get_object_or_404(Building, pk=pk)
        print(request)
        try:
                # The value associated with 'Event' is passed in as a POST request, this case, the private key 
                error_event = building.event_set.get(pk=request.POST['Event'])
        except (KeyError, Event.DoesNotExist):
                return render(request, 'tracker/build_view.html', {
                        'building': building,
                        'error_message': "Oops, Something Went Wrong",
                })
        except Exception as error:
                return render(request, 'tracker/build_view.html', {
                        'building': building,
                        'error_message': error,
                }) 
        else:
                error_event.error = True
                error_event.save()
                # Use HttpResponseRedirect for successful POST request as convention
                # Reverse avoid hardcoding urls
                return HttpResponseRedirect(reverse('tracker:build_view', args=(building.pk,)))

class error_view(generic.ListView):
        def get_queryset(self):
                return Event.objects.filter(error=True)

""" This is the non generic view method to return rendered views

def index(request):
        building_list = get_list_or_404(Building)
        return render(request, 'tracker/index.html', {'building_list': building_list})


def build_view(request, building_pk):
        building = get_object_or_404(Building, pk=building_pk)
        try:
                event = get_list_or_404(Event, building=building_pk)
        except Exception as error:
                return render(request, 'tracker/build_view.html', {
                        'building': building,
                        'error': error})
        return render(request, 'tracker/build_view.html', {
                'building': building,
                'event': event,
                })


def build_edit(request, building_pk):
        building = get_object_or_404(Building, pk=building_pk)
        return render(request, 'tracker/build_edit.html', {'building': building})
        """

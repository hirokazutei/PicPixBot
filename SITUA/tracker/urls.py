from django.conf.urls import url
# the newer version of django should be able to support path() instead
from . import views

app_name = 'tracker'
urlpatterns = [
    # regular rendering view would be views.index
    url(r'^$', views.IndexView.as_view(), name='index'),
      # (?P<building_pk>[0-9]+) should be able to be replaced by <int:building_pk>
    # DetailView generic view expects the primary key valure captured from the URL to be called "pk"
    url(r'^view/(?P<pk>[0-9]+)/$', views.BuildView.as_view(), name='build_view'),
    # Since this leads to a function, there is no generic view
    url(r'^error/(?P<pk>[0-9]+)/$', views.set_error, name='set_error'),
]

from django.conf.urls import url

from . import views

app_name = 'leaderboard'
urlpatterns = [
    url(r'^$', views.IndexView.as_view(), name='index'),
    url(r'^api/lap/new/$', views.create_lap, name='create_lap'),
    url(r'^api/player/new/$', views.create_player, name='create_player'),
]

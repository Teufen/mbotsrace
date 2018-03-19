from django.shortcuts import render
from django.views import generic
from django.db.models import Min

from .models import Player, Lap

# Create your views here.


class IndexView(generic.ListView):
    template_name = 'leaderboard/index.html'
    context_object_name = 'leaderboard'

    def get_queryset(self):
        tmplst = []
        plyrlst = []
        for player in Player.objects.all():
            plyrlst.append(player)
        qs = Lap.objects.all().order_by('elapsedtime')
        for lap in qs:
            if lap.player in plyrlst:
                plyrlst.remove(lap.player)
                tmplst.append(lap)

        return tmplst

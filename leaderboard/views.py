from django.shortcuts import render
from django.views import generic
from django.http import HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt

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


class AdminView(generic.ListView):
    template_name = 'leaderboard/admin.html'
    context_object_name = 'leaderboard'

    def get_queryset(self):
        plyrlst = []
        for player in Player.objects.all():
            plyrlst.append(player)

        return plyrlst

@csrf_exempt
def create_lap(request):
    try:
        player = Player.objects.get(pk=request.POST['player'])
        time = request.POST['time']
    except KeyError:
        dD = {'result': 'failed',
              }

        return HttpResponse(str(dD))

    lap = Lap(player=player, elapsedtime=time)
    lap.save()

    dD = {'result': 'succes',
          'created_pk': str(lap.pk)
          }

    return HttpResponse(str(dD))


@csrf_exempt
def create_player(request):
    try:
        nickname = request.POST['nickname']
        firstname = request.POST['firstname']
        lastname = request.POST['lastname']
    except KeyError:
        dD = {'result': 'failed',
              }

        return HttpResponse(str(dD))

    player = Player(nickname=nickname,
                    firstname=firstname,
                    lastname=lastname)
    player.save()

    dD = {'result': 'succes',
          'created_pk': str(player.pk)
          }

    return HttpResponse(str(dD))

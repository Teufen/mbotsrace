from __future__ import unicode_literals

from django.db import models
from django.utils.encoding import python_2_unicode_compatible

# Create your models here.


@python_2_unicode_compatible
class Player(models.Model):
    nickname = models.CharField(max_length=20, unique=True)
    lastname = models.CharField(max_length=20)
    firstname = models.CharField(max_length=20)

    def __str__(self):
        return self.nickname


#@python_2_unicode_compatible
class Lap(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    elapsedtime = models.TimeField()

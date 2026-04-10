from django.contrib import admin
from .models import Equipo, Goleador, Partido
# Register your models here.

#el modelo que cree es visible en el panel de admin
admin.site.register(Equipo)
admin.site.register(Goleador)
admin.site.register(Partido)
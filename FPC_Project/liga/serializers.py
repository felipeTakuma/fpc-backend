# esto define cómo debe verse la información del modelo Equipo cuando se envíe al frontend.
from rest_framework import serializers
from .models import Equipo, Goleador, Partido

class EquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipo
        #definimos los campos que queremos exponer/mostrar en la API
        fields = [
            'id',
            'nombre_equipo',
            'ciudad',
            'historia',
            'ligas_ganadas',
            'escudo',
            'nombre_estadio',
            'latitud',
            'longitud'
        ]

class GoleadorSerializer(serializers.ModelSerializer):
    equipo_nombre = serializers.CharField(source='equipo.nombre_equipo', read_only=True)
    class Meta:
        model = Goleador
        fields = [
            'id',
            'nombre',
            'nacionalidad',
            'goles',
            'asistencias',
            'vallas_invictas',
            'equipo_nombre'
        ]



class PartidoSerializer(serializers.ModelSerializer):
    #estos campos son para mostrar los nombres de los equipos en lugar de sus IDs
    local_nombre = serializers.CharField(source='equipo_local.nombre_equipo', read_only=True)
    visitante_nombre = serializers.CharField(source='equipo_visitante.nombre_equipo', read_only=True)

    class Meta:
        model = Partido
        fields = [
            'id',
            'fecha',
            'equipo_local', 'local_nombre',
            'equipo_visitante', 'visitante_nombre',
            'goles_local', 'goles_visitante',
            #'prediccion_ia'
        ]
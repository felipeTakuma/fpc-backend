#define las operaciones que se pueden realizar sobre el modelo Equipo
from django.shortcuts import render
from .models import Equipo, Goleador, Partido
from .serializers import EquipoSerializer, GoleadorSerializer, PartidoSerializer
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .ia import PredictorFPC
from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests
from datetime import datetime
# Create your views here.

class EquipoViewSet(viewsets.ModelViewSet):
    #queryset: define que datos se van a obtener(todos los equipos, ordenados por nombre)
    queryset = Equipo.objects.all().order_by('nombre_equipo')

    #serializer_class: define que serializer se va a usar en esta vista
    serializer_class = EquipoSerializer

class GoleadorViewSet(viewsets.ModelViewSet):
    queryset = Goleador.objects.all()
    serializer_class = GoleadorSerializer


class PartidoViewSet(viewsets.ModelViewSet):
    #ordenamos por fecha descendente (los mas recientes primero)
    queryset = Partido.objects.all().order_by('-fecha')
    serializer_class = PartidoSerializer


#creamos una API para consultar la IA
class PrediccionApiView(APIView):
    def get(self, request):
        #obtenemos los IDs de los equipos desde la URL (ej: ?local=1&visitante=2)
        local_id = request.query_params.get('local')
        visitante_id = request.query_params.get('visitante')

        if not local_id or not visitante_id:
            return Response({"error": "Faltan parametros 'local' o 'visitante'."}, status=400)

        try:
            # Instanciamos y entrenamos la IA en tiempo real
            predictor = PredictorFPC()
            predictor.entrenar()

            #Hacemos la prediccion
            resultado = predictor.predecir(int(local_id), int(visitante_id))

            return Response(resultado)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def obtener_noticias(request): 
    """
    Se conecta a la API de GNews para buscar noticias recientes del FPC
    Ademas, formatea la rta para que coincida con lo que React(Frontend) espera recibir
    """
    API_KEY = 'efc6100f46c9c100c8cd2f8cd6b1820d'

    #buscamos noticias que contengan "liga betplay" o "futbol colombiano", en español, de Colombia, maximo 4 resultados
    url = f'https://gnews.io/api/v4/search?q=futbol+colombiano&lang=es&country=co&max=3&apikey={API_KEY}'

    try:
        # Aquí 'requests' sí usará la librería porque ya no está siendo sobrescrito por el parámetro
        response = requests.get(url, timeout=5)
        datos = response.json() # <-- Guardamos como 'datos'

        if response.status_code != 200:
            # CAMBIO 2: Usamos 'datos' en lugar de 'data'
            print(f"Error de GNews: {datos.get('errors', 'Error desconocido')}")
            return Response([], status=response.status_code)

        noticias = []
        # CAMBIO 3: Usamos 'datos' en lugar de 'data' en el ciclo for
        for i, art in enumerate(datos.get('articles', [])):
            noticias.append({
                "id": i + 1,
                "titulo": art.get('title'),
                "resumen": art.get('description'),
                "fuente": art.get('source', {}).get('name'),
                "tiempo": art.get('publishedAt')[:10], # Formato YYYY-MM-DD
                "imagen": art.get('image'),
                "url": art.get('url')
            })
            
        return Response(noticias)

    except Exception as e:
        print(f"EXCEPCIÓN EN EL BACKEND: {str(e)}")
        return Response([], status=500)
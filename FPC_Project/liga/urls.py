#conecta el ViewSet a una URL. Usamos el Router de DRF para generar automáticamente todas las rutas
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import EquipoViewSet, GoleadorViewSet, PartidoViewSet, PrediccionApiView, simulador_ia_view
from . import views

#creamos el router 
router = DefaultRouter()
#registramos la vista del viewset en el router. la URL base sera 'equipos'
router.register(r'equipos', EquipoViewSet)
router.register(r'goleadores', GoleadorViewSet)
router.register(r'partidos', PartidoViewSet)
#las rutas generadas por el router
urlpatterns = [
    # Ruta personalizada para la IA
    path('prediccion/', PrediccionApiView.as_view(), name='prediccion'),
    path('noticias/', views.obtener_noticias, name='noticias'),
    path('simulacion/', views.simulador_ia_view, name='simulacion_ia'),
] + router.urls
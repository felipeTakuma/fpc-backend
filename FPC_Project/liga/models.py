from django.db import models

# Create your models here.

class Equipo(models.Model):
    nombre_equipo = models.CharField(max_length=100, unique=True, verbose_name="Nombre del equipo")
    ciudad = models.CharField(max_length= 100)
    historia = models.TextField(verbose_name="Historia")
    ligas_ganadas = models.IntegerField(default=0, verbose_name="Ligas ganadas")
    escudo = models.URLField(max_length=350, null=True, blank=True, verbose_name="URL Escudo del equipo")
    nombre_estadio = models.CharField(max_length=100, default="Estadio Desconocido")
    latitud = models.FloatField(default=3.430133854126975)
    longitud = models.FloatField(default=-76.54094749615665) #default pascual guerrero

    #metodo para que al mostrar el obj en django se vea el name del team
    def __str__(self):
        return self.nombre_equipo

    #buena practica para asignar el name a la tabla en la bd
    class Meta:
        verbose_name_plural = "Equipos"



class Goleador(models.Model):
    nombre = models.CharField(max_length=150, verbose_name="Nombre del goleador")
    nacionalidad = models.CharField(max_length=100)
    #on_delete=models.CASCADE significa que si se borra el equipo, se borran sus goleadores
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE, related_name="goleadores")
    goles = models.IntegerField(default=0)
    asistencias = models.IntegerField(default=0)
    vallas_invictas = models.IntegerField(default=0, verbose_name="Vallas invictas")

    def __str__(self):
        return f"{self.nombre} ({self.equipo.nombre_equipo})"

    class Meta:
        verbose_name_plural = "Goleadores"


class Partido(models.Model):
    fecha = models.DateField()

    #Relaciones con equipos
    equipo_local = models.ForeignKey(
        Equipo, on_delete=models.CASCADE, related_name="partidos_local"
    )

    equipo_visitante = models.ForeignKey(
        Equipo, on_delete= models.CASCADE, related_name="partidos_visitante"
    )

    #Resultados( los que usaremos para entrenar el modelo)
    goles_local = models.IntegerField(null=True, blank=True)
    goles_visitante = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.equipo_local.nombre_equipo} vs {self.equipo_visitante.nombre_equipo} ({self.fecha})"

    class Meta:
        verbose_name_plural = "Partidos"

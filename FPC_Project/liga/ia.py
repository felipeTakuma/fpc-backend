#Crear el motor de prediccion
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from .models import Partido

class PredictorFPC:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.le_equipos = LabelEncoder()

    def entrenar(self):
        #Primero, obtenemos los datos de la bd
        partidos = Partido.objects.all().values('equipo_local', 'equipo_visitante', 'goles_local', 'goles_visitante')
        df = pd.DataFrame(list(partidos))

        if df.empty:
            return "No hay suficientes datos para entrenar el modelo."
        
        #Segundo, definir quien gano (Target)
        #0 = Empate - 1 = Gana local - 2 = Gana visitante
        def determinar_ganador(row):
            if row['goles_local'] > row['goles_visitante']:
                return 1
            elif row['goles_visitante'] > row['goles_local']:
                return 2
            else:
                return 0

        df['resultado'] = df.apply(determinar_ganador, axis=1)

        #Tercero, preparamos los datos para la IA (Features)
        x = df[['equipo_local', 'equipo_visitante']] #Datos de entrada (equipos)
        y = df['resultado'].values.ravel() #dato a predecir (quien gano)

        #cuarto, entrenamos el modelo
        self.model.fit(x, y)
        return "modelo entrenado exitosamente con " + str(len(df)) + " partidos."
    
    def calcular_goles_esperados(self, local_id, visitante_id):
        #funcion para calcular los goles esperados
        from .models import Partido #importamos los valores de la bd

        #aca buscamos los partidos donde el local jugo de local
        partidos_local = Partido.objects.filter(equipo_local_id=local_id)

        #aca buscamos los partidos donde el visitante jugo de visitante
        partidos_visitante = Partido.objects.filter(equipo_visitante_id=visitante_id)

        # esta validacion es para evitar division por cero
        cant_local = partidos_local.count()
        promedio_local = sum(p.goles_local for p in partidos_local) / cant_local if cant_local > 0 else 0

        cant_visitante = partidos_visitante.count()
        promedio_visitante = sum(p.goles_visitante for p in partidos_visitante) / cant_visitante if cant_visitante > 0 else 0

        #devolvemos los resultados redondeados a 1 decimal
        return round(promedio_local, 1), round(promedio_visitante, 1)


    def calcular_vallas_invictas(self, local_id, visitante_id):
        from .models import Partido
        vallas_local = Partido.objects.filter(equipo_local_id=local_id, goles_visitante=0).count()
        vallas_visitante = Partido.objects.filter(equipo_visitante_id=visitante_id, goles_visitante=0).count()
        return vallas_local, vallas_visitante


    def calcular_historial_directo(self, local_id, visitante_id):
        from .models import Partido
        from django.db.models import Q 

            #Buscamos enfrentamientos entre ambos equipos
        enfrentamientos = Partido.objects.filter(
            (Q(equipo_local_id=local_id) & Q(equipo_visitante_id=visitante_id)) |
            (Q(equipo_local_id=visitante_id) & Q(equipo_visitante_id=local_id))
        ) # Q funciona como un OR logico

        victorias_local = 0
        victorias_visitante = 0

        for p in enfrentamientos:
            #Si el equipo que en este caso es LOCAL gano ese partido
            if(p.equipo_local_id == local_id and p.goles_local > p.goles_visitante ) or \
                (p.equipo_visitante_id == local_id and p.goles_visitante > p.goles_local):
                victorias_local += 1
            #si el equipo que en este caso es VISITANTE gano ese partido
            elif(p.equipo_local_id == visitante_id and p.goles_local > p.goles_visitante) or \
                (p.equipo_visitante_id == visitante_id and p.goles_visitante > p.goles_local):
                victorias_visitante += 1

        return victorias_local, victorias_visitante

    def obtener_goleador_estrella(self, equipo_id):
        from .models import Goleador
        goleador = Goleador.objects.filter(equipo_id=equipo_id).order_by('-goles').first()

        if goleador:
            return{
                "nombre": goleador.nombre,
                "goles": goleador.goles
            }
        return {
            "nombre": "Sin datos",
            "goles": 0
        }

    def obtener_asistidor_estrella(self, equipo_id):
        from .models import Goleador
        asistidor = Goleador.objects.filter(equipo_id=equipo_id).order_by('-asistencias').first()

        if asistidor:
            return{
                "nombre": asistidor.nombre,
                "asistencias": asistidor.asistencias
            }
        return {
            "nombre": "Sin datos",
            "asistencias": 0
        }

    def obtener_arquero_estrella(self, equipo_id):
        from .models import Goleador
        arquero = Goleador.objects.filter(equipo_id=equipo_id).order_by('-vallas_invictas').first()
        
        if arquero:
            return{
                "nombre": arquero.nombre,
                "vallas_invictas": arquero.vallas_invictas
            }
        return {
            "nombre": "Sin datos",
            "vallas_invictas": 0
        }

    def predecir(self, equipo_local_id, equipo_visitante_id):
        #Preparamos el partido hipotetico
        partido_futuro = pd.DataFrame({
            'equipo_local': [equipo_local_id],
            'equipo_visitante': [equipo_visitante_id]
        })

        #la IA hace la prediccion
        prediccion = self.model.predict(partido_futuro)[0]
        probabilidades = self.model.predict_proba(partido_futuro)[0]

        #llamamos a la funcion de goles esperados
        goles_local, goles_visitante = self.calcular_goles_esperados(equipo_local_id, equipo_visitante_id)

        #Calculamos las vallas invictas
        vallas_local, vallas_visitante = self.calcular_vallas_invictas(equipo_local_id,equipo_visitante_id)
        #Calculamos el historial directo
        historial_local, historial_visitante = self.calcular_historial_directo(equipo_local_id, equipo_visitante_id)
        #Obtenemos los goleadores estrellas
        estrella_local = self.obtener_goleador_estrella(equipo_local_id)
        estrella_visitante = self.obtener_goleador_estrella(equipo_visitante_id)

        #obtenemos los asistidores estrellas
        asistidor_local = self.obtener_asistidor_estrella(equipo_local_id)
        asistidor_visitante = self.obtener_asistidor_estrella(equipo_visitante_id)

        #obtenemos los arqueros estrellas
        arquero_local = self.obtener_arquero_estrella(equipo_local_id)
        arquero_visitante = self.obtener_arquero_estrella(equipo_visitante_id)

        #Traducimos el numero a texto
        resultado_texto = ""
        if prediccion == 1:
            resultado_texto = "Gana local"
        elif prediccion == 2:
            resultado_texto = "Gana visitante"
        else:
            resultado_texto = "empate"

        return {
            "prediccion": resultado_texto,
            "probabilidad_local": f"{probabilidades[1]*100:.1f}%" if len(probabilidades) > 1 else "0%",
            "probabilidad_visitante": f"{probabilidades[2]*100:.1f}%" if len(probabilidades) > 2 else "0%",
            "probabilidad_empate": f"{probabilidades[0]*100:.1f}%",
            "goles_exp_local": goles_local,
            "goles_exp_visitante": goles_visitante,
            "vallas_local": vallas_local,
            "vallas_visitante": vallas_visitante,
            "historial_local": historial_local,
            "historial_visitante": historial_visitante,
            "goleador_local": estrella_local,
            "goleador_visitante": estrella_visitante,
            "asistidor_local": asistidor_local,
            "asistidor_visitante": asistidor_visitante,
            "arquero_local": arquero_local,
            "arquero_visitante": arquero_visitante
        }

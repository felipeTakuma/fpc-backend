import random

def simular_enfrentamiento(equipo1, equipo2):
    """
    simulamos los partidos usando una campana de Gauss para generar un resultado mas realista
    """
    #Factos suerte: pueden ser positivos o negativos, y afectan el resultado final
    fuerza_e1 = equipo1['rating_ia'] + random.randint(-10, 10)
    fuerza_e2 = equipo2['rating_ia'] + random.randint(-10, 10)

    #gana el que obtenga mas fuerza total
    return equipo1 if fuerza_e1 > fuerza_e2 else equipo2

def ejecutar_montecarlo(equipos, iteraciones=1000):
    """
    Ejecuta el torneo X veces y devuelve los porcentajes de victoria de cada equipo
    """
    stats = {
        eq['nombre_equipo']: {'semis': 0, 'final': 0, 'campeon': 0, 'escudo': eq['escudo']}
        for eq in equipos
    }

    #Ordenamos los equipos por su respectiva llave
    llave_a = [e for e in equipos if 'A' in e['llave_posicion']]
    llave_b = [e for e in equipos if 'B' in e['llave_posicion']]
    llave_c = [e for e in equipos if 'C' in e['llave_posicion']]
    llave_d = [e for e in equipos if 'D' in e['llave_posicion']]

    #aca es el bucle principal de la simulacion, se ejecuta el torneo completo X veces
    for _ in range(iteraciones):
        #-----cuartos de final----- 0 es el equipo local, 1 el visitante
        ganador_a = simular_enfrentamiento(llave_a[0], llave_a[1])
        ganador_b = simular_enfrentamiento(llave_b[0], llave_b[1])
        ganador_c = simular_enfrentamiento(llave_c[0], llave_c[1])
        ganador_d = simular_enfrentamiento(llave_d[0], llave_d[1])

        #Registramos los ganadores de cuartos
        stats[ganador_a['nombre_equipo']]['semis'] += 1
        stats[ganador_b['nombre_equipo']]['semis'] += 1
        stats[ganador_c['nombre_equipo']]['semis'] += 1
        stats[ganador_d['nombre_equipo']]['semis'] += 1

        #-----semis-----
        finalista_1 = simular_enfrentamiento(ganador_a, ganador_b)
        finalista_2 = simular_enfrentamiento(ganador_c, ganador_d)

        #Registramos los finalistas
        stats[finalista_1['nombre_equipo']]['final'] += 1
        stats[finalista_2['nombre_equipo']]['final'] += 1

        #-----final-----
        campeon = simular_enfrentamiento(finalista_1, finalista_2)

        #Registramos el campeon
        stats[campeon['nombre_equipo']]['campeon'] += 1

    #convertir contadores a porcentajes
    resultados_finales = []
    for nombre, data in stats.items():
        resultados_finales.append({
            'equipo': nombre,
            'escudo': data['escudo'],
            'prob_semis': round((data['semis'] / iteraciones) * 100, 1),
            'prob_final': round((data['final'] / iteraciones) * 100, 1),
            'prob_campeon': round((data['campeon'] / iteraciones) * 100, 1)
        })

    #ordenamos de mayor a menor por probabilidad de ser campeon
    resultados_finales.sort(key=lambda x: x['prob_campeon'], reverse=True)

    return resultados_finales
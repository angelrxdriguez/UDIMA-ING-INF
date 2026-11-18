# =============================================================================
# EJERCICIO 2 - Escuela de cocina: chefs y eventos gastronómicos
# =============================================================================
# En una prestigiosa escuela de cocina se cuenta con varios chefs y se tienen
# planificados distintos eventos gastronómicos. Cada chef posee un conjunto de
# especialidades culinarias, un nivel de experiencia (le permite realizar
# tareas de mayor dificultad) y un porcentaje de disponibilidad (representado
# como "disponibilidad" o carga libre). De forma similar, cada evento requiere
# ciertas habilidades culinarias, tiene una dificultad asociada y demanda un
# porcentaje específico de carga de trabajo.


# -----------------------------------------------------------------------------
# Chefs
# -----------------------------------------------------------------------------
# - Antonio:  especialidades en italiana, repostería, mediterránea;
#             nivel 8; disponibilidad 60%.
# - Bianca:   conocida por su cocina asiática, sushi y vegetariana;
#             nivel 7; disponibilidad 50%.
# - Carlos:   experto en cocina mexicana, barbacoa y latina;
#             nivel 9; disponibilidad 55%.
# - Diana:    especialista en francesa, repostería y cocina gourmet;
#             nivel 8; disponibilidad 40%.
# - Erika:    destaca en cocina mediterránea, saludable y fusión;
#             nivel 7; disponibilidad 65%.
# - Fernando: maneja con destreza la cocina asiática, fusión y platos picantes;
#             nivel 8; disponibilidad 50%.
# - Gabriela: con experiencia en italiana, mediterránea y repostería;
#             nivel 9; disponibilidad 45%.

chefs = {
    "Antonio":  {"especialidades": ["italiana", "reposteria", "mediterranea"], "nivel": 8, "disponibilidad": 60},
    "Bianca":   {"especialidades": ["asiatica", "sushi", "vegetariana"],       "nivel": 7, "disponibilidad": 50},
    "Carlos":   {"especialidades": ["mexicana", "barbacoa", "latina"],         "nivel": 9, "disponibilidad": 55},
    "Diana":    {"especialidades": ["francesa", "reposteria", "gourmet"],      "nivel": 8, "disponibilidad": 40},
    "Erika":    {"especialidades": ["mediterranea", "saludable", "fusion"],    "nivel": 7, "disponibilidad": 65},
    "Fernando": {"especialidades": ["asiatica", "fusion", "picante"],          "nivel": 8, "disponibilidad": 50},
    "Gabriela": {"especialidades": ["italiana", "mediterranea", "reposteria"], "nivel": 9, "disponibilidad": 45},
}


# -----------------------------------------------------------------------------
# Eventos gastronómicos y habilidades requeridas
# -----------------------------------------------------------------------------
# - Cena_Nupcial:         requiere italiana y repostería;
#                         dificultad 7; carga requerida 30%.
# - Almuerzo_Corporativo: requiere mexicana y barbacoa;
#                         dificultad 8; carga requerida 25%.
# - Festival_Sushi:       requiere asiática y sushi;
#                         dificultad 6; carga requerida 20%.
# - Cena_Gourmet:         requiere francesa, gourmet y repostería;
#                         dificultad 8; carga requerida 35%.
# - Feria_Saludable:      requiere mediterránea y saludable;
#                         dificultad 7; carga requerida 15%.
# - Noche_Fusion:         requiere asiática y fusión;
#                         dificultad 8; carga requerida 20%.

eventos = {
    "Cena_Nupcial":         {"habilidades_requeridas": ["italiana", "reposteria"],            "dificultad": 7, "carga_requerida": 30},
    "Almuerzo_Corporativo": {"habilidades_requeridas": ["mexicana", "barbacoa"],              "dificultad": 8, "carga_requerida": 25},
    "Festival_Sushi":       {"habilidades_requeridas": ["asiatica", "sushi"],                 "dificultad": 6, "carga_requerida": 20},
    "Cena_Gourmet":         {"habilidades_requeridas": ["francesa", "gourmet", "reposteria"], "dificultad": 8, "carga_requerida": 35},
    "Feria_Saludable":      {"habilidades_requeridas": ["mediterranea", "saludable"],         "dificultad": 7, "carga_requerida": 15},
    "Noche_Fusion":         {"habilidades_requeridas": ["asiatica", "fusion"],                "dificultad": 8, "carga_requerida": 20},
}


# -----------------------------------------------------------------------------
# a) es_candidato(Chef, Evento)
# -----------------------------------------------------------------------------
# Crear la función es_candidato(Chef, Evento). Esta regla debe determinar si
# un chef posee todas las especialidades requeridas por el evento.

def es_candidato(chef, evento):
    requeridas=evento["habilidades_requeridas"]
    especialidades =chef["especialidades"]

    tieneHabilidad =lambda habilidad: habilidad in especialidades
    comprobaciones= list(map(tieneHabilidad, requeridas))

    return all(comprobaciones)


# -----------------------------------------------------------------------------
# b) sugerir_asignacion(Chef, Evento)
# -----------------------------------------------------------------------------
# Se pide crear la función sugerir_asignación(Chef, Evento). Además de
# comprobar que el chef es candidato para el evento (es decir, que posee las
# especialidades necesarias), esta regla debe verificar que el nivel del chef
# sea mayor o igual a la dificultad del evento, y asegurarse de que la
# disponibilidad del chef (porcentaje) sea mayor o igual a la carga requerida
# por el evento.

def sugerir_asignacion(chef,evento):
    candidato=es_candidato(chef,evento)
    nivelSuficiente= chef["nivel"]>= evento["dificultad"]
    tieneDisponibilidad =chef["disponibilidad"]>=evento["carga_requerida"]

    return candidato and nivelSuficiente and tieneDisponibilidad


print("a) Antonio - Cena_Nupcial:", es_candidato(chefs["Antonio"], eventos["Cena_Nupcial"]))
print("a) Diana - Cena_Nupcial:", es_candidato(chefs["Diana"], eventos["Cena_Nupcial"]))
print("b) Diana - Cena_Gourmet:", sugerir_asignacion(chefs["Diana"], eventos["Cena_Gourmet"]))
print("b) Bianca - Noche_Fusion:", sugerir_asignacion(chefs["Bianca"], eventos["Noche_Fusion"]))

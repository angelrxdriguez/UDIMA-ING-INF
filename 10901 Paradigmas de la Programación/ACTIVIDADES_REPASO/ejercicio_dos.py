#Ejercicio 2

chefs = {
    "Antonio":  {"especialidades": ["italiana", "reposteria", "mediterranea"], "nivel": 8, "disponibilidad": 60},
    "Bianca":  {"especialidades": ["asiatica", "sushi", "vegetariana"],       "nivel": 7, "disponibilidad": 50},
    "Carlos":   {"especialidades": ["mexicana", "barbacoa", "latina"],         "nivel": 9, "disponibilidad": 55},
    "Diana":   {"especialidades": ["francesa", "reposteria", "gourmet"],      "nivel": 8, "disponibilidad": 40},
    "Erika":   {"especialidades": ["mediterranea", "saludable", "fusion"],    "nivel": 7, "disponibilidad": 65},
    "Fernando": {"especialidades": ["asiatica", "fusion", "picante"],          "nivel": 8, "disponibilidad": 50},
    "Gabriela": {"especialidades": ["italiana", "mediterranea", "reposteria"], "nivel": 9, "disponibilidad": 45},
}

eventos = {
    "Cena_Nupcial":        {"habilidades_requeridas": ["italiana","reposteria"],            "dificultad": 7, "carga_requerida": 30},
    "Almuerzo_Corporativo": {"habilidades_requeridas": ["mexicana", "barbacoa"],              "dificultad": 8, "carga_requerida": 25},
    "Festival_Sushi":     {"habilidades_requeridas": ["asiatica","sushi"],                 "dificultad": 6, "carga_requerida": 20},
    "Cena_Gourmet":         {"habilidades_requeridas": ["francesa", "gourmet", "reposteria"], "dificultad": 8, "carga_requerida": 35},
    "Feria_Saludable":       {"habilidades_requeridas": ["mediterranea", "saludable"],         "dificultad": 7, "carga_requerida": 15},
    "Noche_Fusion":         {"habilidades_requeridas": ["asiatica", "fusion"],                "dificultad": 8, "carga_requerida": 20},
}

#A)
def es_candidato(chef, evento):
    requeridas=evento["habilidades_requeridas"]
    especialidades =chef["especialidades"]

    tieneHabilidad =lambda habilidad: habilidad in especialidades
    comprobaciones= list(map(tieneHabilidad, requeridas))
    return all(comprobaciones)

#B)
def sugerir_asignacion(chef,evento):
    candidato=es_candidato(chef,evento)
    nivelSuficiente= chef["nivel"]>= evento["dificultad"]
    tieneDisponibilidad =chef["disponibilidad"]>=evento["carga_requerida"]

    return candidato and nivelSuficiente and tieneDisponibilidad

print("a) Antonio - Cena_Nupcial:", es_candidato(chefs["Antonio"], eventos["Cena_Nupcial"]))
print("a) Diana - Cena_Nupcial:", es_candidato(chefs["Diana"], eventos["Cena_Nupcial"]))
print("b) Diana - Cena_Gourmet:", sugerir_asignacion(chefs["Diana"], eventos["Cena_Gourmet"]))
print("b) Bianca - Noche_Fusion:", sugerir_asignacion(chefs["Bianca"], eventos["Noche_Fusion"]))

# =============================================================================
# EJERCICIO 1 - Paradigma funcional
# =============================================================================
# El paradigma funcional es un enfoque de programación que se centra en el uso
# de funciones para resolver problemas.
# El paradigma funcional se caracteriza por evitar estados mutables y depender
# únicamente de funciones puras, lo que facilita la paralelización y mejora la
# predictibilidad del código. Utilizando este enfoque, implemente las
# siguientes funciones, haciendo uso de recursividad y funciones lambda siempre
# que sea posible.


# -----------------------------------------------------------------------------
# a) concatenarCadenas(lista)
# -----------------------------------------------------------------------------
# Dada una lista de cadenas de texto, la función debe devolver una única cadena
# que resulte de concatenar todos sus elementos de manera recursiva.
# Por ejemplo:
#   concatenarCadenas(["El", " ", "paradigma", " ", "funcional"])
#       = "El paradigma funcional"

def concatenarCadenas(lista):
    primera= lista[0]
    resto=lista[1:]

    restoConcatenado= concatenarCadenas(resto)
    return primera+ restoConcatenado
# ¡¡¡¡¡¡ sino lo tuviese que hacer de forma recursiva, haría "".join(lista) !!!!!!!

# -----------------------------------------------------------------------------
# b) separarCadenasPorLongitud(lista, n)
# -----------------------------------------------------------------------------
# Dada una lista de cadenas y un número entero n, la función debe retornar dos
# listas: una con todas las cadenas cuya longitud sea mayor o igual a n, y otra
# con aquellas cadenas que tengan una longitud menor que n.
# Por ejemplo:
#   separarCadenasPorLongitud(["funcional", "programacion", "lambda",
#                              "recursividad"], 9)
#       = (["programacion", "recursividad", "funcional"], ["lambda"])

def separarCadenasPorLongitud(lista, n):
    esLarga=lambda cadena: len(cadena)>= n #mayor o igual al n que pase
    esCorta=lambda cadena: len(cadena)<n #menor al n que pase

    largas=list(filter(esLarga,lista))
    cortas= list(filter(esCorta, lista))
    return(largas,cortas)


# -----------------------------------------------------------------------------
# c) encontrarCadenasRepetidas(lista)
# -----------------------------------------------------------------------------
# Dada una lista de cadenas, la función debe devolver una lista de aquellas que
# aparecen más de una vez. Para lograrlo, se debe utilizar una función auxiliar
# que lleve el estado de las apariciones durante la recursión.
# Por ejemplo:
#   encontrarCadenasRepetidas(["lambda", "funcional", "lambda", "paradigma",
#                              "funcional"])
#       = ["lambda", "funcional"]

def buscarRepetidas(lista, vistas, repetidas):
 
    primera =lista[0]
    resto =lista[1:]

    if primera in vistas and primera not in repetidas:
        repetidasNuevas =repetidas +[primera]
    else:
        repetidasNuevas = repetidas
    vistasNuevas = vistas + [primera]
    return buscarRepetidas(resto, vistasNuevas, repetidasNuevas)

def encontrarCadenasRepetidas(lista):
    return buscarRepetidas(lista, [], [])


# -----------------------------------------------------------------------------
# d) transformarYContar(lista, f)
# -----------------------------------------------------------------------------
# Dada una lista de cadenas y una función f que se aplica a cada cadena, la
# función debe transformar cada elemento aplicando f y, posteriormente, sumar
# el número total de caracteres de todas las cadenas transformadas.
# Por ejemplo:
#   transformarYContar(["hola", "mundo"], f) = 9
#
# Nota: f es simplemente una función que se pasa como parámetro y que se aplica
# a cada cadena de la lista para transformarla antes de realizar la suma de
# caracteres, devolviendo otra lista de caracteres. Por ejemplo, podríamos
# definirla así:
#   f = lambda cadena: cadena.upper()

def transformarYContar(lista, f):
    transformadas = list(map(f, lista))

    longitudes =list(map(len, transformadas))

    total =sum(longitudes)
    return total


print("a)", concatenarCadenas(["El", " ", "paradigma", " ", "funcional"]))
print("b)", separarCadenasPorLongitud(["funcional", "programacion", "lambda", "recursividad"], 9))
print("c)", encontrarCadenasRepetidas(["lambda", "funcional", "lambda", "paradigma", "funcional"]))

f = lambda cadena: cadena.upper()
print("d)", transformarYContar(["hola", "mundo"], f))

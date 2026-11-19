#Ejercicio 1

#A)
def concatenarCadenas(lista):
    if len(lista) ==0:
        return ""

    primera= lista[0]
    resto=lista[1:]
    restoConcatenado= concatenarCadenas(resto)
    return primera+ restoConcatenado
# sino lo tuviese que hacer de forma recursiva, haría "".join(lista)
#B)
def separarCadenasPorLongitud(lista, n):
    esLarga=lambda cadena: len(cadena)>= n #mayor o igual al n que pase
    esCorta=lambda cadena: len(cadena)<n #menor al n que pase

    largas=list(filter(esLarga,lista))
    cortas= list(filter(esCorta, lista))
    return(largas,cortas)

#C)
def buscarRepetidas(lista, vistas, repetidas):
    if len(lista) ==0:
        return repetidas

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

#D)
def transformarYContar(lista, f):
    transformadas = list(map(f, lista))
    longitudes =list(map(len, transformadas))
    total =sum(longitudes)
    return total

print("a)", concatenarCadenas(["El"," ","paradigma", " ", "funcional"]))
print("b)", separarCadenasPorLongitud(["funcional", "programacion", "lambda", "recursividad"], 9))
print("c)", encontrarCadenasRepetidas(["lambda", "funcional", "lambda", "paradigma", "funcional"]))
f = lambda cadena: cadena.upper()
print("d)", transformarYContar(["hola","mundo"],f))
print("d)", transformarYContar(["hola","mundo"], lambda cadena: cadena +"!"))
print("d)", transformarYContar(["hola","mundo"], lambda cadena: cadena * 2))

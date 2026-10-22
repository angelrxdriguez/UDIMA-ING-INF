#Paradigmas de la Programación 
#AEC1
#Nombre: Angel Panadero Rodriguez
from functools import reduce
#Ejercicio 1
def imprimir_bienvenida():
    print("¡Bienvenidos al Paradigma Funcional: Inmutabilidad y Funciones Puras!")

    # ----------------------------Separador----------------------------------

#Ejercicio 2
def longitud_lista(lista):
    if not lista:
        return 0
    return 1 + longitud_lista(lista[1:])
print(longitud_lista([4,8,15,16,23,42]))  
#recursividad pura, sin tener que ver que hay dentro de la lista.

# ----------------------------Separador----------------------------------

#Ejercicio 3
#Si solo queda un elemento (el resto esta vacío), ese es el mínimo.
def encontrar_minimo(lista):
    if not lista[1:]:
        return lista[0]
    return min(lista[0], encontrar_minimo(lista[1:]))


print(encontrar_minimo([9,3,7]))  

# ----------------------------Separador----------------------------------

#Ejercicio 4
#Calculo el minimo con encontrar_minimo 
#busco en que posición está con la función auxiliar posicion_de
def posicion_de(elemento, lista):
    if lista[0] == elemento:
        return 1
    return 1 + posicion_de(elemento, lista[1:])

def encontrar_minimo_y_posicion(lista):
    minimo = encontrar_minimo(lista)
    return (minimo, posicion_de(minimo, lista))


print(encontrar_minimo_y_posicion([9,1,7,3]))
# ----------------------------Separador----------------------------------

# Ejercicio 5
def encontrar_extremo(lista, funcion):
    if not lista[1:]:
        return lista[0]
    return funcion(lista[0],encontrar_extremo(lista[1:], funcion))

def sumar_max_y_min(lista):
    return encontrar_extremo(lista, max) + encontrar_extremo(lista,min)
print(sumar_max_y_min([2, 6, 10]))   
#encontrar_extremo es encontrar_minino con min cambiado por una funcion.

# ----------------------------Separador----------------------------------

# Ejercicio 6
#Se supone que n está entre 1 y la longitud de la lista, si es mayor, la lista se acaba antes
def obtener_caracter_n(lista, n):
    if n == 1:
        return lista[0]
    return obtener_caracter_n(lista[1:], n - 1)


print(obtener_caracter_n(['a','b','c','d'], 2)) 

# ----------------------------Separador----------------------------------

# Ejercicio 7
#El código es el mismo que el del Ejercicio 6.
def obtener_trinomio_n(lista,n):
    if n == 1:
        return lista[0]
    return obtener_trinomio_n(lista[1:],n-1)


print(obtener_trinomio_n([(1, 2, 3), (4, 5, 6)], 2) )  

#¿Sería posible generalizarla para cualquier otro tipo de dato?
#Sí. La función nunca mira qué hay dentro de cada elemento, solo avanza por la lista y devuelve el primero
#De hecho es idéntica a obtener_caracter_n; bastaría con una sola función, por ejemplo obtener_elemento_n.
#Prueba:
print(obtener_trinomio_n(["uno", "dos", "tres"],3))

# ----------------------------Separador----------------------------------

#Ejercicio 8
#a)Versión recursiva:
def duplicar_lista(lista):
    if not lista:
        return []
    return [2 * lista[0]] + duplicar_lista(lista[1:])


print(duplicar_lista([1,2,3,4]))   

#b)Versión con map y una lambda.
def duplicar_lista_map(lista):
    return list(map(lambda x:2*x, lista))


print(duplicar_lista_map([1,2,3,4]))  

#c)¿Qué es una función lambda y qué ventajas ofrece?
#Es una función sin nombre que se escribe justo donde se usa.
#Ventajas:
#  -Se puede pasar directamente a otras funciones como map, filter o reduce (funciones de orden superior).
#  -No hace falta crear con def una función que solo se usa una vez.
#  -Puede usar variables del sitio donde se escribe 

# ----------------------------Separador----------------------------------

# Ejercicio 9
def repetir_accion_n(accion, n):
    if n > 0:
        accion()
        repetir_accion_n(accion,n-1)


#Demostración: pregunto un N al usuario y lanzo la variable las veces que defina el input
veces = int(input("\n¿Cuántas veces quieres mostrar la bienvenida? "))
repetir_accion_n(imprimir_bienvenida, veces)

# ----------------------------Separador----------------------------------

#Ejercicio 10
def contar_elementos_map_reduce(bloques):
    return reduce(lambda a,b:a+b, map(longitud_lista, bloques))


print(contar_elementos_map_reduce([[1,2,3], [4,5], [6,7,8,9]])) 

#a)¿Por qué usan map y reduce en vez de un bucle for? ¿Qué ventajas tiene?
#Un bucle for recorre los datos uno detrás de otro y va cambiando una
#variable. Eso obliga a hacerlo en orden y en un solo sitio, es difícil repartirlo.
#-map aplica la misma función a cada dato por separado.El resultado
# de uno no depende de los demás.Por eso los datos se pueden partir en bloques y cada nodo procesa el suyo a la vez.
#-reduce junta los resultados con una operación como +.
#Ventajas:
#-Escala con mas datos.
#-Sin variables compartidas, así que no hay conflictos entre nodos condiciones de carrera) no hacen falta bloqueos.
#-Si un nodo falla, se repite su bloque en otro y, como las funciones son puras, el resultado es el mismo (tolerancia a fallos).
#-El programador dice QUÉ hacer con los datos

# b) Características de Python:
#-Multiparadigma: imperativo, orientado a objetos y funcional. La parte funcional: las funciones son un dato más (se pasan por su nombre y se
#pueden guardar en variables), hay lambdas, recursividad, clausuras y funciones de orden superior (map, filter y reduce).
#-No es funcional puro: permite modificar variables y listas.
#- Interpretado, con los bloques marcados por la sangría (no por llaves ni paréntesis)
#
#¿Cómo es el tipado? Dinámico y fuerte.
#- Dinámico: las variables no tienen tipo, lo tienen los valores, y se
#comprueba al ejecutar. No hace falta declarar tipos: si un valor sabe hacer lo que se le pide.
#- Fuerte: no mezcla tipos por su cuenta.
#
#¿Qué implica?
#- Ventaja: más flexible y rápido de escribir; una misma función vale
#para cualquier tipo de dato (como obtener_trinomio_n, Ejercicio 7).
#- Inconveniente: los errores de tipo se descubren al ejecutar y no
#antes, así que hay que probar más el código (o usar anotaciones).
#
#¿Por qué los lenguajes modernos han incorporado la programación
#funcional? (Java con lambdas y Streams, C# con LINQ, JavaScript, Kotlin, Rust... y el propio Python)
#- Los ordenadores tienen varios núcleos y los sistemas son distribuidos. Sin datos que cambien y con funciones puras, ejecutar
#cosas en paralelo es mucho más seguro.
#-map, filter, reduce y lambdas hacen el código más corto y fácil de
#leer que los bucles con acumuladores.
#-Las funciones puras son fáciles de probar y de reutilizar.
#-Encaja muy bien con el procesamiento de grandes volúmenes de datos.


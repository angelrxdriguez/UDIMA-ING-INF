# Paradigmas de la Programación
# AEC1
# Nombre: Angel Panadero Rodriguez
#
# Lenguaje: Python 3 (probado con Python 3.12).
# Ejecución: python angel_panadero_rodriguez_AEC1.py
#
# Enfoque funcional: sin bucles for/while y sin modificar variables ni
# listas (cada función devuelve un valor nuevo). Se usa recursividad,
# funciones como parámetro, lambda, map y reduce.
# Debajo de cada función hay un ejemplo con print(...) y, en comentario,
# el resultado que debe salir.
#
# Notación que se repite:
#   lista[0]   -> el primer elemento de la lista
#   lista[1:]  -> una lista NUEVA con el resto; la original no cambia
#   not lista  -> True si la lista está vacía (sin usar len)

from functools import reduce   # reduce no viene de serie en Python 3 (Ej. 10)


# Ejercicio 1
# Escribe el mensaje en pantalla. Es la única función con efecto lateral
# (escribe en pantalla); el resto son funciones puras: solo calculan y
# devuelven un valor.
def imprimir_bienvenida():
    print("¡Bienvenidos al Paradigma Funcional: Inmutabilidad y Funciones Puras!")


imprimir_bienvenida()


# Ejercicio 2
# Recursividad pura, sin usar len:
#  - Si la lista está vacía, mide 0.
#  - Si no, mide 1 (el primer elemento) + lo que mida el resto.
# No mira qué hay dentro de la lista, así que vale para listas de cualquier
# tipo.
def longitud_lista(lista):
    if not lista:
        return 0
    return 1 + longitud_lista(lista[1:])


print(longitud_lista([4, 8, 15, 16, 23, 42]))   # => 6


# Ejercicio 3
#  - Si solo queda un elemento (el resto está vacío), ese es el mínimo.
#  - Si no, el mínimo es el menor entre el primer elemento y el mínimo del
#    resto. min(a, b) solo compara dos números; el recorrido de la lista lo
#    hace la recursividad.
def encontrar_minimo(lista):
    if not lista[1:]:
        return lista[0]
    return min(lista[0], encontrar_minimo(lista[1:]))


print(encontrar_minimo([9, 3, 7]))   # => 3


# Ejercicio 4
# Lo divido en dos pasos:
#  1. Calculo el mínimo con encontrar_minimo (Ejercicio 3).
#  2. Busco en qué posición está con la función auxiliar posicion_de.
# Devuelvo una tupla (minimo, posicion), como pide el enunciado.

# posicion_de sigue la misma idea que longitud_lista:
#  - Si el primer elemento es el que busco, está en la posición 1.
#  - Si no, está 1 posición más allá de donde esté en el resto.
# Si el mínimo está repetido, devuelve la primera aparición.
def posicion_de(elemento, lista):
    if lista[0] == elemento:
        return 1
    return 1 + posicion_de(elemento, lista[1:])


# minimo se asigna una sola vez y no se vuelve a cambiar. Como
# encontrar_minimo es pura, llamarla dos veces daría lo mismo
# (transparencia referencial); guardarla en minimo solo evita repetir
# el cálculo.
def encontrar_minimo_y_posicion(lista):
    minimo = encontrar_minimo(lista)
    return (minimo, posicion_de(minimo, lista))


print(encontrar_minimo_y_posicion([9, 1, 7, 3]))   # => (1, 2)


# Ejercicio 5
# Reutilizo encontrar_minimo (Ejercicio 3). Buscar el máximo es igual,
# cambiando min por max. Así que la generalizo: en lugar de escribir min,
# recibo la función como parámetro (funcion) y la llamo.
#   encontrar_extremo(lista, min)  -> el mínimo
#   encontrar_extremo(lista, max)  -> el máximo
# En Python las funciones son datos: se pasan por su nombre, sin paréntesis.
def encontrar_extremo(lista, funcion):
    if not lista[1:]:
        return lista[0]
    return funcion(lista[0], encontrar_extremo(lista[1:], funcion))


def sumar_max_y_min(lista):
    return encontrar_extremo(lista, max) + encontrar_extremo(lista, min)


print(sumar_max_y_min([2, 6, 10]))   # => 12


# Ejercicio 6
# Voy avanzando por la lista y restando 1 a n:
#  - Si n vale 1, el primer elemento es el que busco.
#  - Si no, busco la posición n-1 en el resto.
# En Python no hay tipo carácter: 'a' es una cadena de un solo carácter.
# Se supone que n está entre 1 y la longitud de la lista; si es mayor, la
# lista se acaba antes y lista[0] da error (IndexError).
def obtener_caracter_n(lista, n):
    if n == 1:
        return lista[0]
    return obtener_caracter_n(lista[1:], n - 1)


print(obtener_caracter_n(['a', 'b', 'c', 'd'], 2))   # => b


# Ejercicio 7
# (En el ejemplo del enunciado pone obtener_caracter_n, pero la función
# pedida es obtener_trinomio_n.) Cada trinomio es una tupla (a, b, c).
# El código es el mismo que el del Ejercicio 6.
def obtener_trinomio_n(lista, n):
    if n == 1:
        return lista[0]
    return obtener_trinomio_n(lista[1:], n - 1)


print(obtener_trinomio_n([(1, 2, 3), (4, 5, 6)], 2))   # => (4, 5, 6)

# ¿Sería posible generalizarla para cualquier otro tipo de dato?
# Sí. La función nunca mira qué hay dentro de cada elemento: solo avanza por
# la lista y devuelve el primero. Como Python tiene tipado dinámico, la misma
# función sirve para listas de números, caracteres, cadenas, trinomios...
# (polimorfismo). De hecho es idéntica a obtener_caracter_n; bastaría con
# una sola función, por ejemplo obtener_elemento_n. Con anotaciones de tipo
# se puede dejar escrito que es genérica (T = cualquier tipo):
#   def obtener_elemento_n[T](lista: list[T], n: int) -> T
# Prueba con cadenas:
print(obtener_trinomio_n(["uno", "dos", "tres"], 3))   # => tres


# Ejercicio 8
# a) Versión recursiva: el doble del primer elemento, en una lista de un
#    solo elemento, unida con + a la lista del resto ya duplicada.
#    + crea una lista nueva; la original no cambia.
def duplicar_lista(lista):
    if not lista:
        return []
    return [2 * lista[0]] + duplicar_lista(lista[1:])


print(duplicar_lista([1, 2, 3, 4]))   # => [2, 4, 6, 8]

# b) Versión con map y una lambda.
#    map aplica la lambda a cada elemento. En Python 3 map no devuelve una
#    lista sino un iterador (va dando los valores según se piden), por eso
#    lo convierto en lista con list(...).
#    Le pongo otro nombre porque, si no, la segunda definición sustituiría
#    a la primera.
def duplicar_lista_map(lista):
    return list(map(lambda x: 2 * x, lista))


print(duplicar_lista_map([1, 2, 3, 4]))   # => [2, 4, 6, 8]

# c) ¿Qué es una función lambda y qué ventajas ofrece?
#    Es una función sin nombre que se escribe justo donde se usa, por
#    ejemplo lambda x: 2 * x = "dado x, devuelve x por 2". En Python una
#    lambda solo puede contener una expresión.
#    Ventajas:
#    - Se puede pasar directamente a otras funciones como map, filter o
#      reduce (funciones de orden superior).
#    - No hace falta crear con def una función que solo se usa una vez.
#    - Puede usar variables del sitio donde se escribe (clausura).
#    - El código queda más corto y dice QUÉ hacer con cada elemento, no
#      CÓMO recorrer la lista.


# Ejercicio 9
# Recibe una función (accion) y la ejecuta n veces sin bucles:
#  - Si n es mayor que 0: ejecuta la acción y se llama a sí misma con n-1.
#  - Si n llega a 0: no hace nada y para.
# accion es la función recibida; accion() la ejecuta.
# Python limita la recursión a unas 1000 llamadas; con números normales no
# es un problema.
def repetir_accion_n(accion, n):
    if n > 0:
        accion()
        repetir_accion_n(accion, n - 1)


# Demostración: pregunto un número al usuario con input() y muestro la
# bienvenida del Ejercicio 1 esas veces. input() devuelve texto, así que lo
# convierto en número con int(). imprimir_bienvenida va sin paréntesis:
# así paso la función como dato, no la ejecuto.
veces = int(input("\n¿Cuántas veces quieres mostrar la bienvenida? "))
repetir_accion_n(imprimir_bienvenida, veces)


# Ejercicio 10
# Ejemplo pequeño de map + reduce: cada sublista es un bloque de datos que
# estaría en un nodo distinto. map cuenta los elementos de cada bloque (con
# longitud_lista) y reduce suma esos resultados de dos en dos.
#   map(longitud_lista, [[1, 2, 3], [4, 5], [6, 7, 8, 9]])  ->  3, 2, 4
#   reduce(lambda a, b: a + b, [3, 2, 4])                    ->  9
def contar_elementos_map_reduce(bloques):
    return reduce(lambda a, b: a + b, map(longitud_lista, bloques))


print(contar_elementos_map_reduce([[1, 2, 3], [4, 5], [6, 7, 8, 9]]))   # => 9

# a) ¿Por qué usan map y reduce en vez de un bucle for? ¿Qué ventajas tiene?
#    Un bucle for recorre los datos uno detrás de otro y va cambiando una
#    variable (el acumulador). Eso obliga a hacerlo en orden y en un solo
#    sitio, así que es difícil repartirlo entre varias máquinas.
#    - map aplica la misma función a cada dato por separado: el resultado
#      de uno no depende de los demás. Por eso los datos se pueden partir
#      en bloques y cada nodo procesa el suyo a la vez (en paralelo).
#    - reduce junta los resultados con una operación como +. Cada nodo
#      puede sumar lo suyo y luego se suman los resultados parciales.
#    Ventajas:
#    - Escala: más datos -> se añaden más nodos.
#    - Sin variables compartidas, así que no hay conflictos entre nodos
#      (condiciones de carrera) ni hacen falta bloqueos.
#    - Si un nodo falla, se repite su bloque en otro y, como las funciones
#      son puras, el resultado es el mismo (tolerancia a fallos).
#    - El programador dice QUÉ hacer con los datos y Hadoop o Spark
#      deciden CÓMO repartirlo.
#
# b) Características de Python:
#    - Multiparadigma: imperativo, orientado a objetos y funcional. La parte
#      funcional: las funciones son un dato más (se pasan por su nombre y se
#      pueden guardar en variables), hay lambdas, recursividad, clausuras y
#      funciones de orden superior (map, filter y reduce). Las tuplas y las
#      cadenas son inmutables.
#    - No es funcional puro: permite modificar variables y listas, así que
#      la inmutabilidad depende del programador. Tampoco optimiza la
#      recursión de cola y limita la recursión a unas 1000 llamadas.
#    - Interpretado, con los bloques marcados por la sangría (no por llaves
#      ni paréntesis), memoria automática (recolector de basura) y entorno
#      interactivo (REPL) para probar funciones sueltas.
#
#    ¿Cómo es el tipado? Dinámico y fuerte.
#    - Dinámico: las variables no tienen tipo, lo tienen los valores, y se
#      comprueba al ejecutar. No hace falta declarar tipos: si un valor sabe
#      hacer lo que se le pide, sirve ("duck typing").
#    - Fuerte: no mezcla tipos por su cuenta; 1 + "a" da error (TypeError).
#    - Opcionalmente se pueden añadir anotaciones de tipo
#      (def f(x: int) -> int). Python no las comprueba al ejecutar, pero
#      herramientas como mypy las revisan antes.
#
#    ¿Qué implica?
#    - Ventaja: más flexible y rápido de escribir; una misma función vale
#      para cualquier tipo de dato (como obtener_trinomio_n, Ejercicio 7).
#    - Inconveniente: los errores de tipo se descubren al ejecutar y no
#      antes, así que hay que probar más el código (o usar anotaciones).
#
#    ¿Por qué los lenguajes modernos han incorporado la programación
#    funcional? (Java con lambdas y Streams, C# con LINQ, JavaScript,
#    Kotlin, Rust... y el propio Python)
#    - Los ordenadores tienen varios núcleos y los sistemas son
#      distribuidos. Sin datos que cambien y con funciones puras, ejecutar
#      cosas en paralelo es mucho más seguro.
#    - map, filter, reduce y lambdas hacen el código más corto y fácil de
#      leer que los bucles con acumuladores.
#    - Las funciones puras son fáciles de probar y de reutilizar.
#    - Encaja muy bien con el procesamiento de grandes volúmenes de datos.

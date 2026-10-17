#Ejercicio 1
def imprimir_bienvenida():
    print("¡Bienvenidos al Paradigma Funcional: Inmutabilidad y Funciones Puras!")
#Ejercicio 2
def longitud_lista(lista):
    if not lista:
        return 0
    return 1 + longitud_lista(lista[1:])
print(longitud_lista([4, 8, 15, 16, 23, 42]))  

#Ejercicio 3



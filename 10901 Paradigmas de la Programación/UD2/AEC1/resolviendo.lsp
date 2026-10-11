; Paradigmas de la Programación
; AEC1
; Nombre: Ángel Panadero Rodríguez

; Ejercicio 1
(defun imprimir_bienvenida ()
(format t "¡Bienvenidos al Paradigma
Funcional: Inmutabilidad y Funciones Puras!")
)
(imprimir_bienvenida)

; Ejercicio 2
(defun logitud_lista (lista)
    (if (null lista)
        0
        (+1 (longitud_lista (cdr)))
        ))

; Ejercicio 3
(defun encontrar_minimo (lista)
 (if (null (cdr lista))
 (car lista)
 (min (car lista) (encontrar_minimo (cdr lista)))))

 ; Ejercicio 4
 defun posicion_de (elemento lista)
 (if (= elemento (car lista))
 1
 (+ 1 (posicion_de elemento (cdr lista)))))
(defun encontrar_minimo_y_posicion (lista)
 (list (encontrar_minimo lista)
 (posicion_de (encontrar_minimo lista) lista)))

; Ejerciicio 5
(defun encontrar_extremo (lista funcion)
 (if (null (cdr lista))
 (car lista)
 (funcall funcion (car lista) (encontrar_extremo (cdr lista) funcion))))
(defun sumar_max_y_min (lista)
 (+ (encontrar_extremo lista #'max)
 (encontrar_extremo lista #'min))
 )

 ; Ejercicio 6
 (defun obtener_caracter_n (lista n)
 (if (= n 1)
 (car lista)
 (obtener_caracter_n (cdr lista) (- n 1))
 ))

 ;ejercicio 7
 (defun obtener_trinomio_n (lista n)
 (if (= n 1)
 (car lista)
 (obtener_trinomio_n (cdr lista) (- n 1))
 ))
; ¿Sería posible generalizarla para cualquier otro tipo de dato?
; Sí, la función coge la lista de forma dinámica sin importar lo que haya dentro,
; la misma función se puede usar con números, caractéres, cuatrinomios... 

;Ejercicio 8
(defun duplicar_lista (lista)
 (if (null lista)
 nil
 (cons (* 2 (car lista)) (duplicar_lista (cdr lista)))))
(defun duplicar_lista_map (lista)
 (mapcar (lambda (x) (* 2 x)) lista))
; ¿Qué es una función lambda y qué ventajas ofrece en el contexto de la
;programación funcional? 
;Es una función sin nombre que se escribe justo donde se usa, por
;ejemplo (lambda (x) (* 2 x)) = "dado x, devuelve x por 2". Sin que definas el valor.

;Ejercicio 9
(defun repetir_accion_n (accion n)
 (when (> n 0)
 (funcall accion)
 (repetir_accion_n accion (- n 1))))
(format t "~%¿Cuántas veces quieres mostrar la bienvenida? ")
(finish-output)
(repetir_accion_n #'imprimir_bienvenida (read))

;Ejercicio 10
(defun contar_elementos_map_reduce (bloques)
 (reduce #'+ (mapcar #'longitud_lista bloques)))

;a) Map y Reduce en lugar de for
;Usar un bucle for, obliga recorrer los datros en orden en un único sitio.
;Map aplica la misma función a cada dato de forma individual, el resultado de uno
;no depende de los demás. Reduce junta los resultados con una operación como +. Cada nodo
;puede sumar lo suyo y luego juntar los resultados. Las ventajas son: 

;b) Common LISP
; Multiparadigma, pero con un núcleo funcional: las funciones son un
;dato más (se pasan con #' y se llaman con funcall), hay lambdas,
;recursividad y funciones de orden superior (mapcar, reduce).
;
;Todo se escribe con paréntesis (+ 1 2).
;El código y los datos son listas. Eso puede ser ventajoso a la hora de manipular datos
;Memoria automática (recolector de basura) y entorno interactivo
;(REPL) para probar funciones sueltas.
;¿Cómo es el tipado?
;Dinámico: las variables no tienen tipo, lo tienen los valores, y
;se comprueba al ejecutar. No hace falta declarar tipos.
;Fuerte: no mezcla tipos por su cuenta (+ 1 "a") da error.
;¿Qué implica?
;Ventaja: más flexible y rápido de escribir; una misma función vale
;para cualquier tipo de dato (como obtener_trinomio_n, Ejercicio 7).
;Inconveniente: los errores de tipo, se descubren al ejecutar y no
;antes, así que hay que probar mas el código.
;¿Por qué los lenguajes modernos han incorporado la programación
;funcional? 
;Los ordenadores tienen varios núcleos y los sistemas son
;distribuidos. Ejecutar cosas en paralelo es mucho más seguro.
;map, filter, reduce y lambdas hacen el código más corto y fácil de
;leer que los bucles con acumuladores.
;Las funciones puras son faciles de probar y  de reutilizar.
;Encaja muy bien con el procesamiento de grandes volúmenes de datos.
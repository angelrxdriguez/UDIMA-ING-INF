; Paradigmas de la Programación
; AEC1
; Nombre: Angel Panadero Rodriguez
;
; Lenguaje: Common LISP (probado con SBCL 2.6.9).
; Ejecución: sbcl --script angel_panadero_rodriguez_AEC1.lsp
; Tras cada función se incluye una llamada de ejemplo con (print ...)
; y, en comentario, el resultado esperado.


; Ejercicio 1
;; Única función con efecto lateral (escribir en pantalla). El resto de
;; funciones del fichero son puras: no modifican nada y siempre devuelven
;; el mismo resultado para los mismos argumentos.
(defun imprimir_bienvenida ()
  (format t "¡Bienvenidos al Paradigma Funcional: Inmutabilidad y Funciones Puras!~%"))

(imprimir_bienvenida)


; Ejercicio 2
;; Recursividad pura, sin length:
;;  - Caso base: la lista vacía tiene 0 elementos.
;;  - Caso recursivo: 1 (la cabeza) + la longitud del resto (cdr).
;; Funciona con listas de cualquier tipo porque nunca mira los elementos.
(defun longitud_lista (lista)
  (if (null lista)
      0
      (+ 1 (longitud_lista (cdr lista)))))

(print (longitud_lista '(4 8 15 16 23 42)))   ; => 6


; Ejercicio 3
;; - Caso base: si solo queda un elemento, ese es el mínimo.
;; - Caso recursivo: calculamos el mínimo del resto y lo comparamos con la
;;   cabeza. Se usa let para no repetir la llamada recursiva (let crea una
;;   ligadura local inmutable, no una variable que se reasigna).
;; Con la lista vacía devuelve NIL.
(defun encontrar_minimo (lista)
  (if (null (cdr lista))
      (car lista)
      (let ((minimo_resto (encontrar_minimo (cdr lista))))
        (if (< (car lista) minimo_resto)
            (car lista)
            minimo_resto))))

(print (encontrar_minimo '(9 3 7)))   ; => 3


; Ejercicio 4
;; La "tupla" se representa como una lista de dos elementos (valor posición).
;; La posición se lleva en un parámetro opcional que empieza en 1 y se
;; incrementa en cada llamada (patrón acumulador, sin contadores mutables).
;;  - Caso base: lista vacía -> NIL; un solo elemento -> (elemento pos).
;;  - Caso recursivo: obtenemos (mínimo posición) del resto y nos quedamos
;;    con la cabeza si es menor o igual (<= para devolver la primera
;;    aparición si el mínimo está repetido).
(defun encontrar_minimo_y_posicion (lista &optional (pos 1))
  (cond
    ((null lista) nil)
    ((null (cdr lista)) (list (car lista) pos))
    (t (let ((resultado_resto (encontrar_minimo_y_posicion (cdr lista) (+ pos 1))))
         (if (<= (car lista) (car resultado_resto))
             (list (car lista) pos)
             resultado_resto)))))

(print (encontrar_minimo_y_posicion '(9 1 7 3)))   ; => (1 2)


; Ejercicio 5
;; Refactorización: encontrar_minimo (Ej. 3) y un hipotético encontrar_maximo
;; solo se diferenciarían en el operador de comparación (< o >). Generalizamos
;; encontrar_minimo pasando el comparador como parámetro (función de orden
;; superior). Se invoca con funcall y se pasa con #' (#'< o #'>).
;;   (encontrar_extremo lista #'<)  equivale a  encontrar_minimo
;;   (encontrar_extremo lista #'>)  equivale a  encontrar_maximo
(defun encontrar_extremo (lista comparador)
  (if (null (cdr lista))
      (car lista)
      (let ((extremo_resto (encontrar_extremo (cdr lista) comparador)))
        (if (funcall comparador (car lista) extremo_resto)
            (car lista)
            extremo_resto))))

(defun sumar_max_y_min (lista)
  (+ (encontrar_extremo lista #'>)
     (encontrar_extremo lista #'<)))

(print (sumar_max_y_min '(2 6 10)))   ; => 12


; Ejercicio 6
;; Recorremos la lista restando 1 a n en cada paso:
;;  - Lista vacía (posición fuera de rango) -> NIL.
;;  - n = 1 -> la cabeza es el elemento buscado.
;;  - En otro caso, buscamos la posición n-1 en el resto.
;; En LISP los caracteres se escriben #\a, #\b...
(defun obtener_caracter_n (lista n)
  (cond
    ((null lista) nil)
    ((= n 1) (car lista))
    (t (obtener_caracter_n (cdr lista) (- n 1)))))

(print (obtener_caracter_n '(#\a #\b #\c #\d) 2))   ; => #\b


; Ejercicio 7
;; Nota: en el ejemplo del enunciado aparece obtener_caracter_n, pero la
;; función pedida es obtener_trinomio_n. Cada trinomio es una lista (a b c).
;;
;; ¿Sería posible generalizar esta función para cualquier otro tipo de dato?
;; Sí. El algoritmo es exactamente el mismo que el del Ejercicio 6: nunca
;; consulta el tipo del elemento, solo avanza con cdr y devuelve car. Como
;; LISP tiene tipado dinámico, una única función sirve para listas de
;; números, caracteres, cadenas, trinomios o cualquier otra cosa
;; (polimorfismo paramétrico). Por eso definimos obtener_elemento_n y
;; obtener_trinomio_n es solo un caso particular de ella.
(defun obtener_elemento_n (lista n)
  (cond
    ((null lista) nil)
    ((= n 1) (car lista))
    (t (obtener_elemento_n (cdr lista) (- n 1)))))

(defun obtener_trinomio_n (lista n)
  (obtener_elemento_n lista n))

(print (obtener_trinomio_n '((1 2 3) (4 5 6)) 2))            ; => (4 5 6)
(print (obtener_elemento_n '("uno" "dos" "tres") 3))         ; => "tres"


; Ejercicio 8
;; a) Versión recursiva: construimos una lista NUEVA con cons (doble de la
;;    cabeza + resto duplicado). La lista original no se modifica.
(defun duplicar_lista (lista)
  (if (null lista)
      nil
      (cons (* 2 (car lista)) (duplicar_lista (cdr lista)))))

(print (duplicar_lista '(1 2 3 4)))   ; => (2 4 6 8)

;; b) Versión con mapcar (el map de LISP) y una lambda que duplica un número.
;;    mapcar aplica la lambda a cada elemento y devuelve una lista nueva.
(defun duplicar_lista_map (lista)
  (mapcar (lambda (x) (* 2 x)) lista))

(print (duplicar_lista_map '(1 2 3 4)))   ; => (2 4 6 8)

;; c) ¿Qué es una función lambda y qué ventajas ofrece?
;;    Una lambda es una función anónima: se define en el mismo lugar donde
;;    se usa, sin darle nombre con defun, p. ej. (lambda (x) (* 2 x)).
;;    Ventajas en programación funcional:
;;    - Permiten pasar comportamiento como argumento a funciones de orden
;;      superior (mapcar, reduce, remove-if...) de forma breve y legible.
;;    - Evitan definir funciones auxiliares de un solo uso que ensucian el
;;      espacio de nombres.
;;    - Pueden capturar variables de su entorno (clausuras), lo que permite
;;      crear funciones a medida a partir de otras.
;;    - Favorecen un estilo declarativo: se indica QUÉ hacer con cada
;;      elemento y no CÓMO recorrer la lista.


; Ejercicio 9
;; repetir_accion_n recibe una función (accion) y la ejecuta n veces:
;;  - Caso base: n <= 0 -> no hace nada (devuelve NIL).
;;  - Caso recursivo: ejecuta la acción con funcall y se llama con n-1.
;; No se usan bucles (loop, dotimes, do...).
(defun repetir_accion_n (accion n)
  (when (> n 0)
    (funcall accion)
    (repetir_accion_n accion (- n 1))))

;; Demostración: pide un número al usuario y muestra la bienvenida del
;; Ejercicio 1 ese número de veces. La función se pasa con #'.
(defun demo_repetir_bienvenida ()
  (format t "~%¿Cuántas veces quieres mostrar la bienvenida? ")
  (finish-output)
  (repetir_accion_n #'imprimir_bienvenida (read)))

(demo_repetir_bienvenida)


; Ejercicio 10
;; Ejemplo de map + reduce: cada sublista representa un bloque de datos que
;; estaría en un nodo distinto. map cuenta los elementos de cada bloque
;; (reutilizando longitud_lista) y reduce suma los resultados parciales.
(defun contar_elementos_map_reduce (bloques)
  (reduce #'+ (mapcar #'longitud_lista bloques)))

(print (contar_elementos_map_reduce '((1 2 3) (4 5) (6 7 8 9))))   ; => 9

;; a) ¿Por qué usan map y reduce en vez de un bucle for? ¿Qué ventajas tiene?
;;    Un bucle for recorre los elementos uno detrás de otro y va modificando
;;    un acumulador compartido, por lo que el orden importa y es difícil
;;    repartir el trabajo entre varias máquinas.
;;    En cambio:
;;    - map aplica una función pura a cada elemento de forma independiente
;;      (el resultado de uno no depende de los demás), así que los datos se
;;      pueden partir en bloques y procesar en paralelo en distintos nodos.
;;    - reduce combina los resultados con una operación asociativa (como +),
;;      por lo que cada nodo puede hacer su reducción parcial y después se
;;      combinan los parciales.
;;    Ventajas:
;;    - Paralelismo y escalabilidad: al no haber estado compartido no hay
;;      condiciones de carrera ni necesidad de bloqueos.
;;    - Tolerancia a fallos: si un nodo cae, como las funciones son puras y
;;      deterministas, su bloque se puede volver a ejecutar en otro nodo
;;      obteniendo el mismo resultado.
;;    - Código declarativo y más corto: el programador describe QUÉ hacer
;;      con los datos y el framework (Hadoop, Spark) decide CÓMO repartirlo.
;;
;; b) Características del lenguaje escogido (Common LISP):
;;    - Lenguaje multiparadigma (funcional, imperativo y orientado a objetos
;;      con CLOS), aunque su núcleo es funcional: funciones de primera
;;      clase, lambdas, clausuras, recursividad y funciones de orden
;;      superior (mapcar, reduce, funcall, apply).
;;    - Sintaxis basada en S-expresiones con notación prefija. El código y
;;      los datos tienen la misma forma, listas (homoiconicidad), lo que
;;      permite manipular código como datos (macros).
;;    - Gestión automática de memoria (recolector de basura) y entorno
;;      interactivo REPL.
;;    - Espacios de nombres separados para funciones y variables (Lisp-2):
;;      por eso para pasar una función como dato se usa #' y para llamarla
;;      funcall.
;;
;;    ¿Cómo es el tipado? Dinámico y fuerte.
;;    - Dinámico: los tipos pertenecen a los valores, no a las variables, y
;;      se comprueban en tiempo de ejecución. No hay que declarar tipos
;;      (aunque se puede hacer de forma opcional con declare).
;;    - Fuerte: no hay conversiones implícitas entre tipos incompatibles;
;;      (+ 1 "a") produce un error en lugar de un resultado inesperado.
;;
;;    ¿Qué implica?
;;    - Ventajas: más flexibilidad y rapidez para programar; una misma
;;      función sirve para cualquier tipo de dato sin código extra (como
;;      obtener_elemento_n del Ejercicio 7).
;;    - Inconvenientes: los errores de tipo aparecen al ejecutar y no al
;;      compilar, por lo que hacen falta más pruebas, y el rendimiento puede
;;      ser menor si no se declaran tipos.
;;
;;    ¿Por qué los lenguajes modernos han incorporado la programación
;;    funcional? (Java con lambdas y Streams, C# con LINQ, Python, JavaScript,
;;    Kotlin, Swift, Rust...)
;;    - Los procesadores multinúcleo y los sistemas distribuidos exigen
;;      programación concurrente, y la inmutabilidad y las funciones puras la
;;      hacen mucho más segura.
;;    - El código con map/filter/reduce y lambdas es más conciso, expresivo y
;;      fácil de leer que los bucles con acumuladores.
;;    - Las funciones puras son más fáciles de probar, depurar y reutilizar,
;;      y se pueden componer para construir programas complejos.
;;    - El procesamiento de grandes volúmenes de datos y flujos (streams)
;;      encaja de forma natural con el modelo funcional.

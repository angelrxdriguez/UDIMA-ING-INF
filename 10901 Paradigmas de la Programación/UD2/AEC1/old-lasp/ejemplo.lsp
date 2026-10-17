; Paradigmas de la Programación
; AEC1
; Nombre: Angel Panadero Rodriguez
;
; Lenguaje: Common LISP (probado con SBCL).
; Ejecución: sbcl --script angel_panadero_rodriguez_AEC1.lsp
; Debajo de cada función hay un ejemplo con (print ...) y, en comentario,
; el resultado que debe salir.


; Ejercicio 1
;; Escribe el mensaje en pantalla. ~% es un salto de línea.
;; Es la única función con efecto lateral (escribe en pantalla); el resto
;; son funciones puras: solo calculan y devuelven un valor.
(defun imprimir_bienvenida ()
  (format t "¡Bienvenidos al Paradigma Funcional: Inmutabilidad y Funciones Puras!~%"))

(imprimir_bienvenida)


; Ejercicio 2
;; Recursividad sin usar length:
;;  - Si la lista está vacía, mide 0.
;;  - Si no, mide 1 (el primer elemento) + lo que mida el resto.
(defun longitud_lista (lista)
  (if (null lista)
      0
      (+ 1 (longitud_lista (cdr lista)))))

(print (longitud_lista '(4 8 15 16 23 42)))   ; => 6


; Ejercicio 3
;;  - Si solo queda un elemento (el resto está vacío), ese es el mínimo.
;;  - Si no, el mínimo es el menor entre el primer elemento y el mínimo
;;    del resto. min solo compara dos números; el recorrido de la lista
;;    lo hace la recursividad.
(defun encontrar_minimo (lista)
  (if (null (cdr lista))
      (car lista)
      (min (car lista) (encontrar_minimo (cdr lista)))))

(print (encontrar_minimo '(9 3 7)))   ; => 3


; Ejercicio 4
;; Lo divido en dos pasos:
;;  1. Calculo el mínimo con encontrar_minimo (Ejercicio 3).
;;  2. Busco en qué posición está con la función auxiliar posicion_de.
;; La "tupla" es una lista de dos elementos: (minimo posicion).
;; Llamo dos veces a encontrar_minimo, pero como es una función pura las
;; dos veces da el mismo resultado (transparencia referencial).

;; posicion_de sigue la misma idea que longitud_lista:
;;  - Si el primer elemento es el que busco, está en la posición 1.
;;  - Si no, está 1 posición más allá de donde esté en el resto.
(defun posicion_de (elemento lista)
  (if (= elemento (car lista))
      1
      (+ 1 (posicion_de elemento (cdr lista)))))

(defun encontrar_minimo_y_posicion (lista)
  (list (encontrar_minimo lista)
        (posicion_de (encontrar_minimo lista) lista)))

(print (encontrar_minimo_y_posicion '(9 1 7 3)))   ; => (1 2)


; Ejercicio 5
;; Reutilizo encontrar_minimo. Buscar el máximo es igual, cambiando min
;; por max. Así que la generalizo: en lugar de escribir min, recibo la
;; función como parámetro (funcion) y la llamo con funcall.
;;   (encontrar_extremo lista #'min)  -> el mínimo
;;   (encontrar_extremo lista #'max)  -> el máximo
;; #'min significa "la función min" (para pasarla como dato).
(defun encontrar_extremo (lista funcion)
  (if (null (cdr lista))
      (car lista)
      (funcall funcion (car lista) (encontrar_extremo (cdr lista) funcion))))

(defun sumar_max_y_min (lista)
  (+ (encontrar_extremo lista #'max)
     (encontrar_extremo lista #'min)))

(print (sumar_max_y_min '(2 6 10)))   ; => 12


; Ejercicio 6
;; Voy avanzando por la lista y restando 1 a n:
;;  - Si n vale 1, el primer elemento es el que busco.
;;  - Si no, busco la posición n-1 en el resto.
;; Si n es mayor que la longitud de la lista, devuelve NIL.
;; En LISP los caracteres se escriben #\a, #\b...
(defun obtener_caracter_n (lista n)
  (if (= n 1)
      (car lista)
      (obtener_caracter_n (cdr lista) (- n 1))))

(print (obtener_caracter_n '(#\a #\b #\c #\d) 2))   ; => #\b


; Ejercicio 7
;; (En el ejemplo del enunciado pone obtener_caracter_n, pero la función
;; pedida es obtener_trinomio_n.) Cada trinomio es una lista (a b c).
;; El código es el mismo que el del Ejercicio 6.
(defun obtener_trinomio_n (lista n)
  (if (= n 1)
      (car lista)
      (obtener_trinomio_n (cdr lista) (- n 1))))

(print (obtener_trinomio_n '((1 2 3) (4 5 6)) 2))   ; => (4 5 6)

;; ¿Sería posible generalizarla para cualquier otro tipo de dato?
;; Sí. La función nunca mira qué hay dentro de cada elemento: solo avanza
;; con cdr y devuelve el car. Como LISP tiene tipado dinámico, la misma
;; función sirve para listas de números, caracteres, cadenas, trinomios...
;; (polimorfismo). De hecho es idéntica a obtener_caracter_n; bastaría con
;; una sola función, por ejemplo obtener_elemento_n. Prueba con cadenas:
(print (obtener_trinomio_n '("uno" "dos" "tres") 3))   ; => "tres"


; Ejercicio 8
;; a) Versión recursiva: el doble del primer elemento, unido con cons a la
;;    lista del resto ya duplicada. Se crea una lista nueva; la original
;;    no cambia.
(defun duplicar_lista (lista)
  (if (null lista)
      nil
      (cons (* 2 (car lista)) (duplicar_lista (cdr lista)))))

(print (duplicar_lista '(1 2 3 4)))   ; => (2 4 6 8)

;; b) Versión con mapcar (el map de LISP) y una lambda.
;;    mapcar aplica la lambda a cada elemento y devuelve una lista nueva.
;;    Le pongo otro nombre porque no puede haber dos funciones iguales.
(defun duplicar_lista_map (lista)
  (mapcar (lambda (x) (* 2 x)) lista))

(print (duplicar_lista_map '(1 2 3 4)))   ; => (2 4 6 8)

;; c) ¿Qué es una función lambda y qué ventajas ofrece?
;;    Es una función sin nombre que se escribe justo donde se usa, por
;;    ejemplo (lambda (x) (* 2 x)) = "dado x, devuelve x por 2".
;;    Ventajas:
;;    - Se puede pasar directamente a otras funciones como mapcar o reduce
;;      (funciones de orden superior).
;;    - No hace falta crear con defun una función que solo se usa una vez.
;;    - Puede usar variables del sitio donde se escribe (clausura).
;;    - El código queda más corto y dice QUÉ hacer con cada elemento, no
;;      CÓMO recorrer la lista.


; Ejercicio 9
;; Recibe una función (accion) y la ejecuta n veces sin bucles:
;;  - Si n es mayor que 0: ejecuta la acción y se llama con n-1.
;;  - Si n llega a 0: para.
;; when es como un if sin "si no", y permite poner dos cosas seguidas.
(defun repetir_accion_n (accion n)
  (when (> n 0)
    (funcall accion)
    (repetir_accion_n accion (- n 1))))

;; Demostración: pregunto un número al usuario con (read) y muestro la
;; bienvenida del Ejercicio 1 esas veces. finish-output hace que la
;; pregunta aparezca en pantalla antes de esperar la respuesta.
(format t "~%¿Cuántas veces quieres mostrar la bienvenida? ")
(finish-output)
(repetir_accion_n #'imprimir_bienvenida (read))


; Ejercicio 10
;; Ejemplo pequeño de map + reduce: cada sublista es un bloque de datos que
;; estaría en un nodo distinto. mapcar cuenta los elementos de cada bloque
;; (con longitud_lista) y reduce suma esos resultados.
;;   (mapcar #'longitud_lista '((1 2 3) (4 5) (6 7 8 9)))  ->  (3 2 4)
;;   (reduce #'+ '(3 2 4))                                 ->  9
(defun contar_elementos_map_reduce (bloques)
  (reduce #'+ (mapcar #'longitud_lista bloques)))

(print (contar_elementos_map_reduce '((1 2 3) (4 5) (6 7 8 9))))   ; => 9

;; a) ¿Por qué usan map y reduce en vez de un bucle for? ¿Qué ventajas tiene?
;;    Un bucle for recorre los datos uno detrás de otro y va cambiando una
;;    variable (el acumulador). Eso obliga a hacerlo en orden y en un solo
;;    sitio, así que es difícil repartirlo entre varias máquinas.
;;    - map aplica la misma función a cada dato por separado: el resultado
;;      de uno no depende de los demás. Por eso los datos se pueden partir
;;      en bloques y cada nodo procesa el suyo a la vez (en paralelo).
;;    - reduce junta los resultados con una operación como +. Cada nodo
;;      puede sumar lo suyo y luego se suman los resultados parciales.
;;    Ventajas:
;;    - Escala: más datos -> se añaden más nodos.
;;    - Sin variables compartidas, así que no hay conflictos entre nodos
;;      (condiciones de carrera) ni hacen falta bloqueos.
;;    - Si un nodo falla, se repite su bloque en otro y, como las funciones
;;      son puras, el resultado es el mismo (tolerancia a fallos).
;;    - El programador dice QUÉ hacer con los datos y Hadoop o Spark
;;      deciden CÓMO repartirlo.
;;
;; b) Características de Common LISP:
;;    - Multiparadigma, pero con un núcleo funcional: las funciones son un
;;      dato más (se pasan con #' y se llaman con funcall), hay lambdas,
;;      recursividad y funciones de orden superior (mapcar, reduce).
;;    - Todo se escribe con paréntesis en notación prefija: (+ 1 2).
;;      El código y los datos son listas, por lo que el programa puede
;;      manipular código como si fueran datos (homoiconicidad).
;;    - Memoria automática (recolector de basura) y entorno interactivo
;;      (REPL) para probar funciones sueltas.
;;
;;    ¿Cómo es el tipado? Dinámico y fuerte.
;;    - Dinámico: las variables no tienen tipo, lo tienen los valores, y
;;      se comprueba al ejecutar. No hace falta declarar tipos.
;;    - Fuerte: no mezcla tipos por su cuenta; (+ 1 "a") da error.
;;
;;    ¿Qué implica?
;;    - Ventaja: más flexible y rápido de escribir; una misma función vale
;;      para cualquier tipo de dato (como obtener_trinomio_n, Ejercicio 7).
;;    - Inconveniente: los errores de tipo se descubren al ejecutar y no
;;      antes, así que hay que probar más el código.
;;
;;    ¿Por qué los lenguajes modernos han incorporado la programación
;;    funcional? (Java con lambdas y Streams, C# con LINQ, Python,
;;    JavaScript, Kotlin, Rust...)
;;    - Los ordenadores tienen varios núcleos y los sistemas son
;;      distribuidos. Sin datos que cambien y con funciones puras, ejecutar
;;      cosas en paralelo es mucho más seguro.
;;    - map, filter, reduce y lambdas hacen el código más corto y fácil de
;;      leer que los bucles con acumuladores.
;;    - Las funciones puras son fáciles de probar y de reutilizar.
;;    - Encaja muy bien con el procesamiento de grandes volúmenes de datos.

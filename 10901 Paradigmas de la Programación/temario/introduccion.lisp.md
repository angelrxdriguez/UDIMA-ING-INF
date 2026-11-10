# introduccion.lisp · Introducción a Lisp comentada por el profesor (aula, UD3)
Fuente: UD3/introduccion.lisp

## parte 1
```lisp
;
; Introducción a LISP
; 
; Profesor: 
;        Antonio Martín Garre
;
;
; Origen: 
;
;        1958, John McCarthy (MIT)
;        1957-Fortran, 1958-LISP, 1959-COBOL
;        Basado en el cálculo lambda de Alonzo Church (1936), que fue profesor de Alan Turing.
;
;
; Características: 
;
;        LISP=LISt Processing        
;        Paradigma: Programación declarativa/funcional.
;        Incluye Expresiones lambda, liberación automática de memoria, tipos dinámicos...
;        Notación prefija o polaca: + 2 2 en lugar de 2 + 2
;        Todo se representa como listas con términos. 
;        Las listas son inmutables (operaciones no destructivas)
;        Se procura que no haya efectos laterales -> más cercano a las matemáticas.
;        Hay varios dialectos, principalmente Scheme y Common Lisp
;        Usaremos Common LISP (CL), concretamente su implementación opensource llamada SBCL (Steel Bank Common LISP)
;        Uso habitual en IA.
;
;
; Entorno de desarrollo: 
; Se suele usar el IDE Emacs, integrado con el interprete de LISP. 
; Mi instalación: Docker y Visual Studio Code. 
;
;        docker pull wshito/sbcl-swank
;        docker run -it --rm -p 4005:4005 wshito/sbcl-swank
;        Extensión 'alive' para Visual Studio Code.
; 


```

## parte 2
```lisp
;--------------------------------------------------------------------
; Conceptos básicos en LISP
```

## parte 3
```lisp
;--------------------------------------------------------------------


; Notación prefija o polaca en LISP

(+ 2 3) ; 2 + 3
(* 2 (+ 4 5)) ; 2 * (4 + 5)

; Entrada y salida básicos
; Imprimiendo el resultado

(print (+ 2 3))
(print (* 2 (+ 4 5)))

; Imprimiendo el valor de entrada del usuario

(print(read))

;
; El clásico "Hola mundo" 
; La forma especial 'defun' permite definir una función.
;
(
    defun saludar()
          (print "Hola mundo!")
)

(saludar)

;
; Funcion que suma dos números 
;
(
    defun sumar (a b)
          (+ a b)
)

(print(sumar 2 3))

;
; Saludar a <nombre de usuario> 
;
(
     defun saludarUsuario(usuario)
           (print (concatenate 'string "hola " usuario ", cómo estás?"))
)


(saludarUsuario "Antonio")

;
; Usando quote o ', para no evaluar una lista
; De otra manera, cualquier lista siempre se evalua
;
(print (1 2 3)) ; da error, pues trata de evaluar (1 2 3)
(print '(1 2 3)); imprime la lista (1 2 3)
(print (quote(1 2 3))); es lo mismo que la expresión anterior

```

## parte 4
```lisp
;--------------------------------------------------------------------
; Valores lógicos en LISP
```

## parte 5
```lisp
;--------------------------------------------------------------------
(= 2 3) ; FALSO en LISP, se evalua como NIL
(= 2 2) ; VERDADERO en LISP, se evalua como T
(NOT T) ; NO T => NIL
(NOT NIL); NO NIL => T

() ; se evalua como NIL
T ; se evalua como T (true)

```

## parte 6
```lisp
;--------------------------------------------------------------------
; Declaración de variables en LISP
```

## parte 7
```lisp
;--------------------------------------------------------------------


; globales: con setf. Son visibles en todo el programa
; locales; con let. Son visibles sólo en el ámbito declarado.
;
(
    setf *profesor* "Antonio Martin"
)

(saludarUsuario *profesor*)

(
    let (
          (alumno1 "Alejandro")
          (alumno3 "Beatriz")
          (alumno2 "Juanito")
        )

        ; codigo que usa las variables, aquí
         (saludarUsuario alumno1)
         (saludarUsuario alumno2)
         (saludarUsuario alumno3)
             
)

(print '(1 2 3 4 5))

```

## parte 8
```lisp
;--------------------------------------------------------------------
; Estructuras de control en LISP
```

## parte 9
```lisp
;--------------------------------------------------------------------


; Funcion recursiva: cálculo del factorial 
; En LISP existe IF y COND para expresiones condicionales. 
;
; Sintaxis de IF:
; 
; (if (predicado) (entonces_hacer_esto) (en_otro_caso_hacer_esto))
;
; Sintaxis de COND:
;
;(cond ((predicado1) (entonces_hacer_esto1))    
;      ((predicado2) (entonces_hacer_esto2))  
;      (T (en_otro_caso_hacer_esto))                    
;)
;
(
    defun factorial(n)
    (
        if (= n 0) 1
           (* n (factorial (- n 1)))
    )      

)

(print (factorial 6))
(trace factorial)
(untrace factorial)




```

## parte 10
```lisp
;--------------------------------------------------------------------
; Manipulación de listas en LISP
```

## parte 11
```lisp
;--------------------------------------------------------------------

(first '(A E I O U)) ; A 
(car '(A E I O U)) ; A, es lo mismo que first

(rest '(A E I O U)) ; E I O U
(cdr '(A E I O U)) ; E I O U, es lo mismo que rest

; Explicación de los nombres CAR y CDR
;   CAR abreviación de "Contents of the Address part of Register number" (Contenido de la parte dirección del número de registro),
;   CDR "Contents of the Decrement part of Register number" (contenido de la parte decremento del número de registro),

; Accediendo a los elementos de una lista
(second '(A E I O U)); E
(third '(A E I O U)); I
(nth 4 '(A E I O U)); U

; Construyendo cadenas:
(cons 'A '(E I)); (A E I) - Concatena el primer elemento al segundo
(cons '(A E) '(I O)); ((A E) I O) - Otro ejemplo
(append '(A E) '(I O)) ; (A E I O) - Concatena ambas listas
(list '(A E I O U)) ; (A E I O U) - devuelve la lista de la expresión
(last '(A E I O U)) ; (U) - devuelve una lista con el último elemento
(reverse '(A E I O U)) ; (U O I E A) - devuelve la lista invertida
(length '(A E I O U))  ; 5 - devuelve la longitud de la lista
(subst 'X 'E '(A E I O U)) ; A X I O U ; sustituye 'viejo' por 'nuevo' en 'lista': subst nuevo viejo lista
(remove 'b '(a b c d) :test #'eql); devuelve una lista sin el elemento seleccionado (A C D) 

; MEMBER: Comprueba si existe una ocurrencia de elemento en lista. Si no existe ocurrencia devuelve NIL
; si existe, devuelve su primera aparición junto al resto de la lista
(member 'b '(a b c d) :test #'equal) ;  (b c d)
(member 'b '(a (b c) d) :test #'eql) ;  NIL
(member '(b c) '(a (b c) d) :test #'equal) ; ((b c) d)
 
```

## parte 12
```lisp
;--------------------------------------------------------------------
; Estructuras en LISP
```

## parte 13
```lisp
;--------------------------------------------------------------------
; Permite definir estructuras de datos.
 

 (defstruct rectangle
  (height)
  (width 5))

(defvar rectangle-1)

(setf rectangle-1
      (make-rectangle :height 10 :width 15))

(print rectangle-1)
(rectangle-height rectangle-1)

```

## parte 14
```lisp
;--------------------------------------------------------------------
; Ejecución de sentencias en LISP
```

## parte 15
```lisp
;--------------------------------------------------------------------
; progn: evalua por orden cada sentencia. Devuelve el valor de la última sentencia.
; Existen tambien prog1, prog2...
(progn  
    (+ 1 4) 
    (* 5 3)
    (+ 2 2)) 

```

## parte 16
```lisp
;--------------------------------------------------------------------
; Funciones Lambda en LISP
```

## parte 17
```lisp
;--------------------------------------------------------------------
 
; Funcion que incrementa cada elemento de una lista.
; MAPCAR: (map) Aplica a cada elemento x de una lista, la función lambda x->x+1
(
     defun incrementar(lista)
        (mapcar (lambda (x) (+ x 1)) lista)
)

(print (incrementar '(1 2 3 4 5 6)))

; Factorial de 4
; FUNCALL: Invoca a una función dinámicamente
; Se usa #'factorial para referirnos a una función (si bien, sin # también funciona)

(print (funcall #'factorial '4))
(print (funcall #'sumar 8 3))

; Factorial de 4
; APPLY: Invoca a una función dinámicamente. 
; Igual que Funcall, pero con los parámetros en una lista

(print (apply #'sumar '(8 3)))

;
; Funcion que suma todos los elementos de una lista
; REDUCE: Aplica a cada 2 elementos la función lambda indicada (sumar), devolviendo un valor
;
(
     defun sumarLista(lista)
        (reduce 'sumar lista)
)

(sumarLista '(1 2 3 4 5 6))

;
; El carácter especial # tiene diferentes usos:
;
(print (funcall #'factorial '4))   ; para indicar (function functionname) #'
(print #(1 2 3))         ; vector con elementos 1 2 3 #(
(print #c(1 2))          ; número complejo #c
(print #xFFFF)           ; número hexadecimal #x
(print #b1111)           ; número binario #b

;
; Como en cualquier otro lenguaje funcional, es común anidar funciones
; Ojo con los parentesis en estos casos!

(print (mapcar #'factorial '(1 2 3 4))) ; (1 2 6 24) 
(print (reduce #'sumar (mapcar #'factorial '(1 2 3 4)))) ; 33

; estas expresiones son equivalentes
(print (reduce #'sumar '(1 2 3 4))); 10
(print (reduce #'+ '(1 2 3 4))); 10

 
CL-USER> 
; número hexadecimal #x
; No value
CL-USER> 
```

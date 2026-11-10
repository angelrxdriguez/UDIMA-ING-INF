# Ejercicios Prolog UD4 · Programas y consultas de ejemplo del aula (UD4)
Fuente: UD4/Unidad_4/

## ejm0.pl
```prolog
% Ejemplo 1: 
ingeniero(juan).

listo(X) :- ingeniero(X).
```

## ejm1.pl
```prolog
% Ejercicio 1: Hechos y consultas básicas
padre(juan, maria).
padre(juan, jose).
padre(maria, alberto).
padre(carlos, juan).
padre(carlos, elena).
```

## ejm2.pl
```prolog
% Ejercicio 2: Reglas lógicas simples
padre(juan, maria).
padre(juan, jose).
padre(maria, alberto).
padre(carlos, juan).
padre(carlos, elena).

abuelo(X, Y) :- padre(X, Z), padre(Z, Y).
```

## ejm3.pl
```prolog
% Ejercicio 3: Cálculo factorial (recursión numérica)
factorial(0, 1). % Caso base: 0! = 1
factorial(N, F) :- N > 0, % Aseguramos que N es positivo
	N1 is N - 1,       % Calculamos N1 = N-1
	factorial(N1, F1), % Llamada recursiva: (N-1)!
	F is F1 * N.      % Calculamos F = (N-1)! * N
```

## Preguntas_1.txt (consultas de los ejemplos)
```prolog
EJM0:
a) ** "¿Juan es listo?"
listo(juan).
b) ** ¿José no es listo?
\+ listo(jose). 

EJM1:
a) Consulta booleana:
** "¿Juan es padre de José?"
padre(juan, jose).
** "¿Juan es padre de Alberto?"
padre(juan, alberto).
** ¿María es madre de José?
padre(maria, jose).
b) Consulta para obtener todos los hijos de una persona: 
**"¿Quiénes son los hijos de Juan?"
padre(juan, Hijo).
**"¿Quién es el padre de Juan?"
padre(Padre, juan). 
padre(juan, Hijo).

EJM2:
** ¿De quién es abuelo Carlos?
abuelo(carlos, Z). 
** ¿Quién es el abuelo de Alberto?
abuelo(Z, alberto). 
** Hagamos la consulta general de todos los abuelos-nietos
abuelo(Abuelo, Nieto).

EJM3:
factorial(3,F).
factorial(5, X).
factorial(4, 24).
factorial(N, F).
```

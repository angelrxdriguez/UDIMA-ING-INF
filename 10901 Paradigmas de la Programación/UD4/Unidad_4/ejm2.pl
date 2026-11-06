% Ejercicio 2: Reglas lógicas simples
padre(juan, maria).
padre(juan, jose).
padre(maria, alberto).
padre(carlos, juan).
padre(carlos, elena).

abuelo(X, Y) :- padre(X, Z), padre(Z, Y).
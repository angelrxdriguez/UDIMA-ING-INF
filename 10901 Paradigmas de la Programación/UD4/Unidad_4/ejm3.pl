% Ejercicio 3: Cálculo factorial (recursión numérica)
factorial(0, 1). % Caso base: 0! = 1
factorial(N, F) :- N > 0, % Aseguramos que N es positivo
	N1 is N - 1,       % Calculamos N1 = N-1
	factorial(N1, F1), % Llamada recursiva: (N-1)!
	F is F1 * N.      % Calculamos F = (N-1)! * N
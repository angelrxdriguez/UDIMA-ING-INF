"""Cálculo exacto (fracciones) para diseñar y comprobar los ejercicios de la guía."""
from fractions import Fraction as Fr
from itertools import permutations


def F(M):
    return [[Fr(x) for x in r] for r in M]


def rref(M):
    A = [r[:] for r in F(M)]
    m, n = len(A), len(A[0])
    piv, r = [], 0
    for c in range(n):
        p = next((i for i in range(r, m) if A[i][c] != 0), None)
        if p is None:
            continue
        A[r], A[p] = A[p], A[r]
        A[r] = [x / A[r][c] for x in A[r]]
        for i in range(m):
            if i != r and A[i][c] != 0:
                k = A[i][c]
                A[i] = [a - k * b for a, b in zip(A[i], A[r])]
        piv.append(c)
        r += 1
        if r == m:
            break
    return A, piv


def rank(M):
    return len(rref(M)[1])


def det(M):
    A = [r[:] for r in F(M)]
    n, d = len(A), Fr(1)
    for c in range(n):
        p = next((i for i in range(c, n) if A[i][c] != 0), None)
        if p is None:
            return Fr(0)
        if p != c:
            A[c], A[p] = A[p], A[c]
            d = -d
        d *= A[c][c]
        for i in range(c + 1, n):
            k = A[i][c] / A[c][c]
            A[i] = [a - k * b for a, b in zip(A[i], A[c])]
    return d


def det_leibniz(M):
    n = len(M)
    tot = Fr(0)
    for p in permutations(range(n)):
        s = 1
        for i in range(n):
            for j in range(i + 1, n):
                if p[i] > p[j]:
                    s = -s
        t = Fr(s)
        for i in range(n):
            t *= Fr(M[i][p[i]])
        tot += t
    return tot


def mul(A, B):
    A, B = F(A), F(B)
    assert len(A[0]) == len(B)
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


def eye(n):
    return [[Fr(int(i == j)) for j in range(n)] for i in range(n)]


def inv(M):
    n = len(M)
    R, piv = rref([list(r) + e for r, e in zip(F(M), eye(n))])
    assert piv[:n] == list(range(n)), 'no invertible'
    return [r[n:] for r in R]


def T(M):
    return [list(c) for c in zip(*M)]


def dot(u, v):
    return sum(Fr(a) * Fr(b) for a, b in zip(u, v))


def cross(u, v):
    u, v = [Fr(x) for x in u], [Fr(x) for x in v]
    return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]


def sub(u, v):
    return [Fr(a) - Fr(b) for a, b in zip(u, v)]


def add(u, v):
    return [Fr(a) + Fr(b) for a, b in zip(u, v)]


def sc(k, u):
    return [Fr(k) * Fr(a) for a in u]


def proj(v, u):
    """Proyección de v sobre u."""
    return sc(dot(u, v) / dot(u, u), u)


def norm2(v):
    return dot(v, v)


def classify(Aug):
    """Rouché-Frobenius sobre la ampliada (última columna = b)."""
    A = [r[:-1] for r in Aug]
    r, r2, n = rank(A), rank(Aug), len(Aug[0]) - 1
    if r < r2:
        return 'SI', r, r2
    return ('SCD' if r == n else 'SCI'), r, r2


def solve_param(Aug):
    """Solución general: (particular, [direcciones]) con las variables libres como parámetros."""
    R, piv = rref(Aug)
    n = len(Aug[0]) - 1
    assert n not in piv, 'incompatible'
    free = [c for c in range(n) if c not in piv]
    part = [Fr(0)] * n
    for i, c in enumerate(piv):
        part[c] = R[i][n]
    dirs = []
    for f in free:
        d = [Fr(0)] * n
        d[f] = Fr(1)
        for i, c in enumerate(piv):
            d[c] = -R[i][f]
        dirs.append(d)
    return part, dirs, free


def check_solution(Aug, x):
    return all(dot(r[:-1], x) == r[-1] for r in F(Aug))


def lu(M):
    """LU sin intercambios (Doolittle). Devuelve L, U y los multiplicadores usados."""
    U = [r[:] for r in F(M)]
    n = len(U)
    L = eye(n)
    for c in range(n):
        assert U[c][c] != 0, 'hace falta intercambiar filas'
        for i in range(c + 1, n):
            k = U[i][c] / U[c][c]
            L[i][c] = k
            U[i] = [a - k * b for a, b in zip(U[i], U[c])]
    assert mul(L, U) == F(M)
    return L, U


def show(M):
    def s(x):
        return str(x.numerator) if x.denominator == 1 else f'{x.numerator}/{x.denominator}'
    return '[' + '; '.join(' '.join(s(Fr(x)) for x in r) for r in M) + ']'


def poly_roots_int(coefs):
    """Raíces enteras de un polinomio (coeficientes de mayor a menor grado)."""
    c0 = coefs[-1]
    cands = {0} if c0 == 0 else {d * s for d in range(1, abs(c0) + 1) if c0 % d == 0 for s in (1, -1)}
    out = []
    for x in sorted(cands):
        if sum(c * x ** (len(coefs) - 1 - i) for i, c in enumerate(coefs)) == 0:
            out.append(x)
    return out

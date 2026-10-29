# AA1 · Del dato al resultado — Ejemplo de resolución (ajustado a la UD1)

> **Cómo usar este ejemplo:** es una guía de cómo lo resolvería usando solo lo que explica la Unidad 1 (`1_unidad_tecomp_c.pdf` y `Resumen Unidad 1.pdf`). En cada apartado indico **dónde está en la UD1**. El enunciado pide esquema y redacción propios y que declares la ayuda externa, así que reescribe los textos con tus palabras.

Las páginas citadas son las que aparecen impresas en el PDF de la unidad (empieza en la p. 9).

---

## Datos del caso

En el `.txt` del enunciado se han perdido los superíndices: **210 = 2¹⁰**, **220 = 2²⁰**, **106 = 10⁶**, **109 = 10⁹**.

| Magnitud | Valor |
|---|---|
| Memoria | 64 MiB, palabras de 32 bits, direccionamiento por palabras |
| Bus de datos | 32 bits, 100 · 10⁶ transferencias/s, 1 palabra por transferencia |
| Procesador A | F = 2,4 GHz · NCI = 1,8 · NI = 1 200 000 |
| Procesador B | F = 3,0 GHz · NCI = 2,5 · NI = 1 200 000 |

> En la UD1 el número medio de ciclos por instrucción se llama **NCI**. Es lo que el enunciado llama **CPI**.

---

## 1. Recorrido de la información · 2 puntos

**Dónde está en la UD1:** figura 2 y unidades funcionales (pp. 15-19), tabla 2 (p. 19), concepto de instrucción (pp. 20-21). Resumen: arquitectura Von Neumann y funciones del computador.

### 1.1 Esquema

Basado en la figura 2 de la unidad. La CPU está formada por la **unidad de control** y la **unidad de tratamiento**, que contiene la **ALU** y los **registros** (p. 18). Las etiquetas siguen la leyenda de la figura 2: **d** = datos, **i** = instrucciones, **c** = señales de control, **e** = señales de estado.

```text
          ┌───────────────────────────── CPU (procesador) ─────────────────────────────┐
          │                                ┌──────── UNIDAD DE TRATAMIENTO ─────────┐  │
          │                                │                                        │  │
          │  ┌────────────────────┐        │ ┌───────────────┐   ┌────────────────┐ │  │
          │  │ UNIDAD DE CONTROL  │ ───c──►│ │ ALU           │   │ REGISTROS      │ │  │
          │  │ (UC)               │        │ │ suma, divide, │◄─►│ r1: medición   │ │  │
          │  │ reloj              │ ◄──e───│ │ compara       │   │ r2: suma/media │ │  │
          │  └────────────────────┘        │ │               │   │ r3: umbral     │ │  │
          │                                │ └───────────────┘   └────────────────┘ │  │
          │                                └────────────────────────────────────────┘  │
          └───────────────────────────────────────┬────────────────────────────────────┘
                                                  │
 ═════════════════════════════════════════════════╪═══════════════════════════════════════════
   SISTEMA DE INTERCONEXIÓN (buses)
   bus de datos: 32 bits (d, i) · bus de direcciones: 24 bits · señales de control (c)
 ═══════╪════════════════════════╪════════════════════════════╪═══════════════════════╪═══════
        │                        │                            │                       │
┌───────┴──────┐    ┌────────────┴───────────┐   ┌────────────┴───────────┐   ┌───────┴──────┐
│ ENTRADA (E)  │    │ MEMORIA PRINCIPAL (MI) │   │ MEMORIA EXTERNA (ME)   │   │ SALIDA (S)   │
│ lector de    │    │ RAM · 64 MiB · volátil │   │ SSD · permanente       │   │ pantalla:    │
│ mediciones   │    │ programa + datos       │   │ programa (inicio)      │   │ aviso        │
│              │    │ + resultado            │   │ informe (final)        │   │              │
└──────────────┘    └────────────────────────┘   └────────────────────────┘   └──────────────┘
```

Recorrido que conviene numerar con flechas en tu dibujo:

| Nº | Recorrido | Qué viaja |
|:---:|---|---|
| 1 | ME (SSD) → MI | Programa (i) |
| 2 | Entrada → MI | Mediciones (d) |
| 3 | MI ⇄ CPU | Instrucciones (i) y datos (d) |
| 4 | CPU → Salida | Aviso (d) |
| 5 | MI → ME (SSD) | Informe (d) |
| — | UC → todas las unidades | Señales de control (c) |
| — | Unidades → UC | Señales de estado (e) |

### 1.2 Cómo se ejecuta el caso (189 palabras; el límite es 150-220)

> Primero, el programa se carga desde el SSD (memoria externa) en la memoria principal, porque un programa solo puede ejecutarse si está almacenado en ella. Después, el lector (unidad de entrada) transforma cada medición en señales binarias y la **transfiere** a la memoria: por ejemplo, el **dato** 12,5 ºC queda **almacenado** en una palabra de 32 bits. La unidad de **control** capta una a una las instrucciones del programa, interpreta su código de operación y genera las señales de control que indican a cada unidad qué debe hacer. Una instrucción de transferencia lleva la medición desde la memoria a un registro, y una **instrucción** de tratamiento como `ADDS r2,r2,r1` hace que la ALU la sume al total acumulado (**procesamiento**). Cuando se han sumado todas las mediciones, la ALU divide el total entre el número de datos y compara la media con el umbral. Con las señales de estado que recibe, la unidad de control ejecuta una instrucción de bifurcación: si se supera el umbral, el aviso se **transfiere** a la pantalla (unidad de salida). Por último, el informe se escribe en el SSD, donde queda **almacenado** de forma permanente.

*`ADDS` sigue el estilo de los nemónicos del Enunciado 5 de la unidad (p. 34). Los tipos de instrucción (transferencia, tratamiento y bifurcación) están en la p. 21.*

Comprobación de las cuatro funciones del computador (Resumen, diapositiva de funciones):

| Función | Acción concreta del caso |
|---|---|
| Procesamiento | La ALU suma las mediciones, divide y compara con el umbral |
| Almacenamiento | Programa y datos en la memoria principal; informe en el SSD |
| Transferencia | Lector → memoria, memoria ⇄ CPU, CPU → pantalla, memoria → SSD |
| Control | La UC capta e interpreta instrucciones, genera señales de control y decide el salto |

### 1.3 ¿Qué pasa al cortar la alimentación?

| Información | Dónde está | Qué ocurre | Dónde está en la UD1 |
|---|---|---|---|
| Resultado que solo está en RAM | Memoria principal (RAM) | **Se pierde**, porque la RAM es **volátil** | p. 16: la RAM «es volátil» |
| Informe ya guardado | SSD (memoria externa) | **Se conserva**, porque la memoria externa es **permanente** | p. 18: la información guardada en memoria externa «permanece indefinidamente hasta que el usuario expresamente la borre» |

---

## 2. Capacidad y direccionamiento · 2 puntos

**Dónde está en la UD1:** bit, byte y tabla 1 de múltiplos (pp. 13-14); memoria dividida en palabras, cada una con su dirección (p. 16); longitud de palabra y direccionamiento por bytes (p. 23). Enunciados 2, 3 y 4 de autocomprobación (pp. 33-34).

### a) 64 MiB en bytes y en bits

$$64\ \text{MiB} = 64 \cdot 2^{20}\ \text{bytes} = 2^{6} \cdot 2^{20} = 2^{26}\ \text{bytes} = \mathbf{67\,108\,864\ bytes}$$

$$2^{26}\ \text{bytes} \cdot 8\ \tfrac{\text{bits}}{\text{byte}} = 2^{29}\ \text{bits} = \mathbf{536\,870\,912\ bits}$$

### b) Número de palabras

Una palabra de 32 bits ocupa 32 / 8 = 4 bytes = 2² bytes.

$$N_{\text{palabras}} = \frac{2^{26}\ \text{bytes}}{2^{2}\ \text{bytes/palabra}} = 2^{24} = \mathbf{16\,777\,216\ palabras}$$

### c) Bus de direcciones con direccionamiento por palabras

Cada palabra necesita su propia dirección (p. 16). Con *n* hilos en el bus de direcciones se pueden formar 2ⁿ direcciones distintas:

$$2^{n} = 2^{24} \ \Rightarrow\ n = \mathbf{24\ bits}$$

### d) Bus de direcciones con direccionamiento por bytes

Ahora cada dirección selecciona un byte, así que hace falta una dirección por byte:

$$2^{n} = 2^{26} \ \Rightarrow\ n = \mathbf{26\ bits}$$

**Por qué cambia:** la memoria tiene la misma capacidad, pero cada palabra contiene 4 bytes y ahora cada byte necesita su propia dirección. Hay 4 veces más direcciones (4 = 2²), así que hacen falta 2 bits más. Por eso el ancho de palabra (32 bits) no determina por sí solo el bus de direcciones: depende de qué selecciona cada dirección. La unidad lo menciona en la p. 23: en muchos computadores de 32 bits la memoria se direcciona por bytes.

| Modo | Direcciones necesarias | Bits del bus de direcciones |
|---|---|:---:|
| Por palabras | 2²⁴ = 16 777 216 | **24** |
| Por bytes | 2²⁶ = 67 108 864 | **26** |

---

## 3. Transferencia de datos · 1,5 puntos

**Dónde está en la UD1:** ancho de banda o tasa de transferencia (p. 24), tiempo de acceso (p. 23), ancho de un bus (p. 19). Enunciados 3 y 4 (p. 34).

### a) Ancho de banda teórico

$$BW = 32\ \tfrac{\text{bits}}{\text{transferencia}} \cdot 100 \cdot 10^{6}\ \tfrac{\text{transferencias}}{\text{s}} = 3{,}2 \cdot 10^{9}\ \text{bits/s}$$

$$BW = \frac{3{,}2 \cdot 10^{9}\ \text{bits/s}}{8\ \text{bits/byte}} = \mathbf{4 \cdot 10^{8}\ bytes/s}$$

$$BW = \frac{4 \cdot 10^{8}\ \text{bytes/s}}{10^{6}\ \text{bytes/MB}} = \mathbf{400\ MB/s}$$

### b) Tiempo ideal para transferir 8 MiB

$$8\ \text{MiB} = 8 \cdot 2^{20}\ \text{bytes} = 8\,388\,608\ \text{bytes}$$

$$t = \frac{8\,388\,608\ \text{bytes}}{4 \cdot 10^{8}\ \text{bytes/s}} = 0{,}02097152\ \text{s} = \mathbf{20{,}972\ ms}$$

**Comprobación:** 8 388 608 / 4 = 2 097 152 palabras, y a 10⁸ transferencias/s dan 0,02097152 s. Coincide.

> **Ojo:** si usas 8 MB (8 · 10⁶ bytes) te sale 20 ms, y está mal. El bloque es de 8 **MiB**.

### c) Por qué es un límite ideal y qué distingue tasa de tiempo de acceso

- **Es un límite ideal** porque el cálculo supone que el bus transfiere una palabra tras otra sin ninguna espera: el enunciado ignora latencias y sobrecargas. En la realidad hay que añadir, por ejemplo, el tiempo de acceso de la memoria, así que el tiempo real sería mayor que 20,972 ms.
- **La magnitud que las distingue:**
  - La **tasa de transferencia** (ancho de banda) mide **cantidad de información por segundo**, en bytes/s o bits/s (p. 24).
  - El **tiempo de acceso** es un **tiempo**, en segundos: el intervalo desde que se da la dirección a la memoria hasta que el dato se lee o se escribe (p. 23).
  - La tasa indica cuánta información pasa por segundo; el tiempo de acceso, cuánto se tarda en obtener un dato concreto.

---

## 4. Comparación de procesadores · 3 puntos

**Dónde está en la UD1:** ecuaciones (1), (2) y (3) y Ejemplo 1 (pp. 24-25); MIPS y programas de prueba (pp. 26-28).

### Fórmulas de la unidad

$$t_E = N_I \cdot N_{CI} \cdot T = \frac{N_I \cdot N_{CI}}{F} \quad (1) \qquad \eta_E = \frac{1}{t_E} \quad (2) \qquad R_I = \frac{N_I}{t_E \cdot 10^{6}}\ \text{MIPS} \quad (3)$$

Según la ecuación (1), los ciclos totales son $N_I \cdot N_{CI}$.

### Procesador A (F = 2,4 GHz, NCI = 1,8)

$$\text{Ciclos}_A = 1\,200\,000 \cdot 1{,}8 = \mathbf{2\,160\,000\ ciclos}$$

$$t_{E,A} = \frac{2\,160\,000}{2{,}4 \cdot 10^{9}\ \text{Hz}} = 0{,}0009\ \text{s} = \mathbf{0{,}900\ ms}$$

$$R_{I,A} = \frac{1\,200\,000}{0{,}0009 \cdot 10^{6}} = \mathbf{1333{,}333\ MIPS}$$

### Procesador B (F = 3,0 GHz, NCI = 2,5)

$$\text{Ciclos}_B = 1\,200\,000 \cdot 2{,}5 = \mathbf{3\,000\,000\ ciclos}$$

$$t_{E,B} = \frac{3\,000\,000}{3 \cdot 10^{9}\ \text{Hz}} = 0{,}001\ \text{s} = \mathbf{1{,}000\ ms}$$

$$R_{I,B} = \frac{1\,200\,000}{0{,}001 \cdot 10^{6}} = \mathbf{1200{,}000\ MIPS}$$

| | Procesador A | Procesador B |
|---|:---:|:---:|
| Ciclos totales | 2 160 000 | 3 000 000 |
| Tiempo de CPU | **0,900 ms** | 1,000 ms |
| MIPS | **1333,333** | 1200,000 |

### Selección, aceleración y reducción

**El más rápido en esta prueba es A** (0,900 ms frente a 1,000 ms), aunque tiene menor frecuencia. Es justo lo que explica el Ejemplo 1 (p. 25): un procesador con más frecuencia no tiene por qué ser más rápido.

$$\text{Aceleración} = \frac{t_{\text{más lento}}}{t_{\text{más rápido}}} = \frac{1{,}000\ \text{ms}}{0{,}900\ \text{ms}} = \mathbf{1{,}111}$$

$$\text{Reducción de tiempo} = \frac{1{,}000 - 0{,}900}{1{,}000} \cdot 100 = \mathbf{10\ \%}$$

> **Ojo:** el rendimiento de A es 1,111 veces el de B (un 11,1 % más, según la ecuación 2), pero el tiempo se reduce un **10 %**. El enunciado pide la reducción de tiempo.

### Por qué los GHz y los MIPS aislados no bastan (el límite es 80-120 palabras)

> Según la ecuación (1), el tiempo de ejecución depende de tres factores: NI, NCI y F. Los GHz solo reflejan F: B tiene más frecuencia, pero su NCI es mayor y tarda más en esta prueba. Los MIPS tampoco bastan, porque dependen del programa concreto y de sus datos: que un programa se ejecute antes en A no garantiza que ocurra lo mismo con otros programas. Además, esta prueba no incluye la entrada/salida. Por eso la conclusión solo vale para esta prueba. Pediría resultados de conjuntos de programas de prueba (benchmarks), como SPEC o, si predomina el cálculo científico, LINPACK, y una prueba con el programa real del laboratorio y sus datos.

---

## 5. Niveles conceptuales · 1 punto

**Dónde está en la UD1:** figura 5 (p. 29) y su explicación (p. 30). Resumen, diapositiva 2.

```text
 6. Nivel de máquina simbólica     (compiladores, editores, intérpretes)
 5. Nivel de máquina operativa     (sistema operativo)
 4. Nivel de máquina convencional  (lenguajes máquina y ensamblador)
 3. Nivel de micromáquina          (microprogramación)
 2. Nivel de lógica digital
 1. Nivel de dispositivos y circuitos electrónicos
```

| Elemento | Nivel | Justificación (según la p. 30) |
|---|:---:|---|
| Transistor | **1** · Dispositivos y circuitos electrónicos | Es uno de los elementos del nivel electrónico, junto con condensadores y resistencias. La información se representa con tensiones o corrientes |
| Circuito con puertas lógicas | **2** · Lógica digital | Sus elementos básicos son las puertas lógicas, que almacenan, manipulan y transmiten datos en binario (0, 1) |
| Microprogramación de la UC | **3** · Micromáquina | La figura 5 sitúa aquí la microprogramación: las señales que cargan un registro, hacen una operación en la ALU o escriben en memoria |
| Programa en ensamblador | **4** · Máquina convencional | El ensamblador es igual que el lenguaje máquina, pero con otra terminología para describir las instrucciones de este nivel |
| Sistema operativo | **5** · Máquina operativa | Es la interfaz entre el hardware y el software y facilita el uso del hardware |
| Compilador | **6** · Máquina simbólica | Es un traductor, y este nivel está formado básicamente por los traductores o procesadores de lenguajes |

---

## 6. Reflexión · 0,5 puntos (80-120 palabras)

Este apartado tiene que ser **tuyo**: cuenta un error que hayas cometido o evitado **de verdad**. Te dejo un modelo con la estructura *error → cómo lo detecté → cómo lo comprobé → qué debo reforzar → fuentes*.

> *Modelo:* Al calcular el tiempo de transferencia de 8 MiB estuve a punto de usar 8 · 10⁶ bytes, lo que daba 20 ms justos. Lo detecté al revisar las convenciones del enunciado y la tabla 1 de la unidad, donde el múltiplo binario es 2²⁰. Lo comprobé por otro camino: 8 MiB son 2²¹ palabras y, a 10⁸ transferencias por segundo, salen 20,972 ms, igual que dividiendo bytes entre bytes/s. Necesito reforzar la diferencia entre longitud de palabra y direccionamiento, que la unidad explica en el apartado 4. Fuentes: 1_unidad_tecomp_c.pdf (apartados 2, 4 y 5) y Resumen Unidad 1.pdf.

---

## Antes de enviar (lista del enunciado)

- [ ] No confundo bits con bytes ni MB (10⁶) con MiB (2²⁰)
- [ ] Indico qué selecciona cada dirección (palabra → 24 bits; byte → 26 bits)
- [ ] No confundo aumento de rendimiento (1,111) con reducción de tiempo (10 %)
- [ ] Cada cálculo tiene fórmula, sustitución y unidades, y redondeo solo al final
- [ ] Los textos cumplen los límites: 150-220, 80-120 y 80-120 palabras
- [ ] El esquema, las tablas y las fórmulas se leen bien en el PDF final (`AA1_Apellidos_Nombre.pdf`)

## Referencias

- Prieto Espinosa, A. *Unidad didáctica 1. Conceptos básicos y organización funcional del computador*. Tecnología y Estructura de Computadores. UDIMA (`1_unidad_tecomp_c.pdf`), apartados 1-5.
- UDIMA. *Resumen Unidad 1* (`Resumen Unidad 1.pdf`).
- **Declaración de ayuda externa** (adáptala a lo que hayas hecho): «He utilizado un asistente de IA para revisar el planteamiento y comprobar los cálculos. La redacción, el esquema y el razonamiento final son propios».

// ===== Lecciones, teoría y formulario de la UD1 =====
const card = (title, body) => `<section class="tc"><h3>${title}</h3>${body}</section>`;
const box = (kind, title, body) => `<div class="box ${kind}"><b>${title}.</b> ${body}</div>`;
const stepsH = list => `<ol class="steps">${list.map(([a, b]) => `<li><div class="st">${a}</div><div class="why">${b}</div></li>`).join('')}</ol>`;
const fml = h => `<div class="fml">${M(h)}</div>`;
const pp = s => `<p>${s}</p>`;
const ul = items => `<ul class="ul">${items.map(x => `<li>${x}</li>`).join('')}</ul>`;
const xy = ['x', 'y'].map(iv), X3 = XYZ.map(iv);

const PARTS = [
  { n: 1, roman: 'I', title: 'Las herramientas' },
  { n: 2, roman: 'II', title: 'Vectores' },
  { n: 3, roman: 'III', title: 'Rectas y planos' },
  { n: 4, roman: 'IV', title: 'Sistemas y posiciones de planos' },
  { n: 5, roman: 'V', title: 'Distancias' },
];
// El recorrido empieza en esta lección; las anteriores ya las controla.
const START_N = 9;

const LESSONS = [
  { id: 'L1', part: 1, n: 1, title: 'Signos, fracciones y raíces', goal: 'Operar sin errores con negativos, fracciones y raíces, racionalizar y despejar.',
    plan: ['l1.tf', 'l1.signos', 'l1.signos', 'l1.fracsuma', 'l1.fracdiv', 'l1.raiz', 'l1.racio', 'l1.despeja'],
    theory: [card('Recuerda', ul([
      `Restar un negativo es sumar: ${M('2' + SUB + '(' + MINUS + '1) = 3')}. Un menos delante de un paréntesis cambia todos los signos de dentro.`,
      `Al cuadrado, siempre positivo: ${M('(' + MINUS + '3)² = 9')}.`,
      `Fracciones: para sumar, mismo denominador; para dividir, multiplica por la inversa: ${M('10 : ' + Fh(5, 4) + ' = 10·' + Fh(4, 5) + ' = 8')}.`,
      `${M(Sq(iv('a') + '·' + iv('b'), true) + ' = ' + Sq(iv('a')) + '·' + Sq(iv('b')))} sirve para simplificar: ${M(Sq(50) + ' = ' + Sq(25) + '·' + Sq(2) + ' = 5' + Sq(2))}.`,
      `Racionalizar: multiplica arriba y abajo por la raíz de abajo: ${M(Fh(1, Sq(3)) + ' = ' + Fh(Sq(3), 3))}.`]) +
      box('err', 'Error típico', `La raíz de una suma no se separa: ${M(Sq('9 + 16', true) + ' = 5')}, no 7. Y al restar coordenadas, escribe siempre el paréntesis: ${M('2' + SUB + '(' + MINUS + '1)')}.`))] },
  { id: 'L2', part: 1, n: 2, title: 'Pitágoras y el coseno', goal: 'La longitud con Pitágoras y pasar de un coseno a un ángulo, también obtuso.',
    plan: ['l2.dist0', 'l2.cosang', 'l2.signo', 'l2.cosang', 'l2.rad', 'l2.dist0', 'l2.cosang'],
    theory: [card('Recuerda', ul([
      `Distancia del origen a ${M('(' + X3.join(', ') + ')')}: ${M(Sq(iv('x') + '² + ' + iv('y') + '² + ' + iv('z') + '²', true))}. Ejemplo: ${M('(1, 2, 2) → ' + Sq(9) + ' = 3')}.`,
      'El coseno es la sombra horizontal de una flecha de longitud 1: positivo, ángulo agudo; cero, recto; negativo, obtuso.',
      `Tabla: ${M('cos 30° = ' + Fh(Sq(3), 2) + ', cos 45° = ' + Fh(Sq(2), 2) + ', cos 60° = ' + Fh(1, 2) + ', cos 90° = 0')}.`,
      'Obtusos: el mismo valor con signo menos, y el ángulo es 180° menos el de la tabla (cos 120° = −1/2).',
      `Radianes: ${M('π rad = 180°')}, así que ${M(Fh('π', 4) + ' = 45°')} y ${M(Fh('π', 2) + ' = 90°')}.`]) +
      box('key', 'Calculadora', 'Si el coseno no está en la tabla: SHIFT + cos (arccos), con la calculadora en modo DEG.'))] },
  { id: 'L3', part: 2, n: 3, title: 'Qué es un vector', goal: 'Dirección, sentido y módulo, y las componentes a partir de dos puntos.',
    plan: ['l3.concept', 'l3.AB', 'l3.AB', 'l3.BA', 'l3.same', 'l3.B', 'l3.AB'],
    theory: [card('Recuerda', fml(ar('AB') + ' = B' + SUB + 'A') + pp('“Final menos inicial”, coordenada a coordenada. Un vector es una flecha: lo definen su dirección, su sentido y su módulo, no dónde está dibujado.') +
      box('faq', 'Pregunta frecuente', 'Si restas al revés (A − B) obtienes el vector opuesto: mide lo mismo, pero apunta al revés.') +
      pp(`Notación: puntos con mayúscula y paréntesis, ${M('A = (' + MINUS + '1, 2)')}; vectores con corchetes y en negrita, ${M(Bv + ' = [3, 1]')}.`))] },
  { id: 'L4', part: 2, n: 4, title: 'Suma, resta y producto por un número', goal: 'Operar con vectores y saber cuándo dos vectores son paralelos.',
    plan: ['l4.esc', 'l4.comb', 'l4.par', 'l4.comb', 'l4.k', 'l4.spot', 'l4.par', 'l4.comb'],
    theory: [card('Recuerda', ul([
      'Todo se hace componente a componente.',
      'Multiplicar por k estira (k > 1), encoge (0 < k < 1) o da la vuelta (k < 0), pero nunca gira la flecha.',
      `Paralelos ⇔ componentes proporcionales: ${M('[3, 6, ' + MINUS + '9] = 3·[1, 2, ' + MINUS + '3]')}.`]) +
      box('err', 'Error típico', `En ${M(MINUS + '3' + Bv)} el −3 multiplica a todas las componentes, con su signo. Y restar −15 es sumar 15.`))] },
  { id: 'L5', part: 2, n: 5, title: 'Vectores en función de otros', goal: 'Escribir flechas de una figura usando solo dos vectores dados (el hexágono).',
    plan: ['l5.camino', 'l5.hexmc', 'l5.hex', 'l5.hex', 'l5.hexmc', 'l5.hex'],
    theory: [card('Recuerda', figHTML({ k: 'hex' }) + box('key', 'Idea clave', `Una flecha es igual a cualquier camino del mismo inicio al mismo final: ${M(ar('AC') + ' = ' + ar('AB') + ADD + ar('BC'))}. Al revés, signo menos.`) +
      pp(`Si dudas, pasa por el centro: ${M(ar('AB') + ' = ' + ar('OB') + SUB + ar('OA'))}. En el hexágono: ${M(ar('OC') + ' = ' + Bb + SUB + Ba + ',  ' + ar('OD') + ' = ' + MINUS + Ba + ',  ' + ar('OE') + ' = ' + MINUS + Bb + ',  ' + ar('OF') + ' = ' + Ba + SUB + Bb)}.`) +
      box('chk', 'Cómo comprobarlo', 'Lee el resultado como una receta y síguela en el dibujo: b − 2a es “avanza b y luego retrocede dos veces a”.'))] },
  { id: 'L6', part: 2, n: 6, title: 'Combinación lineal', goal: 'Encontrar los números de una combinación lineal o ver que no existe.',
    plan: ['l6.canon', 'l6.check', 'l6.ab', 'l6.ab', 'l6.imp', 'l6.ab', 'l6.check'],
    theory: [card('Recuerda', fml(Bw + ' = ' + iv('a') + Bu + ADD + iv('b') + Bv) + pp('Para encontrar a y b: escribe la igualdad por componentes y resuelve el sistema. Comprueba calculando a·u + b·v.') +
      box('faq', 'Pregunta frecuente', 'Si al resolver sale algo imposible (0 = 2), w no es combinación lineal. Pasa cuando u y v son paralelos.'))] },
  { id: 'L7', part: 2, n: 7, title: 'Producto escalar', goal: 'Calcular el producto escalar y saber qué te dice su signo.',
    plan: ['l7.tipo', 'prof.e3', 'l7.dot2', 'l7.dot3', 'l7.sign', 'l7.spot', 'l7.dot3', 'l7.sign'],
    theory: [card('Recuerda', fml(Bu + '·' + Bv + ' = ' + sub('u', 1) + sub('v', 1) + ADD + sub('u', 2) + sub('v', 2) + ADD + sub('u', 3) + sub('v', 3)) +
      pp('Se multiplica por parejas y se suma: da un número. Positivo, agudo; cero, perpendiculares; negativo, obtuso.') +
      box('err', 'Error típico', `Escribe la suma completa con paréntesis en los negativos antes de calcular: ${M('(' + MINUS + '1)·(' + MINUS + '2) = +2')}.`))] },
  { id: 'L8', part: 2, n: 8, title: 'Módulo y vectores unitarios', goal: 'Lo que mide un vector y cómo fabricar el unitario que apunta igual.',
    plan: ['prof.e5', 'l8.norm', 'l8.err', 'l8.unit', 'l8.norm', 'l8.tfunit', 'l8.k', 'l8.unit'],
    theory: [card('Recuerda', fml('‖' + Bv + '‖ = ' + Sq(sub('v', 1) + '² + ' + sub('v', 2) + '² + …', true) + ' = ' + Sq(Bv + '·' + Bv, true)) + fml(Bq + ' = ' + Fh(1, '‖' + Bv + '‖') + Bv) +
      box('err', 'Errores típicos', 'Sumar las componentes directamente (4 + 3 = 7), olvidar la raíz (25) o hacer la raíz de cada una y sumar.') +
      box('chk', 'Cómo comprobarlo', 'Un vector normalizado mide 1: la suma de los cuadrados de sus componentes da 1.'))] },
  { id: 'L9', part: 2, n: 9, title: 'Distancia entre vectores y puntos', goal: 'La distancia como una resta seguida de un módulo.',
    plan: ['prof.e6', 'l9.distv', 'l9.distp', 'l9.tf', 'l9.distv', 'l9.distp'],
    theory: [card('Recuerda', fml(iv('d') + '(' + Bu + ', ' + Bv + ') = ‖' + Bu + SUB + Bv + '‖') + pp('Para dos puntos: el módulo de la flecha que va de uno a otro. El orden de la resta da igual.'))] },
  { id: 'L10', part: 2, n: 10, title: 'Ángulo entre dos vectores', goal: 'Calcular el ángulo que forman dos vectores, incluidos los obtusos.',
    plan: ['prof.e7', 'l10.chain', 'l10.tf', 'l10.table', 'l10.chain', 'l10.calc', 'l10.table'],
    theory: [card('Recuerda', fml('cos ' + iv('φ') + ' = ' + Fh(Bu + '·' + Bv, '‖' + Bu + '‖ ‖' + Bv + '‖')) +
      stepsH([['Arriba, el producto escalar.', 'Su signo ya te dice si es agudo (+), recto (0) u obtuso (−).'], ['Abajo, los dos módulos multiplicados.', ''], ['Divide y simplifica.', ''], ['Pasa al ángulo con la tabla o con la calculadora.', 'Siempre entre 0° y 180°.']]) +
      box('chk', 'Cómo comprobarlo', 'El coseno tiene que estar entre −1 y 1 y tener el mismo signo que el producto escalar. Si sale 1,4, hay un error en algún módulo.'))] },
  { id: 'L11', part: 2, n: 11, title: 'Vectores ortogonales', goal: 'Comprobar si dos vectores son perpendiculares y hallar una incógnita para que lo sean.',
    plan: ['prof.e8', 'l11.tf', 'l11.k', 'l11.perp', 'l11.pit', 'l11.k', 'l11.tf'],
    theory: [card('Recuerda', fml(Bu + ' ⟂ ' + Bv + '  ⟺  ' + Bu + '·' + Bv + ' = 0') +
      pp('Con incógnita: escribe el producto escalar con la k dentro, iguálalo a 0 y despeja.') + pp(`En el plano, un perpendicular a ${M('[' + iv('a') + ', ' + iv('b') + ']')} es ${M('[' + MINUS + iv('b') + ', ' + iv('a') + ']')}: se intercambian y a una se le cambia el signo.`))] },
  { id: 'L12', part: 2, n: 12, title: 'Proyección ortogonal', goal: 'La sombra de un vector sobre otro y la parte perpendicular, base de las distancias.',
    plan: ['l12.abajo', 'prof.e9', 'l12.chain', 'l12.tf', 'l12.vec', 'l12.chain'],
    theory: [card('Recuerda', figHTML({ k: 'proj' }) + fml(proyH(Bu, Bv) + ' = ' + '(' + Fh(Bu + '·' + Bv, Bu + '·' + Bu) + ')' + Bu) +
      pp('Abajo va el vector sobre el que proyectas, sin raíz. El paréntesis es un número que multiplica a u.') +
      box('chk', 'Cómo comprobarlo', 'La parte perpendicular v − proy da producto escalar 0 con u. Su longitud es la distancia de la punta de v a la línea de u.'))] },
  { id: 'L13', part: 2, n: 13, title: 'Producto vectorial', goal: 'Calcular u × v sin memorizar la fórmula a ciegas y comprobarlo.',
    plan: ['l13.uso', 'prof.e10', 'l13.cross', 'l13.c2', 'l13.tf', 'l13.chk', 'l13.cross'],
    theory: [card('Recuerda', fml(Bu + '×' + Bv + ' = [' + sub('u', 2) + sub('v', 3) + SUB + sub('u', 3) + sub('v', 2) + ', ' + sub('u', 3) + sub('v', 1) + SUB + sub('u', 1) + sub('v', 3) + ', ' + sub('u', 1) + sub('v', 2) + SUB + sub('u', 2) + sub('v', 1) + ']') +
      pp('Truco de tapar columnas: escribe u encima de v, tapa una columna y haz la cruz con los cuatro números que quedan. En la segunda componente, cambia el signo.') +
      box('chk', 'Cómo comprobarlo', 'El resultado tiene que dar producto escalar 0 con u y con v. Y v × u = −(u × v). Solo existe en ℝ³.'))] },

  { id: 'L14', part: 3, n: 14, title: 'Rectas en el plano', goal: 'Escribir una recta del plano de sus cuatro formas (general, normal, vectorial y paramétrica) y pasar de una a otra.',
    plan: ['l14.normal', 'l14.dir', 'l14.tpt', 'l14.pt', 'l14.pn', 'prof.e11', 'l14.vect', 'l14.gen', 'l14.par', 'l14.tf'],
    theory: [
      card('Dos vectores para una recta', figHTML({ k: 'line' }) + ul([
        `<b class="dirt">Vector director</b> ${M(Bd)}: va a lo largo de la recta. Dice hacia dónde avanza.`,
        `<b class="nort">Vector normal</b> ${M(Bn)}: es perpendicular a la recta.`,
        `En el plano los dos son perpendiculares entre sí: si ${M(Bn + ' = [' + iv('a') + ', ' + iv('b') + ']')}, un director es ${M(Bd + ' = [' + MINUS + iv('b') + ', ' + iv('a') + ']')}.`,
        'Además de un vector necesitas un punto P: hay infinitas rectas con la misma dirección, una por cada punto.']) +
        box('key', 'Idea clave', 'No confundas director y normal: el director va a lo largo; el normal, perpendicular.')),
      card('Las cuatro formas', pp(`Las cuatro describen la misma recta, ${M(Lin([-2, 1], 3, ['x', 'y']))} (ejercicio 11 del profesor):`) +
        `<div class="tbl"><table><tbody>
          <tr><th>General</th><td>${M(iv('a') + iv('x') + ADD + iv('b') + iv('y') + ' = ' + iv('c'))}</td><td>${M(Lin([-2, 1], 3, ['x', 'y']))}. Los números de x e y forman el normal: ${M('[' + MINUS + '2, 1]')}.</td></tr>
          <tr><th>Normal</th><td>${M(Bn + '·' + Bx + ' = ' + Bn + '·' + Bp)}</td><td>${M('[' + MINUS + '2, 1]·[' + xy.join(', ') + '] = [' + MINUS + '2, 1]·[1, 5]')}</td></tr>
          <tr><th>Vectorial</th><td>${M(Bx + ' = ' + Bp + ADD + iv('t') + Bd)}</td><td>${M('[' + xy.join(', ') + '] = [1, 5] + ' + iv('t') + '[1, 2]')}</td></tr>
          <tr><th>Paramétricas</th><td>fila a fila</td><td>${M(iv('x') + ' = 1 + ' + iv('t') + ',  ' + iv('y') + ' = 5 + 2' + iv('t'))}</td></tr>
        </tbody></table></div>` +
        box('faq', '¿Qué es t?', 'Un número que puede valer cualquier cosa. Piensa en t como el tiempo: en t = 0 estás en P; en t = 1 has avanzado una vez d; en t = −1 has retrocedido una vez. Con todos los valores de t recorres la recta entera.')),
      card('De general a vectorial, paso a paso', stepsH([
        [M(Bn + ' = [' + MINUS + '2, 1]'), 'Leo los coeficientes de x e y.'],
        [M(iv('x') + ' = 1  ⟹  ' + MINUS + '2 + ' + iv('y') + ' = 3  ⟹  ' + iv('y') + ' = 5'), 'Busco un punto: doy a x un valor cómodo y despejo y. P = (1, 5).'],
        [M(iv('x') + ' = ' + iv('t') + '  ⟹  ' + iv('y') + ' = 3 + 2' + iv('t')), 'Para el director, llamo t a la x y despejo la y.'],
        [M('[' + xy.join(', ') + '] = [0, 3] + ' + iv('t') + '[1, 2]'), 'Los números sueltos van al punto y lo que lleva t, al director: d = [1, 2].'],
        [M(iv('x') + ' = 1 + ' + iv('t') + ',  ' + iv('y') + ' = 5 + 2' + iv('t')), 'Con el punto (1, 5), y fila a fila: paramétricas.']]) +
        box('chk', 'Cómo comprobarlo', 'Sustituye dos puntos de tu forma vectorial (t = 0 y t = 1) en la general. Y comprueba que d·n = 0: [1, 2]·[−2, 1] = 0.')),
      card('Otras conversiones', ul([
        `<b>De paramétricas a general:</b> despeja t en una y sustitúyelo en la otra. De ${M(iv('x') + ' = 1 + ' + iv('t'))} sale ${M(iv('t') + ' = ' + iv('x') + SUB + '1')}; entonces ${M(iv('y') + ' = 5 + 2(' + iv('x') + SUB + '1)')}, es decir, ${M(Lin([-2, 1], 3, ['x', 'y']))}.`,
        `<b>De punto y normal a general:</b> ${M(Bn + '·' + Bx + ' = ' + Bn + '·' + Bp)}. Con P = (1, 1) y n = [3, −2]: ${M(Lin([3, -2], 1, ['x', 'y']))}.`,
        `<b>Paralela por un punto:</b> mismo normal, nuevo número a la derecha. Paralela a ${M(Lin([3, 2], 4, ['x', 'y']))} por (1, −1): ${M(Lin([3, 2], 1, ['x', 'y']))}.`]) +
        box('faq', 'Pregunta frecuente', 'Una recta tiene infinitas ecuaciones correctas: [0, 3] + t[1, 2] y [1, 5] + t[1, 2] son la misma. Si la tuya no coincide con la de la solución, compruébala sustituyendo puntos. La app acepta cualquier forma correcta.'))] },
  { id: 'L15', part: 3, n: 15, title: 'Rectas en el espacio', goal: 'La recta que pasa por un punto con una dirección, o por dos puntos, y saber si un punto está en ella.',
    plan: ['l15.tf', 'l15.leer', 'prof.e12', 'l15.tpt', 'l15.dir2p', 'l15.pert', 'l15.vect2p', 'prof.e20'],
    theory: [
      card('La idea', pp(`En el espacio la recta se escribe en forma vectorial o paramétrica, igual que en el plano pero con tres componentes: ${M(Bx + ' = ' + Bp + ADD + iv('t') + Bd)}.`) +
        box('key', 'Idea clave', `Una sola ecuación ${M(iv('a') + iv('x') + ADD + iv('b') + iv('y') + ADD + iv('c') + iv('z') + ' = ' + iv('d'))} no es una recta: en ℝ³ es un plano. Por eso en ℝ³ no hay “forma general” de una recta con una ecuación.`)),
      card('Punto y director, o dos puntos', stepsH([
        [M('P = (1, ' + MINUS + '5, 1),  ' + Bd + ' = [' + MINUS + '3, 2, ' + MINUS + '1]'), 'Ejercicio 12: te dan un punto y un director.'],
        [M('[' + X3.join(', ') + '] = [1, ' + MINUS + '5, 1] + ' + iv('t') + '[' + MINUS + '3, 2, ' + MINUS + '1]'), 'Forma vectorial: punto más t por director.'],
        [M(iv('x') + ' = 1' + SUB + '3' + iv('t') + ',  ' + iv('y') + ' = ' + MINUS + '5 + 2' + iv('t') + ',  ' + iv('z') + ' = 1' + SUB + iv('t')), 'Paramétricas: coordenada del punto + t por componente del director.']]) +
        pp(`Con dos puntos P y Q, el director es la flecha de uno a otro: ${M(Bd + ' = ' + ar('PQ') + ' = Q' + SUB + 'P')}. Comprobación: con t = 1 tienes que llegar al otro punto.`)),
      card('¿Está un punto en la recta?', pp('Saca t de una de las paramétricas y comprueba si ese mismo t cumple las otras dos.') + stepsH([
        [M('(5, 4, 1) en ' + iv('x') + ' = 2 + 3' + iv('t') + ',  ' + iv('y') + ' = 3 + ' + iv('t') + ',  ' + iv('z') + ' = 1'), ''],
        [M('5 = 2 + 3' + iv('t') + '  ⟹  ' + iv('t') + ' = 1'), 'Saco t de la x.'],
        [M(iv('y') + ' = 3 + 1 = 4 ✓,  ' + iv('z') + ' = 1 ✓'), 'Con t = 1 cuadran las otras dos: el punto sí está.']]) +
        box('faq', 'Pregunta frecuente', 'Si una coordenada no lleva t (como z = 1), su componente del director es 0 y esa coordenada vale siempre lo mismo.'))] },
  { id: 'L16', part: 3, n: 16, title: 'Planos en el espacio', goal: 'El plano que pasa por tres puntos en forma vectorial, paramétrica y general, y la posición de dos planos.',
    plan: ['l16.param', 'l16.normal', 'l16.pert', 'l16.pn', 'l16.par', 'l16.pos', 'prof.e13', 'l16.chain3p'],
    theory: [
      card('Las formas de un plano', figHTML({ k: 'plane' }) + ul([
        `<b>General:</b> ${M(iv('a') + iv('x') + ADD + iv('b') + iv('y') + ADD + iv('c') + iv('z') + ' = ' + iv('d'))}. El normal es ${M(Bn + ' = [' + ['a', 'b', 'c'].map(iv).join(', ') + ']')}.`,
        `<b>Normal:</b> ${M(Bn + '·' + Bx + ' = ' + Bn + '·' + Bp)}.`,
        `<b>Vectorial:</b> ${M(Bx + ' = ' + Bp + ADD + iv('s') + Bu + ADD + iv('t') + Bv)}: un punto y dos direcciones del plano, con dos parámetros.`,
        '<b>Paramétricas:</b> la vectorial separada por filas.']) +
        box('faq', '¿Por qué dos parámetros?', 'En una recta solo avanzas o retrocedes (un parámetro). En un plano te mueves en dos direcciones, como en un folio: a lo ancho y a lo largo. Por eso u y v no pueden ser paralelos.')),
      card('El plano que pasa por tres puntos', stepsH([
        ['1. Dos direcciones: ' + M(Bu + ' = ' + ar('PQ') + ',  ' + Bv + ' = ' + ar('PR')), 'Flechas desde un punto a los otros dos.'],
        ['2. Un punto: P.', ''],
        ['3. Vectorial: ' + M('P + ' + iv('s') + Bu + ' + ' + iv('t') + Bv), 'Paramétricas, fila a fila.'],
        ['4. General: ' + M(Bn + ' = ' + Bu + '×' + Bv + ',  ' + iv('d') + ' = ' + Bn + '·P'), 'El producto vectorial de la lección 13.']]) +
        pp('Ejercicio 13: con P = (3, 0, 0), Q = (0, 1, 0) y R = (0, 0, 2):') + stepsH([
          [M(ar('PQ') + ' = [' + MINUS + '3, 1, 0],  ' + ar('PR') + ' = [' + MINUS + '3, 0, 2]'), 'Final menos inicial.'],
          [M(Bn + ' = [' + MINUS + '3, 1, 0]×[' + MINUS + '3, 0, 2] = [2, 6, 3]'), 'Tapar columnas.'],
          [M(iv('d') + ' = 2·3 + 6·0 + 3·0 = 6  ⟹  ' + Lin([2, 6, 3], 6)), 'Sustituyo P.']]) +
        box('chk', 'Cómo comprobarlo', 'Los tres puntos cumplen la general: P da 6, Q da 6 y R da 3·2 = 6.')),
      card('Paralelos y posición de dos planos', ul([
        `<b>Plano paralelo por un punto:</b> mismo normal, nuevo término independiente. Paralelo a ${M(Lin([3, -1, 2], 1))} por (1, 2, 3): ${M(Lin([3, -1, 2], 7))}.`,
        '<b>¿Está un punto en el plano?</b> Sustitúyelo en la general.',
        '<b>Dos planos:</b> si los normales son proporcionales, son paralelos (o el mismo plano, si también lo es el término independiente). Si n₁·n₂ = 0, son perpendiculares. Si no, se cortan en una recta.']))] },

  { id: 'L17', part: 4, n: 17, title: 'El método de eliminación', goal: 'Resolver sistemas con eliminación, escrita con ecuaciones o con matrices.',
    plan: ['l17.perm', 'l17.factor', 'l17.resta', 'l17.mat', 'l17.spot', 'l17.2x2', 'l17.resta'],
    theory: [
      card('Tres operaciones que no cambian las soluciones', stepsH([
        ['1. Intercambiar dos ecuaciones.', ''], ['2. Multiplicar una ecuación por un número distinto de 0.', ''], ['3. Sumar a una ecuación otra multiplicada por un número.', '']]) +
        pp(`Notación: ${M(E(2) + ' ← ' + E(2) + SUB + '3' + E(1))} significa “la nueva ecuación 2 es la ecuación 2 menos 3 veces la ecuación 1”.`) +
        box('faq', '¿Por qué no cambian las soluciones?', 'Si un punto cumple la ecuación 1 y la 2, también cumple “ecuación 2 menos 3 veces la 1”: es como una balanza, si quitas lo mismo de los dos platos sigue equilibrada. Y se puede deshacer.')),
      card('La operación clave, paso a paso', pp(`Con ${M(E(1) + ': ' + Lin([1, 2, 1], -1))} y ${M(E(2) + ': ' + Lin([3, 2, 7], 5))}, para quitar la x de la segunda resto 3 veces la primera:`) +
        stepsH([[M('3' + iv('x') + SUB + '3' + iv('x') + ' = 0'), 'La x desaparece.'], [M('2' + iv('y') + SUB + '6' + iv('y') + ' = ' + MINUS + '4' + iv('y')), ''], [M('7' + iv('z') + SUB + '3' + iv('z') + ' = 4' + iv('z')), ''], [M('5' + SUB + '3·(' + MINUS + '1) = 5 + 3 = 8'), 'La última columna, por separado.']]) +
        fml(Lin([0, -4, 4], 8)) +
        box('err', 'Error típico', 'El error más frecuente es restar la parte izquierda y olvidarse del número de la derecha, o restar mal su signo.')),
      card('La versión con matrices', pp('Se escriben solo los números: cada fila es una ecuación, cada columna una incógnita y la barra separa el lado derecho. Es la matriz ampliada.') +
        `<div class="fml">${Mat([[1, 2, 1, -1], [3, 2, 7, 5]])}</div>` +
        pp('Objetivo de Gauss-Jordan: un 1 en cada escalón (el pivote) y ceros encima y debajo. Al final cada fila se lee como una ecuación muy sencilla.'))] },
  { id: 'L18', part: 4, n: 18, title: 'Recta intersección de dos planos', goal: 'Las paramétricas de la recta donde se cortan dos planos.',
    plan: ['l18.que', 'prof.e14', 'l18.tf', 'l18.chain', 'l18.vect', 'prof.e21'],
    theory: [
      card('La idea', pp('Dos planos que no son paralelos se cortan en una recta, como dos paredes en la arista de una esquina. Sus puntos son los que cumplen las dos ecuaciones.') +
        box('key', 'Idea clave', 'Son 2 ecuaciones con 3 incógnitas: no hay una única solución. Una letra queda libre y hace de parámetro. El plan: dejar x e y en función de z y llamar t a la z.')),
      card('El método (ejercicio 14)', pp(`${M(Lin([1, 2, 1], -1))} y ${M(Lin([3, 2, 7], 5))}:`) + stepsH([
        [M(E(2) + SUB + '3' + E(1) + ':  ' + Lin([0, -4, 4], 8)), 'Quito la x de la segunda.'],
        [M(E(2) + ' : (' + MINUS + '4):  ' + Lin([0, 1, -1], -2)), 'Divido para que la y quede con un 1.'],
        [M(E(1) + SUB + '2' + E(2) + ':  ' + Lin([1, 0, 3], 3)), 'Quito la y de la primera.'],
        [M(iv('x') + ' = 3' + SUB + '3' + iv('z') + ',  ' + iv('y') + ' = ' + MINUS + '2 + ' + iv('z')), 'Paso la z a la derecha.'],
        [lineXYZ(3, -3, -2, 1), 'Llamo t a la z: son las paramétricas.']]) +
        box('chk', 'Cómo comprobarlo', 'Con dos valores de t, sustituye en las dos ecuaciones originales. t = 0: (3, −2, 0) da 3 − 4 + 0 = −1 ✓ y 9 − 4 + 0 = 5 ✓.')),
      card('Con matriz (Gauss-Jordan)', `<div class="fml">${Mat([[1, 2, 1, -1], [3, 2, 7, 5]])} → ${Mat([[1, 2, 1, -1], [0, -4, 4, 8]])} → ${Mat([[1, 2, 1, -1], [0, 1, -1, -2]])} → ${Mat([[1, 0, 3, 3], [0, 1, -1, -2]])}</div>` +
        pp('Que se lee x + 3z = 3, y − z = −2. Es lo mismo sin escribir las letras.') +
        box('err', 'Errata del material', 'El libro (p. 2-30) pone y = −2 − t. Lo correcto es y = −2 + t; la diapositiva del profesor lo tiene bien.'))] },
  { id: 'L19', part: 4, n: 19, title: 'Tres planos: posiciones relativas', goal: 'Resolver sistemas de tres ecuaciones, clasificarlos y explicar qué significan.',
    plan: ['l19.img', 'l19.rec', 'prof.e15', 'prof.e16', 'prof.e17', ['l19.punto', 'l19.recta', 'l19.incomp'], 'l19.errata'],
    theory: [
      card('Solo pueden pasar tres cosas', figHTML({ k: 'three' }) + ul([
        '<b>Un punto</b> (la esquina de una habitación: suelo y dos paredes). Sistema <b>compatible determinado</b>: una única solución.',
        '<b>Una recta</b> (las hojas de un libro abierto, que comparten el lomo). <b>Compatible indeterminado</b>: infinitas soluciones en una recta.',
        '<b>Ningún punto</b> (suelo, techo y una pared). <b>Incompatible</b>: ninguna solución.'])),
      card('Cómo lo reconoces al resolver', `<div class="tbl"><table><tbody>
        <tr><td>Cada letra acaba con un valor concreto</td><td>un punto</td></tr>
        <tr><td>Una ecuación se convierte en 0 = 0 y queda un parámetro</td><td>una recta</td></tr>
        <tr><td>Aparece 0 = un número distinto de 0</td><td>ningún punto</td></tr></tbody></table></div>` +
        stepsH([['1. Con la primera, quita la x de la segunda y de la tercera.', ''], ['2. Con la nueva segunda, quita la y de la tercera.', 'Si te conviene, intercambia antes la segunda y la tercera.'], ['3. Mira la última ecuación y clasifica.', ''], ['4. Si hay solución, termínala.', 'Hacia atrás, o con parámetro como en la lección 18.'], ['5. Escribe la conclusión con palabras.', '']])),
      card('Los tres ejercicios del profesor', ul([
        `<b>Ej. 15:</b> ${M(Lin([1, 1, 1], 9) + ',  ' + Lin([2, -1, 3], 14) + ',  ' + Lin([2, 1, -1], 0))} → el punto (1, 3, 5).`,
        `<b>Ej. 16:</b> ${M(Lin([1, 2, -1], 6) + ',  ' + Lin([2, 3, -4], 12) + ',  ' + Lin([3, 5, -5], 18))} → la tercera es la suma de las dos primeras: recta ${lineXYZ(6, 5, 0, -2)}.`,
        `<b>Ej. 17:</b> ${M(Lin([1, 2, 1], -1) + ',  ' + Lin([3, 2, 7], 5) + ',  ' + Lin([2, 4, 2], -1))} → ${M(E(3) + SUB + '2' + E(1))} da 0 = 1: incompatible.`]) +
        box('err', 'Errata del material', 'La diapositiva 44 y el libro ponen y = 2t en el ejercicio 16. De −y − 2z = 0 sale y = −2z: con y = 2t el punto (11, 2, 1) no cumple la primera ecuación.')),
      card('Cómo escribirlo en el examen', ul([
        '<b>Un punto:</b> “Sistema compatible determinado. Los tres planos se cortan en el punto (1, 3, 5).”',
        '<b>Una recta:</b> “Sistema compatible indeterminado con un grado de libertad. Los tres planos se cortan en la recta x = 6 + 5t, y = −2t, z = t.”',
        '<b>Ninguno:</b> “Sistema incompatible. No hay puntos comunes: los planos 1 y 3 son paralelos (normales proporcionales y distinto término independiente) y el plano 2 corta a ambos.”']) +
        pp('Para describir un incompatible, compara los normales: si dos son proporcionales, “dos planos paralelos y un tercero que los corta”; si lo son los tres, “tres planos paralelos”; si ninguno, “se cortan dos a dos en rectas paralelas, sin punto común”.'))] },

  { id: 'L20', part: 5, n: 20, title: 'Distancia de un punto a una recta', goal: 'La distancia de un punto a una recta con el método de la proyección.',
    plan: ['l20.concept', 'prof.e18', 'l20.num', 'l20.chain', 'prof.e22'],
    theory: [
      card('La idea', figHTML({ k: 'dline' }) + pp('La distancia es el camino más corto, que siempre es el perpendicular. Tomas un punto P de la recta y la flecha v de P a Q. Esa flecha se descompone en su sombra sobre la recta y la parte perpendicular: la distancia es lo que mide la parte perpendicular. Es la lección 12 aplicada.')),
      card('Receta', stepsH([
        ['1. Si la recta viene como corte de dos planos, pásala a paramétricas.', 'Lección 18.'],
        ['2. Un punto P de la recta (t = 0) y su director d.', 'Los números que multiplican a t.'],
        ['3. ' + M(Bv + ' = ' + ar('PQ') + ' = Q' + SUB + 'P'), ''],
        ['4. La sombra: ' + M(proyH(Bd, Bv) + ' = (' + Fh(Bd + '·' + Bv, Bd + '·' + Bd) + ')' + Bd), ''],
        ['5. La parte perpendicular: ' + M(Bv + SUB + proyH(Bd, Bv)), ''],
        ['6. La distancia es su módulo.', '']])),
      card('Ejemplo: ejercicio 18', pp(`Q = (3, −1/2, 10) y la recta ${M(iv('x') + ' = 2,  ' + iv('y') + ' = ' + MINUS + Fh(1, 2) + SUB + Fh(1, 2) + iv('t') + ',  ' + iv('z') + ' = ' + iv('t'))}.`) + stepsH([
        [M('P = (2, ' + MINUS + Fh(1, 2) + ', 0),  ' + Bd + ' = [0, ' + MINUS + '1, 2]'), 'He multiplicado el director por 2 para quitar las fracciones: apunta igual.'],
        [M(Bv + ' = Q' + SUB + 'P = [1, 0, 10]'), ''],
        [M(Bd + '·' + Bv + ' = 20,  ' + Bd + '·' + Bd + ' = 5'), 'Arriba y abajo de la proyección.'],
        [M(proyH(Bd, Bv) + ' = 4·[0, ' + MINUS + '1, 2] = [0, ' + MINUS + '4, 8]'), 'La sombra.'],
        [M(Bv + SUB + 'proy = [1, 4, 2]'), 'La parte perpendicular.'],
        [M('distancia = ' + Sq('1 + 16 + 4', true) + ' = ' + Sq(21)), '']]) +
        box('chk', 'Cómo comprobarlo', 'La parte perpendicular da producto escalar 0 con el director: [1, 4, 2]·[0, −1, 2] = 0.') +
        box('faq', '¿Por qué vale cualquier punto P?', 'Elijas el que elijas, la parte perpendicular es siempre el mismo segmento; lo que cambia es la sombra.'))] },
  { id: 'L21', part: 5, n: 21, title: 'Distancia de un punto a un plano', goal: 'La distancia de un punto a un plano con la proyección sobre el normal, y la fórmula directa.',
    plan: ['l21.mc', 'l21.pt', 'prof.e19', 'l21.num', 'l21.chain', 'l21.tf', 'l21.num'],
    theory: [
      card('La idea', figHTML({ k: 'dplane' }) + pp('La distancia de B al plano es su altura sobre él. No hace falta saber qué punto queda justo debajo: tomas otro punto A cualquiera del plano y la flecha v = AB. La sombra de v sobre el normal n, que es la dirección “vertical” respecto al plano, mide exactamente esa altura.')),
      card('Receta', stepsH([
        ['1. El normal ' + M(Bn + ' = [' + ['a', 'b', 'c'].map(iv).join(', ') + ']'), 'Leído en la ecuación.'],
        ['2. Un punto A del plano.', 'Da valor 0 a dos letras y despeja la tercera.'],
        ['3. ' + M(Bv + ' = ' + ar('AB')), ''],
        ['4. ' + M('distancia = ' + Fh('|' + Bn + '·' + Bv + '|', '‖' + Bn + '‖')), 'Es el módulo de la proyección de v sobre n, abreviado.']]) +
        pp('Ejercicio 19: B = (1, 2, 3), plano x + y − z = 1, A = (1, 1, 1): v = [0, 1, 2], n·v = −1, ‖n‖ = √3, distancia = 1/√3 = √3/3.')),
      card('Fórmula directa', fml(iv('d') + ' = ' + Fh('|' + iv('a') + sub('x', 0) + ADD + iv('b') + sub('y', 0) + ADD + iv('c') + sub('z', 0) + SUB + iv('d') + '|', Sq(iv('a') + '² + ' + iv('b') + '² + ' + iv('c') + '²', true))) +
        pp('Es el mismo cálculo que el de la proyección, compactado. Sirve para comprobar. Las barras | | quitan el signo.') +
        box('err', 'Errata del material', 'La diapositiva 54 dice “la proyección de v sobre d”, pero la fórmula usa n. En distancia a un plano se proyecta siempre sobre el normal.'))] },
];
const LESSON = Object.fromEntries(LESSONS.map(l => [l.id, l]));
const SIM_POOL = ['l10.table', 'l12.vec', 'l13.cross', 'l14.vect', 'l16.chain3p', ['l19.punto', 'l19.recta', 'l19.incomp'], 'l21.num', 'l20.num', 'l6.ab', 'l11.k'];

const ERRATAS = [
  ['Diapositiva 44 y libro (ej. 16 del profesor)', 'y = 2z, y = 2t', 'y = −2z, y = −2t. Solución: x = 6 + 5t, y = −2t, z = t'],
  ['Libro, p. 2-30 (ej. 14)', 'y = −2 − t', 'y = −2 + t (la diapositiva 39 lo tiene bien)'],
  ['Diapositiva 54 y libro (ej. 19)', '“proyección sobre d”', '“proyección sobre n”'],
  ['Libro, p. 1-12', '(u + u) + w', '(u + v) + w'],
  ['Libro, p. 1-20, def. 5', '⟨u, v⟩ = 0 si u = 0', '⟨u, u⟩ = 0 si y solo si u = 0'],
  ['Libro, ejemplo 27', 'v = (−2, 1 − 2)', 'v = (−2, 1, −2)'],
  ['Libro, ejemplo 38', 'nx = nx', 'n·x = n·p'],
  ['Libro, ejemplo 40', '“sustituir en x + 3y = 3”', '“en 2x + 3y = 3” (el resultado es correcto)'],
  ['Libro, ejemplo 41', 'P = (2, , 1/2, 0)', 'P = (2, −1/2, 0)'],
];
const FORMULAS = [
  ['Vectores', [
    ['Vector de A a B', ar('AB') + ' = B' + SUB + 'A'], ['Operaciones', 'componente a componente'], ['Paralelos', Bu + ' = ' + iv('k') + Bv],
    ['Combinación lineal', Bw + ' = ' + iv('a') + Bu + ADD + iv('b') + Bv]]],
  ['Producto escalar y lo que sale de él', [
    ['Producto escalar', Bu + '·' + Bv + ' = ' + sub('u', 1) + sub('v', 1) + ADD + sub('u', 2) + sub('v', 2) + ADD + '…'],
    ['Módulo', '‖' + Bv + '‖ = ' + Sq(sub('v', 1) + '² + ' + sub('v', 2) + '² + …', true)], ['Unitario', Bq + ' = ' + Fh(1, '‖' + Bv + '‖') + Bv],
    ['Distancia', iv('d') + '(' + Bu + ', ' + Bv + ') = ‖' + Bu + SUB + Bv + '‖'], ['Ángulo', 'cos ' + iv('φ') + ' = ' + Fh(Bu + '·' + Bv, '‖' + Bu + '‖ ‖' + Bv + '‖')],
    ['Perpendiculares', Bu + '·' + Bv + ' = 0'], ['Perpendicular en ℝ²', '[' + iv('a') + ', ' + iv('b') + '] ⟂ [' + MINUS + iv('b') + ', ' + iv('a') + ']'],
    ['Proyección', proyH(Bu, Bv) + ' = (' + Fh(Bu + '·' + Bv, Bu + '·' + Bu) + ')' + Bu]]],
  ['Producto vectorial', [['u × v', '[' + sub('u', 2) + sub('v', 3) + SUB + sub('u', 3) + sub('v', 2) + ', ' + sub('u', 3) + sub('v', 1) + SUB + sub('u', 1) + sub('v', 3) + ', ' + sub('u', 1) + sub('v', 2) + SUB + sub('u', 2) + sub('v', 1) + ']'], ['Al revés', Bv + '×' + Bu + ' = ' + MINUS + '(' + Bu + '×' + Bv + ')']]],
  ['Rectas', [
    ['General (ℝ²)', iv('a') + iv('x') + ADD + iv('b') + iv('y') + ' = ' + iv('c') + ',  ' + Bn + ' = [' + iv('a') + ', ' + iv('b') + ']'], ['Normal', Bn + '·' + Bx + ' = ' + Bn + '·' + Bp],
    ['Vectorial', Bx + ' = ' + Bp + ADD + iv('t') + Bd], ['Director desde n (ℝ²)', Bd + ' = [' + MINUS + iv('b') + ', ' + iv('a') + ']'], ['Por dos puntos', Bd + ' = ' + ar('PQ')]]],
  ['Planos', [
    ['General', iv('a') + iv('x') + ADD + iv('b') + iv('y') + ADD + iv('c') + iv('z') + ' = ' + iv('d') + ',  ' + Bn + ' = [' + ['a', 'b', 'c'].map(iv).join(', ') + ']'],
    ['Vectorial', Bx + ' = ' + Bp + ADD + iv('s') + Bu + ADD + iv('t') + Bv], ['Por tres puntos', Bu + ' = ' + ar('PQ') + ',  ' + Bv + ' = ' + ar('PR') + ',  ' + Bn + ' = ' + Bu + '×' + Bv + ',  ' + iv('d') + ' = ' + Bn + '·P']]],
  ['Sistemas', [
    ['Operaciones', 'intercambiar, multiplicar por k ≠ 0, sumar un múltiplo de otra'],
    ['Un valor para cada letra', 'un punto (compatible determinado)'], ['0 = 0 y un parámetro', 'una recta (compatible indeterminado)'], ['0 = k ≠ 0', 'sin solución (incompatible)']]],
  ['Distancias', [
    ['Punto–recta', '‖' + Bv + SUB + proyH(Bd, Bv) + '‖'], ['Punto–plano', Fh('|' + Bn + '·' + ar('AB') + '|', '‖' + Bn + '‖')],
    ['Punto–plano (directa)', Fh('|' + iv('a') + sub('x', 0) + ADD + iv('b') + sub('y', 0) + ADD + iv('c') + sub('z', 0) + SUB + iv('d') + '|', Sq(iv('a') + '² + ' + iv('b') + '² + ' + iv('c') + '²', true))]]],
];
const COS_ROWS = [['0°', '1'], ['30°', Fh(Sq(3), 2)], ['45°', Fh(Sq(2), 2)], ['60°', Fh(1, 2)], ['90°', '0'], ['120°', MINUS + Fh(1, 2)], ['135°', MINUS + Fh(Sq(2), 2)], ['150°', MINUS + Fh(Sq(3), 2)], ['180°', MINUS + '1']];

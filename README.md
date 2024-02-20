# Juego de Breakout

Este juego de Breakout es una implementación simple del clásico juego de arcade. El objetivo es destruir todos los bloques en la pantalla utilizando una bola y una paleta controlada por el jugador. El juego presenta una mecánica de rebote y la posibilidad de ganar puntos al destruir bloques.

## Instrucciones de Juego

- Utiliza las flechas izquierda y derecha para mover la paleta y evitar que la bola caiga fuera de la pantalla.
- La bola rebota en las paredes y en la paleta. Destruye los bloques golpeándolos con la bola.
- Ganas puntos por cada bloque destruido. El juego termina cuando todos los bloques son destruidos o todas la bolas caen fuera de la zona de juego.

## Características principales
 
1. Objeto bola, y bolas adicionales.
  ```javascript
// Objeto bola
const bola = {
  x: BOLA_X,
  y: BOLA_Y,
  size: BOLA_SIZE,
  velocidad: BOLA_VELOCIDAD,
  dx: BOLA_DX,
  dy: BOLA_DY,
  visible: true,
  maestra: true
};

// Función para crear una nueva bola
function crearNuevaBola(x, y, bola) {
  const nuevaBola = {
    x: x,
    y: y,
    size: BOLA_SIZE,
    velocidad: BOLA_VELOCIDAD,
    dx: -bola.dx, // Cambiar la dirección en X
    dy: -bola.dy, // Cambiar la dirección en Y
    visible: true,
    maestra: false
  };

  // Agregar la nueva bola al array de bolas adicionales
  bolasAdicionales.push(nuevaBola);
}
```
2. Mecánica de colision de bloques.
  ```javascript
  // Colisión con los bloques
bloques.forEach(grupo => {
  grupo.forEach(bloque => {
    if (bloque.visible) {
      if (
        bola.x - bola.size > bloque.x && // Chequeo de colisión por la izquierda
        bola.x + bola.size < bloque.x + bloque.w && // Chequeo de colisión por la derecha
        bola.y + bola.size > bloque.y && // Chequeo de colisión por arriba
        bola.y - bola.size < bloque.y + bloque.h // Chequeo de colisión por abajo
      ) {
        bola.dy *= -1; // La bola rebota hacia arriba
        bloque.visible = false; // El bloque desaparece

        if (bloque.duplicaBola) {
          // Si el bloque duplica la bola, se crea una nueva bola
          crearNuevaBola(bloque.x + bloque.w / 2, bloque.y + bloque.h / 2, bola);
        }
        actualizaPuntuacion(); // Se actualiza la puntuación del jugador
      }
    }
  });
});
```
3. Puntuación actualizada en tiempo real.
  ```javascript
    // Actualiza la puntuación del jugador
function actualizaPuntuacion() {
  puntuacion++; // Incrementa la puntuación en 1
  crearSpans(); // Crea un span con el texto "+1"
  if (puntuacion === numBloques) {
    // Si la puntuación alcanza el número total de bloques, el juego termina
    bola.visible = false;
    paleta.visible = false;
    bolasAdicionales = [];
    juegoTerminado = true;
    setTimeout(function () {
      numBloques = 0;
      reiniciarJuego(); // Reinicia el juego después de un retraso
    }, delay);
  }
}
```
4. Pausa y reanuda el juego con la barra espaciadora.
```javascript
// Función para pausar o reanudar el juego
function pausaJuego() {
  juegoPausado = !juegoPausado; // Cambia el estado de pausa entre verdadero y falso

  if (juegoPausado) {
    // Si el juego está pausado, cancela la animación
    cancelAnimationFrame(animationId);
  } else {
    // Si el juego se reanuda, llama a la función de actualización del juego
    update();
  }
}
```
5. Patrones en la creacion de bloques
```javascript
// Patrones bloques
const bloques = [];
const centroX = Math.floor(nColumnasBloques / 2); // Centro en la columna
const centroY = Math.floor(nFilasBloques / 2); // Centro en la fila
const patrones = [
  (i, j) => (i + j) % 3 !== 0,  // Patrón 1: Suma de coordenadas no divisible por 3
  (i, j) => (i + j) % 2 !== 0,  // Patrón 2: Suma de coordenadas no divisible por 2
  (i, j) => i === centroX || j === centroY || Math.abs(i - centroX) === Math.abs(j - centroY), // Patrón 3: Cruces
  (i, j) => Math.abs(i - centroX) + Math.abs(j - centroY) <= centroX // Patrón 4: Círculo
];

// Crear conjunto de bloques
function crearBloques() {
  const randomIndex = Math.floor(Math.random() * patrones.length);
  const patronElegido = patrones[randomIndex];
  numBloques = 0;
  for (let i = 0; i < nColumnasBloques; i++) {
    bloques[i] = [];
    for (let j = 0; j < nFilasBloques; j++) {
      if (patronElegido(i, j)) {
        const x = i * (iBloque.w + iBloque.padding) + iBloque.offsetX;
        const y = j * (iBloque.h + iBloque.padding) + iBloque.offsetY;
        const duplicaBola = Math.random() < 0.1;
        const color = getRandomColor();
        bloques[i][j] = { x, y, ...iBloque, duplicaBola, color };
        numBloques++;
      }
    }
  }
}
```

## Controles

- Flechas Izquierda/Derecha: Mover la paleta.
- Barra Espaciadora: Pausar/Reanudar el juego.

## Cómo Jugar

1. Abre el juego en tu navegador.
2. Utiliza las flechas izquierda y derecha para mover la paleta.
3. Golpea la bola con la paleta para destruir los bloques y ganar puntos.
4. Intenta alcanzar la puntuación más alta posible.

¡Diviértete jugando! 🎮



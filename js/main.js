const btnReglas = document.getElementById("btn-reglas");
const btnCierra = document.getElementById("btn-cerrar");
const spans = document.getElementById("spansContainer")
const reglas = document.getElementById("reglas");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


let juegoTerminado = false;
let juegoPausado = false;
let juegoIniciado = false;
let puntuacion = 0;
let numBloques = 0;
const nColumnasBloques = 9;
const nFilasBloques = 5;
const delay = 3000;
const BOLA_X = canvas.width / 2;
const BOLA_Y = canvas.height / 2 + 270;
const BOLA_SIZE = 10;
const BOLA_VELOCIDAD = 2;
const BOLA_DX = 2;
const BOLA_DY = 2;
const PALETA_X = canvas.width / 2 - 40;
const PALETA_Y = canvas.height - 20;
const PALETA_W = 80;
const PALETA_H = 10;
const PALETA_VELOCIDAD = 8;
const PALETA_DX = 0;

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

//Array de bolas.
let bolasAdicionales = [];
bolasAdicionales[0] = bola;

// Objeto paleta
const paleta = {
  x: PALETA_X,
  y: PALETA_Y,
  w: PALETA_W,
  h: PALETA_H,
  velocidad: PALETA_VELOCIDAD,
  dx: PALETA_DX,
  visible: true,
};

// Objeto Bloque (individual)
const iBloque = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  color: "#0000",
  visible: true,
  duplicaBola: false
};


function getRandomColor(){
  const codigo = '0123456789ABCDEF';
    let color = '#';
    do {
        color = '#';
        for (let i = 0; i < 6; i++) {
            color += codigo[Math.floor(Math.random() * 16)];
        }
    } while (color === '#FFFFFF'); //Para que no salga blanco
    return color;
}

//Patrones bloques
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

crearBloques();

// Dibuja la bola
function dibujaBola(bola) {
  ctx.beginPath();
  ctx.arc(bola.x, bola.y, bola.size, 0, Math.PI * 2);
  ctx.fillStyle = bola.visible ? "#0095dd" : "transparent";
  ctx.fill();
  ctx.closePath();
}

function dibujaBolas() {
  if (!juegoTerminado) {
    bolasAdicionales.forEach(bola => {
      if (bola !== null) {
        dibujaBola(bola);
      }
    });
  }
}

// Dibuja la paleta
function dibujaPaleta() {
  ctx.beginPath();
  ctx.rect(paleta.x, paleta.y, paleta.w, paleta.h);
  ctx.fillStyle = paleta.visible ? "#0095dd" : "transparent";
  ctx.fill();
  ctx.closePath();
}


// Dibuja la puntuación
function dibujaPuntuacion() {
  ctx.font = "10px 'Press Start 2P', Arial";
  ctx.fillText(`Puntos: ${puntuacion}`, canvas.width - 100, 30);
}

// Dibuja los bloques
function dibujaMuro() {
  bloques.forEach((grupo) => {
    grupo.forEach((bloque) => {
      ctx.beginPath();
      ctx.rect(bloque.x, bloque.y, bloque.w, bloque.h);
      ctx.fillStyle = bloque.visible ? bloque.color : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

// Mover la paleta izquierda y derecha
function muevePaleta() {
  paleta.x += paleta.dx;

  // Wall detection
  if (paleta.x + paleta.w > canvas.width) {
    paleta.x = canvas.width - paleta.w;
  }

  if (paleta.x < 0) {
    paleta.x = 0;
  }
}

// Mueve la bola por el canvas
// Mueve la bola por el canvas
function mueveBola(bola) {
  bola.x += bola.dx;
  bola.y += bola.dy;

  // Colisión con paredes izquierda o derecha
  if (bola.x + bola.size > canvas.width || bola.x - bola.size < 0) {
    bola.dx *= -1;
  }

  // Colisión con paredes superior o inferior
  if (bola.y + bola.size > canvas.height || bola.y - bola.size < 0) {
    bola.dy *= -1;
  }

  // Colisión con la paleta
  if (
    bola.x - bola.size > paleta.x &&
    bola.x + bola.size < paleta.x + paleta.w &&
    bola.y + bola.size > paleta.y
  ) {
    bola.dy = -bola.velocidad;
  }

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
          bola.dy *= -1; // rebota con 45º
          bloque.visible = false; // el bloque desaparece

          if (bloque.duplicaBola) {
            crearNuevaBola(bloque.x + bloque.w / 2, bloque.y + bloque.h / 2, bola);
          }
          actualizaPuntuacion();
        }
      }
    });
  });

  if (bola.y + bola.size > canvas.height) {
    if (bola.maestra) {
      bola.velocidad = 0;
      bola.dy = 0;
      bola.dx = 0;
      bolasAdicionales = bolasAdicionales.slice(0)
    }
    bolasAdicionales = bolasAdicionales.filter(b => b !== bola);
    if (bolasAdicionales.length == 0) {
      bolasAdicionales = [];
      juegoTerminado = true;
      bola.visible = false;
      bola.velocidad = 0;
      bola.dy = 0;
      bola.dx = 0;
      paleta.visible = false;
      setTimeout(function () {
        reiniciarJuego();
      }, delay)
    }
  }
}
// Actualiza puntuacion
function actualizaPuntuacion() {
  puntuacion++;
  crearSpans();
  if (puntuacion === numBloques) {
    bola.visible = false;
    paleta.visible = false;
    bolasAdicionales = [];
    juegoTerminado = true;
    setTimeout(function () {
      numBloques = 0;
      reiniciarJuego();
    }, delay)
  }
}


function reiniciarJuego() {
  numBloques = 0;
  crearBloques();
  //Bloques
  dibujaMuro();
  paleta.x = PALETA_X;
  paleta.y = PALETA_Y;
  paleta.visible = true;
  bola.x = BOLA_X;
  bola.y = BOLA_Y;
  bola.visible = true;
  bola.velocidad = BOLA_VELOCIDAD;
  // Reiniciar la puntuación
  puntuacion = 0;
  if (bolasAdicionales.length == 0) {
    bolasAdicionales.push(bola);
  }
  dibujaBolas();
  juegoIniciado = false;
  juegoTerminado = false;
}

// Dibujar el canvas
function dibujaTodo() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dibujaBolas();
  dibujaPaleta();
  dibujaPuntuacion();
  dibujaMuro();
}


// Función para pausar el juego
function update() {
  if (!juegoPausado && juegoIniciado) {
    muevePaleta();

    //Bola principal
    mueveBola(bola);
    dibujaBola(bola);

    //Bolas extras
    bolasAdicionales.forEach(bola => {
      mueveBola(bola);
      dibujaBola(bola);
    });
  }
  dibujaTodo();
  animationId = requestAnimationFrame(update);
}

function crearSpans() {
  // Crea un nuevo elemento span
  const nuevoSpan = document.createElement('span');
  nuevoSpan.textContent = '+1';
  spans.appendChild(nuevoSpan);
}


// Función para pausar el juego
function pausaJuego() {
  juegoPausado = !juegoPausado;
  if (juegoPausado) {
    cancelAnimationFrame(animationId);
  } else {
    update();
  }
}

let animationId = requestAnimationFrame(update);
update();

function iniciarJuego(e) {
  if (!juegoIniciado) {
    if (e.key !== "ArrowRight" || e.key !== "ArrowLeft") {
      bola.dx = BOLA_DX;
      bola.dy = BOLA_DY;
      juegoIniciado = true;
    }
  }
}



// Keydown event
function keyDown(e) {
  if (e.key === " ") {
    pausaJuego();
  } else if (e.key === "Right" || e.key === "ArrowRight") {
    paleta.dx = paleta.velocidad;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paleta.dx = -paleta.velocidad;
  }

  if (!juegoIniciado) {
    iniciarJuego(e)
  }
}

// Keyup event
function keyUp(e) {
  if ((e.key === "Right" || e.key === "ArrowRight") && paleta.dx > 0) {
    paleta.dx = 0;
  } else if ((e.key === "Left" || e.key === "ArrowLeft") && paleta.dx < 0) {
    paleta.dx = 0;
  }
}

// Agrega event listeners para los eventos de teclado
document.addEventListener("keyup", keyUp);
document.addEventListener("keydown", keyDown);

// Muestra reglas
btnReglas.addEventListener('click', () => reglas.classList.add('mostrar'));
btnCierra.addEventListener('click', () => reglas.classList.remove('mostrar'));

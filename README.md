# Juego de Breakout

Este juego de Breakout es una implementación simple del clásico juego de arcade. El objetivo es destruir todos los bloques en la pantalla utilizando una bola y una paleta controlada por el jugador. El juego presenta una mecánica de rebote y la posibilidad de ganar puntos al destruir bloques.

## Instrucciones de Juego

- Utiliza las flechas izquierda y derecha para mover la paleta y evitar que la bola caiga fuera de la pantalla.
- La bola rebota en las paredes y en la paleta. Destruye los bloques golpeándolos con la bola.
- Ganas puntos por cada bloque destruido. El juego termina cuando todos los bloques son destruidos o todas la bolas caen fuera de la zona de juego.

## Características

- Implementación simple del juego de Breakout.
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
- Puntuación actualizada en tiempo real.
- Pausa y reanuda el juego con la barra espaciadora.
- Reglas del juego disponibles para referencia.

## Controles

- Flechas Izquierda/Derecha: Mover la paleta.
- Barra Espaciadora: Pausar/Reanudar el juego.

## Cómo Jugar

1. Abre el juego en tu navegador.
2. Utiliza las flechas izquierda y derecha para mover la paleta.
3. Golpea la bola con la paleta para destruir los bloques y ganar puntos.
4. Intenta alcanzar la puntuación más alta posible.

¡Diviértete jugando!



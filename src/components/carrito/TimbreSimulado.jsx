const FILAS = 12
const COLUMNAS = 60

// Genera las barras de forma determinista a partir de la semilla
function generarBarras(semilla) {
    let estado = 0
    for (const caracter of String(semilla)) {
        estado = (estado * 31 + caracter.charCodeAt(0)) >>> 0
    }
    function aleatorio() {
        estado = (estado * 1664525 + 1013904223) >>> 0
        return estado / 4294967296
    }

    const barras = []
    for (let fila = 0; fila < FILAS; fila++) {
        // patrón fijo de inicio y fin, como en un PDF417 real
        barras.push({ x: 0, y: fila * 5, ancho: 4 })
        let x = 6
        while (x < COLUMNAS * 3) {
            const ancho = 1 + Math.floor(aleatorio() * 3)
            if (aleatorio() > 0.45) {
                barras.push({ x, y: fila * 5, ancho })
            }
            x += ancho + 1
        }
        barras.push({ x: COLUMNAS * 3 + 4, y: fila * 5, ancho: 4 })
    }
    return barras
}

// Dibujo tipo código PDF417 (como el timbre electrónico del SII).
// Es solo decorativo: no tiene validez tributaria.
function TimbreSimulado({ semilla = "PCFORGERY" }) {
    const barras = generarBarras(semilla)

    return (
        <svg
            className="timbre-svg"
            viewBox={`0 0 ${COLUMNAS * 3 + 8} ${FILAS * 5}`}
            preserveAspectRatio="none"
            role="img"
            aria-label="Timbre electrónico simulado"
        >
            {barras.map(barra => (
                <rect key={`${barra.y}-${barra.x}`} x={barra.x} y={barra.y} width={barra.ancho} height={5} />
            ))}
        </svg>
    )
}

export default TimbreSimulado

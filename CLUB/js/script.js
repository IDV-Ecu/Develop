// BOTÓN DESCARGAR LOGS (ADMIN)
document.addEventListener("DOMContentLoaded", () => {
    const rol = sessionStorage.getItem("rol");
    const btnLogs = document.getElementById("btnDescargarLogs");
    /**activar para que el rol admin descargue logs */
    if (rol === "") {
        btnLogs.style.display = "inline-flex";
    }
});

document.getElementById("btnDescargarLogs")
    ?.addEventListener("click", abrirModalLogs);

// MODAL LOGS
function abrirModalLogs() {
    document.getElementById("modalLogs").style.display = "flex";
}

function cerrarModalLogs() {
    document.getElementById("modalLogs").style.display = "none";
}

function confirmarDescargaLogs() {
    cerrarModalLogs();
    descargarLogs();
}
// MODAL CERRAR SESIÓN
const modalCerrar = document.getElementById("modalCerrarSesion");

function abrirModalCerrar() {
    modalCerrar.style.display = "flex";
}

function cerrarModalCerrar() {
    modalCerrar.style.display = "none";
}

async function confirmarCerrarSesion() {
    await registrarLog("Cierre de sesión manual");
    sessionStorage.clear();
    window.location.replace("../index.html");
}

// CIERRE DE SESIÓN POR INACTIVIDAD
const TIEMPO_INACTIVIDAD = 5 * 60 * 1000;
let temporizadorInactividad;

function reiniciarInactividad() {
    clearTimeout(temporizadorInactividad);

    temporizadorInactividad = setTimeout(() => {
        cerrarSesionPorInactividad();
    }, TIEMPO_INACTIVIDAD);
}

async function cerrarSesionPorInactividad() {
    await registrarLog("Cierre de sesión por inactividad");
    sessionStorage.clear();
    window.location.replace("index.html");
}

// eventos que indican actividad
["mousemove", "keydown", "click", "scroll", "touchstart"].forEach(evento => {
    document.addEventListener(evento, reiniciarInactividad);
});

// iniciar contador
reiniciarInactividad();

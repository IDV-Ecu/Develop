// elaborado por: Edison Tene
// =======================================

// bandera para activar las imagenes
const mostrarImagenes = 1;

// CONFIGURACIÓN DE BOTONES
const botones = {
    btn1: {
        texto: "Power BI",
        imagen: "img/biN.png"
    },
    btn2: {
        texto: "Excel",
        imagen: "img/excel.png"
    },
    btn3: {
        texto: "Drive",
        imagen: "img/drive.png"
    },
    btn4: {
        texto: "Perfil",
        imagen: "" // puedes poner img/perfil.png si deseas
    },
    btn5: {
        texto: "boton 5",
        imagen: ""
    },
    btn6: {
        texto: "boton 6",
        imagen: ""
    },
    btn7: {
        texto: "boton 7",
        imagen: ""
    },
    btn8: {
        texto: "boton 8",
        imagen: ""
    }
};

// LINKS DE LOS BOTONES
const links = {
    btn1: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn2: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn3: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn4: "perfil.html", // PERFIL
    btn5: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn6: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn7: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn8: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link"
};

// CARGA DE BOTONES
document.addEventListener("DOMContentLoaded", () => {

    Object.keys(botones).forEach(id => {
        const boton = document.getElementById(id);
        if (!boton) return;

        boton.innerHTML = "";

        // imagen
        if (mostrarImagenes === 1 && botones[id].imagen) {
            const img = document.createElement("img");
            img.src = botones[id].imagen;
            img.className = "icono";
            img.alt = botones[id].texto;
            boton.appendChild(img);
        }

        // texto
        const span = document.createElement("span");
        span.textContent = botones[id].texto;
        boton.appendChild(span);

        // evento click
        boton.addEventListener("click", () => {
            const url = links[id];
            if (!url) return;

            // páginas internas
            if (url.endsWith(".html")) {
                window.location.href = url;
            } else {
                // enlaces externos
                window.open(url, "_blank");
            }
        });
    });
});

// ===============================
// BOTÓN DESCARGAR LOGS (ADMIN)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    const rol = sessionStorage.getItem("rol");
    const btnLogs = document.getElementById("btnDescargarLogs");

    if (rol === "admin") {
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

// ===============================
// MODAL CERRAR SESIÓN
// ===============================
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
    window.location.replace("index.html");
}

// ===============================
// CIERRE DE SESIÓN POR INACTIVIDAD
// ===============================
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

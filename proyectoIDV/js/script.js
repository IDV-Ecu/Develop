//elaborado por:Edison Tene
//bandera para activar las imagenes
const mostrarImagenes = 1;

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
        texto: "boton 4",
        imagen: ""
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

document.addEventListener("DOMContentLoaded", () => {

    Object.keys(botones).forEach(id => {
        const boton = document.getElementById(id);
        if (!boton) return;

        boton.innerHTML = "";

        const span = document.createElement("span");
        span.textContent = botones[id].texto;

        if (mostrarImagenes === 1 && botones[id].imagen) {
            const img = document.createElement("img");
            img.src = botones[id].imagen;
            img.className = "icono";
            img.alt = botones[id].texto;
            boton.appendChild(img);
        }

        boton.appendChild(span);

        boton.addEventListener("click", () => {
            const url = links[id];
            if (url) {
                window.open(url, "_blank");
            }
        });
    });

});

/*validar el boton de descargar los logs solo para usuario administrador */
document.addEventListener("DOMContentLoaded", () => {
    const rol = sessionStorage.getItem("rol");
    const btnLogs = document.getElementById("btnDescargarLogs");

    if (rol === "admin") {
        btnLogs.style.display = "inline-flex";
    }
});

document.getElementById("btnDescargarLogs")
    ?.addEventListener("click", abrirModalLogs);


/*modal para descargar los logs */
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


// links a los botones por su id para redireccionar a diferentes paginas
const links = {
    btn1: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn2: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn3: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn4: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn5: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn6: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn7: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn8: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link"
};

// Recorremos el objeto y asignamos el evento
const modalCerrar = document.getElementById("modalCerrarSesion");

function abrirModalCerrar() {
    modalCerrar.style.display = "flex";
}

function cerrarModalCerrar() {
    modalCerrar.style.display = "none";
}

/*function confirmarCerrarSesion() {
    sessionStorage.clear(); 
    window.location.replace("index.html");
}*/

async function confirmarCerrarSesion() {
    await registrarLog("Cierre de sesión manual");
    sessionStorage.clear();
    window.location.replace("index.html");
}


/*cerrar session por inactividad */
const TIEMPO_INACTIVIDAD = 5 * 60 * 1000;
let temporizadorInactividad;


function reiniciarInactividad() {
    clearTimeout(temporizadorInactividad);

    temporizadorInactividad = setTimeout(() => {
        cerrarSesionPorInactividad();
    }, TIEMPO_INACTIVIDAD);
}
// cerrar sesión automático
/*function cerrarSesionPorInactividad() {
    sessionStorage.clear();
    window.location.replace("index.html");
}*/
async function cerrarSesionPorInactividad() {
    await registrarLog("Cierre de sesión por inactividad");
    sessionStorage.clear();
    window.location.replace("index.html");
}


// eventos que indican actividad
["mousemove", "keydown", "click", "scroll", "touchstart"].forEach(evento => {
    document.addEventListener(evento, reiniciarInactividad);
});

// iniciar contador al cargar
reiniciarInactividad();

// elaborado por: Edison Tene
// =======================================

// bandera para activar las imagenes
const mostrarImagenes = 1;

// CONFIGURACIÓN DE BOTONES
const botones = {
    btn1: {
        texto: "Power BI",
        imagen: "../img/perfil/biN.png"
    },
    btn2: {
        texto: "Excel",
        imagen: "../img/perfil/excel.png"
    },
    btn3: {
        texto: "Drive",
        imagen: "../img/perfil/drive.png"
    },
    btn4: {
        texto: "Perfil",
        imagen: "../img/perfil/formulario.png"
    }
};

// LINKS DE LOS BOTONES
const links = {
    btn1: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn2: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn3: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn4: "perfil.html", // PERFIL
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

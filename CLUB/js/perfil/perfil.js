
const mostrarImagenes = 1;

const botones = {
    btn1: { texto: "Power BI", imagen: "img/biN.png" },
    btn2: { texto: "Excel", imagen: "img/excel.png" },
    btn3: { texto: "Drive", imagen: "img/drive.png" },
    btn4: { texto: "Perfil", imagen: "img/perfil.png" }
};

const links = {
    btn1: "https://www.microsoft.com/es-es/power-platform/products/power-bi",
    btn2: "https://docs.google.com/spreadsheets/d/1JHbBfvox",
    // btn3: "https://drive.google.com",
    btn4: "perfil.html",
};

document.addEventListener("DOMContentLoaded", () => {

    Object.keys(botones).forEach(id => {
        const boton = document.getElementById(id);
        if (!boton) return;

        boton.innerHTML = "";

        if (mostrarImagenes && botones[id].imagen) {
            const img = document.createElement("img");
            img.src = botones[id].imagen;
            img.className = "icono";
            boton.appendChild(img);
        }

        const span = document.createElement("span");
        span.textContent = botones[id].texto;
        boton.appendChild(span);

        boton.addEventListener("click", () => {
            const url = links[id];
            if (!url) return;

            if (url.endsWith(".html")) {
                window.location.href = url;
            } else {
                window.open(url, "_blank");
            }
        });
    });
});


function volverMenu(){
    window.location.href = "menu.html";
}

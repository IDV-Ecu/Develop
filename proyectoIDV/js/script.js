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

        //creamos el texto en cada boton
        const span = document.createElement("span");
        span.textContent = botones[id].texto;

        //con la bandera activamos la imagen con 1 y si no en 0 solo aparece el texto
        if (mostrarImagenes === 1) {
            const img = document.createElement("img");
            img.src = botones[id].imagen;
            img.className = "icono";
            img.alt = botones[id].texto;
            boton.appendChild(img);
        }

        boton.appendChild(span);
    });

});


// links a los botones por su id para redireccionar a diferentes paginas
const links = {
    btn1: "https://drive.google.com/drive/folders/1G7foOv8dD8V6Q1NKoXb3M1FliWNdt4kN",
    btn2: "https://drive.google.com/drive/folders/188_XwW-ViAipf1uuk7j2-LJbE6_D1wR8",
    btn3: "",
    btn4: "",
    btn5: "",
    btn6: "",
    btn7: "",
    btn8: ""
};

// Recorremos el objeto y asignamos el evento
Object.keys(links).forEach(id => {
    const boton = document.getElementById(id);

    if (boton) {
        boton.addEventListener("click", () => {
            window.open(links[id], "_blank");
        });
    }
});

//elaborado por:Edison Tene
//bandera para activar las imagenes
const mostrarImagenes = 1;

/*contraseña para el power bi por boton*/
const passwordB = "admin";
let urlPendiente = null;


function abrirModalPassword(url) {
    urlPendiente = url;
    document.getElementById("inputPassword").value = "";
    document.getElementById("modalPassword").style.display = "flex";
}

function cerrarModalPassword() {
    document.getElementById("modalPassword").style.display = "none";
}

function validarPassword() {
    const input = document.getElementById("inputPassword");
    const error = document.getElementById("errorPassword");
    const ingreso = input.value;

    if (ingreso === passwordB) {
        // limpiar campo
        input.classList.remove("input-error");
        error.style.display = "none";

        cerrarModalPassword();
        window.open(urlPendiente, "_blank");
    } else {
        // se va a mostrar el error en la misma modal
        input.value = "";
        input.classList.add("input-error");
        error.style.display = "block";
        input.focus();
    }
}

const botones = {
    btn1: {
        //boton 1
        texto: "Power BI Ecuador",
        imagen: "../img/scouting/biN.png"
    },
    btn2: {
        //bton 2
        texto: "Excel",
        imagen: "../img/scouting/excel.png"
    },
    btn3: {
        //boton 3
        texto: "Drive",
        imagen: "../img/scouting/drive.png"
    },
    btn4: {
        //boton 4
        texto: "Power BI Colombia",
        imagen: "../img/scouting/biCol.png"
    },
    btn5: {
        //boton 5
        texto: "Drive",
        imagen: "../img/scouting/drive.png"
    },
    btn6: {
        //bton 6
        texto: "Drive",
        imagen: "../img/scouting/drive.png"
    },
    btn7: {
        //boton 7
        texto: "Drive",
        imagen: "../img/scouting/drive.png"
    },
    btn8: {
        //btoon 8
        texto: "Drive",
        imagen: "../img/scouting/drive.png"
    },
    btn9: {
        //boton 9
        texto: "Drive",
        imagen: "../img/scouting/drive.png"
    },
    btn10: {
        //boton 10
        texto: "Drive",
        imagen: "../img/scouting/drive.png"
    },
    btn11: {
        //boton 11
        texto: "Drive",
        imagen: "../img/scouting/drive.png"
    },
    btn12: {
        //boton 12
        texto: "Drive",
        imagen: "../img/scouting/drive.png"
    },
    btn13: {
        //botn 13
        texto: "Drive",
        imagen: "../img/scouting/drive.png"
    },
    btn14: {
        //boton 14
        texto: "Drive",
        imagen: "../img/scouting/drive.png"
    },
    btn15: {
        //botn 15
        texto: "Drive",
        imagen: "../img/scouting/drive.png"
    }

};

// links a los botones por su id para redireccionar a diferentes paginas
const links = {
    btn1: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn2: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn3: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn4: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn5: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn6: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn7: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn8: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn9: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn10: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn11: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn12: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn13: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn14: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link",
    btn15: "https://drive.google.com/drive/folders/1YrnXw0h0j0dRZu3rSK6SZT9ph6pIKzxd?usp=drive_link"

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
            if (!url) return;

            if (id === "btn1" || id === "btn4") {
                abrirModalPassword(url);
            } else {
                window.open(url, "_blank");
            }
        });
    });

});
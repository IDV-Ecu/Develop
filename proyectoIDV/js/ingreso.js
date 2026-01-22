/*VALIDAR EL LOGIN DEL SISTEMA*/
document.getElementById("btnLogin").addEventListener("click", () => {

    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

    if (usuario === "" || password === "") {
        mostrarModal(
            "Información incompleta",
            "Por favor, ingrese su usuario y contraseña para continuar."
        );
        return;
    }

    // valida usuario y clave
    //if (usuario === "admin" && password === "123IDV") {
    if (password === "123IDV") {
        sessionStorage.setItem("login", "ok");
        window.location.href = "menu.html";
    } else {
        mostrarModal(
            "Acceso denegado",
            "Las credenciales ingresadas no son válidas. Verifique la información e intente nuevamente."
        );
    }
});

function mostrarModal(titulo, mensaje) {
    document.querySelector(".modal-content h2").innerText = titulo;
    document.getElementById("textoModal").innerText = mensaje;
    document.getElementById("modalMensaje").style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modalMensaje").style.display = "none";
}

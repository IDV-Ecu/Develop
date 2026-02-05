//elaborado por:Edison Tene
/*VALIDAR EL LOGIN DEL SISTEMA*/
history.pushState(null, null, location.href);

window.addEventListener("popstate", () => {
    history.pushState(null, null, location.href);
});

/*validacion del enter */
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        document.getElementById("btnLogin").click();
    }
});


//document.getElementById("btnLogin").addEventListener("click", () => {
document.getElementById("btnLogin").addEventListener("click", async () => {


    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!usuario || !password) {
        mostrarModal(
            "Información incompleta",
            "Por favor, ingrese su usuario y contraseña."
        );
        return;
    }

    const usuarioValido = USUARIOS.find(u =>
        u.usuario === usuario && u.clave === password
    );

    if (usuarioValido) {

        sessionStorage.setItem("login", "ok");
        sessionStorage.setItem("usuario", usuarioValido.usuario);
        sessionStorage.setItem("rol", usuarioValido.rol);

        await registrarLog("Inicio de sesión");

        window.location.replace("menu.html");

    } else {
        mostrarModal(
            "Acceso denegado",
            "Usuario o contraseña incorrectos."
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

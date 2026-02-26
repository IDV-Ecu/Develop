
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

    //rutas de los menu
    const rutasPorArea = {
        Scouting: "scouting/menu.html",
        Perfil: "perfil/menu.html",
    };

    const usuarioValido = USUARIOS.find(u =>
        u.usuario === usuario && u.clave === password
    );

    //valida el menu segun el area 
    const area = document.getElementById("area").value;

    if (!area) {
        mostrarModal(
            "Área requerida",
            "Debe seleccionar un área para continuar."
        );
        return;
    }

    if (usuarioValido) {

        sessionStorage.setItem("login", "ok");
        sessionStorage.setItem("usuario", usuarioValido.usuario);
        sessionStorage.setItem("rol", usuarioValido.rol);

        await registrarLog("Inicio de sesión");

        const rutaMenu = rutasPorArea[area];

        if (!rutaMenu) {
            mostrarModal(
                "Error de configuración",
                "El área seleccionada no tiene menú asignado."
            );
            return;
        }

        window.location.replace(rutaMenu);
        sessionStorage.setItem("area", area);

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

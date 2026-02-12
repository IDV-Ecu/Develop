// validacion y bloqueo de opciones por menu 
(function () {

    const login = sessionStorage.getItem("login");
    const areaSesion = sessionStorage.getItem("area");

    // Si no hay sesión → fuera
    if (login !== "ok") {
        window.location.replace("../index.html");
        return;
    }

    const ruta = window.location.pathname.toLowerCase();

    // Validar según carpeta
    if (ruta.includes("scouting") && areaSesion !== "Scouting") {
        window.location.replace("../index.html");
        return;
    }

    if (ruta.includes("perfil") && areaSesion !== "Perfil") {
        window.location.replace("../index.html");
        return;
    }

})();

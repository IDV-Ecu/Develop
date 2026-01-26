/*CREACION DEL LOG DEl SISTEMA */
/*async function obtenerIP() {
    try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        return data.ip;
    } catch (error) {
        return "IP no disponible";
    }
}*/
async function obtenerIP() {
    try {
        if (location.protocol === "file:") {
            return "IP no disponible (local)";
        }

        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        return data.ip;

    } catch (error) {
        console.error("Error IP:", error);
        return "IP no disponible";
    }
}


// obtener tipo de dispositivo
function obtenerDispositivo() {
    const ua = navigator.userAgent;

    if (/mobile/i.test(ua)) return "Móvil";
    if (/tablet/i.test(ua)) return "Tablet";
    return "PC / Laptop";
}

// registrar log
async function registrarLog(accion) {
    const usuario = sessionStorage.getItem("usuario") || "Desconocido";
    const ip = await obtenerIP();
    const fecha = new Date().toLocaleString();
    const navegador = navigator.userAgent;
    const dispositivo = obtenerDispositivo();

    const log = {
        usuario,
        accion,
        ip,
        fecha,
        navegador,
        dispositivo
    };

    let logs = JSON.parse(localStorage.getItem("logsIDV")) || [];
    logs.push(log);

    localStorage.setItem("logsIDV", JSON.stringify(logs));

}
/*descargar los logs */
function descargarLogs() {

    const logs = JSON.parse(localStorage.getItem("logsIDV")) || [];

    if (logs.length === 0) {
        alert("No existen logs para descargar.");
        return;
    }

    let contenido = "LOGS SISTEMA IDV - SCOUTING\n";
    contenido += "====================================\n\n";

    logs.forEach(log => {
        contenido += `[${log.fecha}] Usuario:${log.usuario} | Acción:${log.accion} | IP:${log.ip} | Dispositivo:${log.dispositivo}\n`;
        contenido += `Navegador: ${log.navegador}\n`;
        contenido += "------------------------------------\n";
    });

    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "logs_sistema_IDV.txt";
    a.click();

    URL.revokeObjectURL(url);
}


const URL_API = "https://script.google.com/macros/s/AKfycbxeXc9q_Uf1MY72lur0ZftE4SqdsVewweAemzQUACyJYzTBwuYgCooQ7pyFyYspANr8vA/exec";


let testsData = [];
let cargasPendientes = 3;

function cargaLista() {
  cargasPendientes--;
  if (cargasPendientes <= 0) {
    document.getElementById("loadingGlobal").style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarTitulosTablas();
  cargarObjetivos();
  cargarJugadores();
  inicializarFotoJugador();

  fetch(`${URL_API}?endpoint=tests`)
    .then(r => r.json())
    .then(data => {
      testsData = data;
      document.querySelectorAll(".tabla-valoracion").forEach(tabla => {
        inicializarTabla(tabla);
      });
    })
    .finally(cargaLista);
});

/**titulos de la tablas */
const TITULOS_TABLAS = {
  1: "FUERZA",
  2: "ENERGIA",
  3: "VALORACIÓN 3"
};

function cargarTitulosTablas() {
  document.querySelectorAll(".tabla-valoracion").forEach(tabla => {
    const num = tabla.dataset.tabla;
    const titulo = TITULOS_TABLAS[num] || "VALORACIÓN";
    const th = tabla.querySelector(".titulo-valoracion");

    if (th) th.textContent = titulo;
  });
}



function inicializarTabla(tabla) {
  const selectGR = tabla.querySelector(".select-gr");
  selectGR.innerHTML = '<option value="">Seleccione grupo</option>';

  const grupos = [...new Set(
    testsData.map(t => t.grupo_test).filter(g => g && g.trim() !== "")
  )];

  grupos.forEach(gr => {
    const opt = document.createElement("option");
    opt.value = gr;
    opt.textContent = gr.toUpperCase();
    selectGR.appendChild(opt);
  });

  selectGR.addEventListener("change", () => {
    const testsGrupo = testsData.filter(t => t.grupo_test === selectGR.value);
    limpiarTabla(tabla);
    cargarTestsTabla(tabla, testsGrupo);
  });
}

function cargarTestsTabla(tabla, testsGrupo) {
  tabla.querySelectorAll(".test-select").forEach(select => {
    const col = select.dataset.col;
    select.innerHTML = '<option value="">-- Elegir Test --</option>';

    const mapa = {};
    testsGrupo.forEach(t => {
      if (!t.nombre_test) return;
      if (!mapa[t.nombre_test]) {
        mapa[t.nombre_test] = t;
      }
    });

    Object.values(mapa).forEach(t => {
      const opt = document.createElement("option");
      opt.textContent = t.nombre_test;
      opt.dataset.test = JSON.stringify(t);
      select.appendChild(opt);
    });

    select.onchange = () => {
      const opt = select.selectedOptions[0];
      if (!opt?.dataset.test) return;

      const t = JSON.parse(opt.dataset.test);
      cargarTest(tabla, col, t);
    };
  });
}




function cargarTest(tabla, col, t) {
  tabla.querySelector(`.series[data-col="${col}"]`).value = t.series || "";
  tabla.querySelector(`.rec[data-col="${col}"]`).value = t.rec || "";
  tabla.querySelector(`.vel[data-col="${col}"]`).value = t.vel || "";
  tabla.querySelector(`.carga[data-col="${col}"]`).value = t.carga || "";

  cargarBloqueA(tabla, col, t);
}


function cargarBloqueA(tabla, col, test) {
  const select = tabla.querySelector(`.bloquea-select[data-col="${col}"]`);
  select.innerHTML = '<option value="">-- Bloque A --</option>';

  [...new Set(
    testsData.filter(t => t.nombre_test === test.nombre_test)
      .map(t => t.bloquea).filter(Boolean)
  )].forEach(b => {
    select.add(new Option(b.toUpperCase(), b));
  });

  select.onchange = () => cargarBloqueB(tabla, col, test.nombre_test, select.value);
}

function cargarBloqueB(tabla, col, nombreTest, bloqueA) {
  const select = tabla.querySelector(`.bloqueb-select[data-col="${col}"]`);
  select.innerHTML = '<option value="">-- Bloque B --</option>';

  [...new Set(
    testsData.filter(t => t.nombre_test === nombreTest && t.bloquea === bloqueA)
      .map(t => t.bloqueb).filter(Boolean)
  )].forEach(b => select.add(new Option(b, b)));

  select.onchange = () => cargarBloqueC(tabla, col, nombreTest, bloqueA, select.value);
}

function cargarBloqueC(tabla, col, nombreTest, bloqueA, bloqueB) {
  const select = tabla.querySelector(`.bloquec-select[data-col="${col}"]`);
  select.innerHTML = '<option value="">-- Bloque C --</option>';

  [...new Set(
    testsData.filter(t =>
      t.nombre_test === nombreTest &&
      t.bloquea === bloqueA &&
      t.bloqueb == bloqueB
    ).map(t => t.bloquec).filter(Boolean)
  )].forEach(c => select.add(new Option(c, c)));

  select.onchange = () => {
    const reg = testsData.find(t =>
      t.nombre_test === nombreTest &&
      t.bloquea === bloqueA &&
      t.bloqueb == bloqueB &&
      t.bloquec == select.value
    );
    if (reg) cargarInfo(tabla, col, reg);
  };
}


function cargarInfo(tabla, col, t) {
  let html = "";

  const celda = tabla.querySelector(`.test-info[data-col="${col}"]`);


  celda.dataset.video = t.video_url || "";

  if (t.descripcion) {
    html += `<div><strong>Desc:</strong> ${t.descripcion}</div>`;
  }

  if (t.video_url) {
    html += `<a href="${t.video_url}" target="_blank">Video</a>`;
  }

  if (t.imagen_url) {
    const img = convertirDriveURL(t.imagen_url);
    if (img) {
      html += `
        <div class="test-imagen">
          <img src="${img}" alt="Imagen del test" loading="lazy">
        </div>
      `;
    }
  }

  celda.innerHTML = html;
}



function limpiarTabla(tabla) {
  for (let col = 1; col <= 4; col++) {
    tabla.querySelector(`.test-info[data-col="${col}"]`).innerHTML = "";
    ["series", "rec", "vel", "carga"].forEach(c =>
      tabla.querySelector(`.${c}[data-col="${col}"]`).value = ""
    );
  }
}

/*funcion con select multiple para objetivos*/
function cargarObjetivos() {
  fetch(`${URL_API}?endpoint=objetivos`)
    .then(r => r.json())
    .then(data => {
      const select = document.getElementById("selectTest");

      /* destruir select2 si ya existe */
      if ($.fn.select2 && $(select).hasClass("select2-hidden-accessible")) {
        $(select).select2('destroy');
      }

      select.innerHTML = "";

      data.forEach(o => {
        const opt = document.createElement("option");
        opt.value = o.id_objetivo;
        opt.textContent = o.objetivo;
        select.appendChild(opt);
      });

      /* inicializar select2 SIN bootstrap */
      $(select).select2({
        placeholder: "-- Seleccione los Objetivos --",
        width: '100%',
        closeOnSelect: false
      });
    })
    .finally(cargaLista);
}


function obtenerObjetivosSeleccionados() {
  return $('#selectTest').select2('data').map(o => o.text);
}



function formatearFecha(fechaISO) {
  if (!fechaISO) return "";

  const d = new Date(fechaISO);

  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const anio = d.getFullYear();

  return `${dia}/${mes}/${anio}`;
}


// Función para normalizar nombres y que coincidan con los archivos
function normalizarNombre(nombre) {
  if (!nombre) return "";
  // Quita acentos y caracteres especiales
  nombre = nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Reemplaza múltiples espacios por uno solo y quita espacios al inicio/final
  nombre = nombre.replace(/\s+/g, " ").trim();
  return nombre;
}

// ===========================
// Cargar jugadores en el select
// ===========================
function cargarJugadores() {
  fetch(`${URL_API}?endpoint=jugadores`)
    .then(r => r.json())
    .then(data => {
      const select = document.getElementById("selectJugador");
      select.innerHTML = '<option value="">-- Seleccione jugador --</option>';

      data.forEach(j => {
        const opt = document.createElement("option");
        opt.value = j.id_jugador;
        opt.textContent = j.nombre_jugador?.trim() || "";

        // Datos extra
        opt.dataset.categoria = j.categoria || "";
        opt.dataset.fase = j.fase || "";
        opt.dataset.fecha_nacimiento = j.fecha_nacimiento || "";
        opt.dataset.demarcacion = j.demarcacion || "";
        opt.dataset.peso = j.peso || "";
        opt.dataset.pie = j.pie || "";

        // ⚡ Ahora usamos la URL directa de la foto
        opt.dataset.foto = j.foto_url || "";

        select.appendChild(opt);
      });
    })
    .finally(cargaLista);
}

// ===========================
// Inicializar foto usando la URL directa de la API
// ===========================
function inicializarFotoJugador() {
  const select = document.getElementById("selectJugador");
  const img = document.getElementById("fotoJugador");
  const cont = document.getElementById("contenedorFoto");

  const inputCategoria = document.getElementById("categoria");
  const inputFase = document.getElementById("fase");
  const inputfecha_nacimiento = document.getElementById("fecha_nacimiento");
  const inputdemarcacion = document.getElementById("demarcacion");
  const inputpeso = document.getElementById("peso");
  const inputpie = document.getElementById("pie");

  const placeholder = "/sistemaIDV/img/jugadores/placeholder.png"; // imagen por defecto

  select.addEventListener("change", () => {
    const opt = select.selectedOptions[0];
    if (!opt) return;

    // Actualizamos inputs
    inputCategoria.value = opt.dataset.categoria || "";
    inputFase.value = opt.dataset.fase || "";
    inputfecha_nacimiento.value = formatearFecha(opt.dataset.fecha_nacimiento);
    inputdemarcacion.value = opt.dataset.demarcacion || "";
    inputpeso.value = opt.dataset.peso || "";
    inputpie.value = opt.dataset.pie || "";

    const fotoURL = opt.dataset.foto;

    if (fotoURL) {
      img.src = fotoURL;
      cont.classList.remove("oculto");
      
    } else {
      img.src = placeholder;
      cont.classList.remove("oculto");
      console.warn("No hay foto disponible para este jugador.");
    }
  });
}

function convertirDriveURL(url) {
  const m = url?.match(/\/d\/([^\/]+)/);
  return m ? `https://drive.google.com/thumbnail?id=${m[1]}&sz=w400` : null;
}

function limpiarFormulario() {

  /* limpiar selects principales */
  document.querySelectorAll(".select-gr").forEach(s => s.value = "");
  document.getElementById("selectJugador").value = "";

  /* ocultar foto jugador */
  const img = document.getElementById("fotoJugador");
  const cont = document.getElementById("contenedorFoto");
  img.src = "";
  cont.classList.add("oculto");

  /*const selectObjetivo = document.getElementById("selectTest");
  if (selectObjetivo) selectObjetivo.value = "";*/
  const selectObjetivo = $('#selectTest');
  if (selectObjetivo.length) {
    selectObjetivo.val(null).trigger('change');
  }


  /* recorrer TODAS las tablas */
  document.querySelectorAll(".tabla-valoracion").forEach(tabla => {

    /* limpiar selects de test */
    tabla.querySelectorAll(".test-select").forEach(sel => {
      sel.innerHTML = '<option value="">-- Test --</option>';
    });

    tabla.querySelectorAll(".bloquea-select").forEach(sel => {
      sel.innerHTML = '<option value="">-- Bloque A --</option>';
    });

    tabla.querySelectorAll(".bloqueb-select").forEach(sel => {
      sel.innerHTML = '<option value="">-- Bloque B --</option>';
    });

    tabla.querySelectorAll(".bloquec-select").forEach(sel => {
      sel.innerHTML = '<option value="">-- Bloque C --</option>';
    });

    /* limpiar info del test */
    tabla.querySelectorAll(".test-info").forEach(info => {
      info.innerHTML = "";
    });

    /* limpiar inputs */
    tabla.querySelectorAll(".series, .rec, .vel, .carga").forEach(input => {
      input.value = "";
    });

  });
}

function guardarPerfil() {

  const modal = document.getElementById("modalGuardando");
  modal.classList.remove("oculto");

  const grupo = document.querySelector(".select-gr").value;
  const jugadorSelect = document.getElementById("selectJugador");

  const payload = [];

  document.querySelectorAll(".test-select").forEach(select => {

    const opt = select.selectedOptions[0];
    if (!opt?.dataset.test) return;

    const t = JSON.parse(opt.dataset.test);
    const col = Number(select.dataset.col);


    const tabla = Number(
      select.closest(".tabla-valoracion").dataset.tabla
    );

    payload.push({
      tabla,
      col,
      fecha: new Date().toLocaleString("es-EC"),
      id_test: t.id_test || "",
      grupo_test: grupo,
      nombre_test: t.nombre_test || "",
      descripcion: t.descripcion || "",


      /*cargar los bloques */
      bloquea: document.querySelector(
        `.tabla-valoracion[data-tabla="${tabla}"] .bloquea-select[data-col="${col}"]`
      )?.value || "",

      bloqueb: document.querySelector(
        `.tabla-valoracion[data-tabla="${tabla}"] .bloqueb-select[data-col="${col}"]`
      )?.value || "",

      bloquec: document.querySelector(
        `.tabla-valoracion[data-tabla="${tabla}"] .bloquec-select[data-col="${col}"]`
      )?.value || "",


      series: document.querySelector(
        `.tabla-valoracion[data-tabla="${tabla}"] .series[data-col="${col}"]`
      )?.value || "",
      rec: document.querySelector(
        `.tabla-valoracion[data-tabla="${tabla}"] .rec[data-col="${col}"]`
      )?.value || "",
      vel: document.querySelector(
        `.tabla-valoracion[data-tabla="${tabla}"] .vel[data-col="${col}"]`
      )?.value || "",
      carga: document.querySelector(
        `.tabla-valoracion[data-tabla="${tabla}"] .carga[data-col="${col}"]`
      )?.value || "",
      video_url: document.querySelector(
        `.tabla-valoracion[data-tabla="${tabla}"] .test-info[data-col="${col}"]`
      )?.dataset.video || "",




      id_jugador: jugadorSelect.value,
      nombre_jugador: jugadorSelect.selectedOptions[0]?.text || "",
      foto_url: document.getElementById("fotoJugador").src || "",
      categoria: document.getElementById("categoria")?.value || "",
      fecha_nacimiento: document.getElementById("fecha_nacimiento")?.value || "",
      demarcacion: document.getElementById("demarcacion")?.value || "",
      peso: document.getElementById("peso")?.value || "",
      fase: document.getElementById("fase")?.value || "",
      pie: document.getElementById("pie")?.value || ""
    });
  });

  if (!payload.length) {
    modal.classList.add("oculto");
    alert("No hay tests seleccionados");
    return;
  }

  fetch(URL_API, {
    method: "POST",
    body: JSON.stringify(payload)
  })
    .finally(async () => {
      modal.classList.add("oculto");
      await generarPDF(payload);
      limpiarFormulario();
    });
}

/**cargatr */
/*function cargarImagenBase64(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
}*/
function cargarImagenBase64(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d").drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      console.warn("No se pudo cargar la imagen:", url);
      // Imagen vacía de 1x1 px para no romper el PDF
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = url;
  });
}

async function generarPDF(payload) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const TITULOA = "ANALITICA";
  const PIEPAGINA = "Quito-Ecuador IDV";
  const COLOR_MORADO = [90, 0, 120];
  const COLOR_VERTICAL = [200, 200, 200];
  const COLOR_TEXTO = [0, 0, 0];

  const lineaHorizontal = (x1, x2, y) => {
    pdf.setDrawColor(...COLOR_MORADO);
    pdf.setLineWidth(0.4);
    pdf.line(x1, y, x2, y);
  };

  const lineaVertical = (x, y1, y2) => {
    pdf.setDrawColor(...COLOR_VERTICAL);
    pdf.setLineWidth(0.2);
    pdf.line(x, y1, x, y2);
  };

  const j = {
    ...payload[0],
    categoria: payload[0].categoria || document.getElementById("categoria")?.value || "",
    fecha_nacimiento: payload[0].fecha_nacimiento || document.getElementById("fecha_nacimiento")?.value || "",
    demarcacion: payload[0].demarcacion || document.getElementById("demarcacion")?.value || "",
    peso: payload[0].peso || document.getElementById("peso")?.value || "",
    fase: payload[0].fase || document.getElementById("fase")?.value || "",
    pie: payload[0].pie || document.getElementById("pie")?.value || ""
  };

  let y = 15;

  // Cargar logo y foto del jugador
  const logoBase64 = await cargarImagenBase64("https://idv-ecu.github.io/sistemaIDV/img/escudoIdv.png");
  const fotoJugadorBase64 = await cargarImagenBase64(j.foto_url || "https://via.placeholder.com/40x50");

  /* HEADER */
  const dibujarHeader = () => {
    pdf.setFillColor(0, 0, 200);
    pdf.rect(0, 0, 210, 22, "F");

    pdf.setFillColor(0, 0, 0);
    pdf.triangle(160, 0, 210, 0, 210, 20, "F");

    pdf.addImage(logoBase64, "PNG", 188, 1, 18, 18);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(255, 255, 255);
    pdf.text("INDEPENDIENTE DEL VALLE", 10, 8);

    pdf.setFontSize(10);
    pdf.setTextColor(230, 230, 230);
    pdf.text(TITULOA, 10, 13);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6);
    pdf.setTextColor(200, 200, 200);
    pdf.text(j.fecha || "", 10, 17);
  };

  const dibujarFooter = () => {
    pdf.setFillColor(0, 0, 200);
    pdf.rect(0, 287, 210, 10, "F");

    pdf.setFillColor(0, 0, 0);
    pdf.triangle(0, 287, 50, 297, 0, 297, "F");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(255, 255, 255);
    pdf.text(PIEPAGINA, 5, 293);
  };

  dibujarHeader();
  y = 30;

  // Objetivos a la izquierda
  const colObjetivos = 14;
  let yObj = y;
  const objetivos = $('#selectTest').select2('data').map(o => o.text);

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(4);
  pdf.setFont("helvetica", "bold");
  pdf.text("Objetivos:", colObjetivos, yObj);
  yObj += 4;

  pdf.setFont("helvetica", "normal");
  objetivos.forEach(obj => {
    const lineas = pdf.splitTextToSize(`- ${obj}`, 90);
    pdf.text(lineas, colObjetivos, yObj);
    yObj += lineas.length * 4;
  });

  // Foto del jugador y datos al lado derecho
  // =============================
// FOTO MÁS PEQUEÑA Y AJUSTADA
// =============================

const anchoFoto = 32;   // más pequeña
const altoFoto = 42;    // proporcional

const xFoto = 135;      // más a la derecha
const yFoto = 32;       // misma altura

// Marco morado más fino
pdf.setDrawColor(90, 0, 120);
pdf.setLineWidth(0.6);
pdf.rect(xFoto - 2, yFoto - 2, anchoFoto + 4, altoFoto + 4);

// Imagen
pdf.addImage(fotoJugadorBase64, "JPEG", xFoto, yFoto, anchoFoto, altoFoto);



// =============================
// DATOS A LA DERECHA
// =============================

const xDatos = 175;   // columna fija derecha
let yDatos = yFoto + 5;

pdf.setFontSize(6);


  const escribirDato = (label, value) => {
    pdf.setFont("helvetica", "bold");
    pdf.text(label, xDatos, yDatos);
    pdf.setFont("helvetica", "normal");
    pdf.text(value || "", xDatos + 25, yDatos);
    yDatos += 4;
  };

  escribirDato("Categoría:", j.categoria);
  escribirDato("Jugador:", j.nombre_jugador);
  escribirDato("Fecha Nac.:", j.fecha_nacimiento);
  escribirDato("Demarcación:", j.demarcacion);
  escribirDato("Peso:", j.peso ? `${j.peso} kg` : "");
  escribirDato("Pie Dominante:", j.pie);

  y = Math.max(yObj, yDatos) + 8;

  // Tablas
  const tablas = {};
  payload.forEach(p => {
    if (!tablas[p.tabla]) tablas[p.tabla] = [];
    tablas[p.tabla].push(p);
  });

  Object.keys(tablas).forEach(num => {
    const datos = tablas[num];
    if (!datos.length) return;
    const nombreTabla = TITULOS_TABLAS[num] || "VALORACIÓN";

    const TOTAL_COLUMNAS = 4;
    const startX = 14;
    const labelW = 24;
    const colW = (182 - labelW) / TOTAL_COLUMNAS;
    const rowH = 6;
    const videoH = 18;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text(nombreTabla, 105, y, { align: "center" });
    pdf.setTextColor(...COLOR_TEXTO);
    y += 6;

    pdf.setFontSize(9);
    for (let i = 0; i < TOTAL_COLUMNAS; i++) {
      pdf.text(String(i + 1), startX + labelW + colW * i + colW / 2, y + 4, { align: "center" });
    }
    lineaHorizontal(startX, startX + labelW + colW * TOTAL_COLUMNAS, y);
    const tablaTop = y;
    y += rowH;

    pdf.setFontSize(7);
    for (let i = 0; i < TOTAL_COLUMNAS; i++) {
      const test = datos[i];
      pdf.text(test?.bloquec || "", startX + labelW + colW * i + colW / 2, y + 4, { align: "center", maxWidth: colW - 4 });
    }
    lineaHorizontal(startX, startX + labelW + colW * TOTAL_COLUMNAS, y);
    y += rowH;

    y += videoH;
    lineaHorizontal(startX, startX + labelW + colW * TOTAL_COLUMNAS, y);

    for (let i = 0; i < TOTAL_COLUMNAS; i++) {
      const test = datos[i];
      if (test?.video_url) {
        pdf.setTextColor(0, 0, 255);
        pdf.textWithLink("Ver video", startX + labelW + colW * i + colW / 2, y - videoH / 2, { align: "center", url: test.video_url });
        pdf.setTextColor(...COLOR_TEXTO);
      }
    }

    ["series", "rec", "vel", "carga"].forEach(f => {
      pdf.setFontSize(8);
      pdf.text(f.toUpperCase(), startX + 2, y + 4);
      for (let i = 0; i < TOTAL_COLUMNAS; i++) {
        const test = datos[i];
        pdf.text(test ? String(test[f] || "") : "", startX + labelW + colW * i + colW / 2, y + 4, { align: "center" });
      }
      lineaHorizontal(startX, startX + labelW + colW * TOTAL_COLUMNAS, y);
      y += rowH;
    });

    lineaHorizontal(startX, startX + labelW + colW * TOTAL_COLUMNAS, y);
    const tablaBottom = y;

    pdf.setFontSize(10);
    pdf.text(`GR${num}`, startX + labelW / 2, tablaTop + (tablaBottom - tablaTop) / 2, { align: "center" });

    lineaVertical(startX, tablaTop, tablaBottom);
    lineaVertical(startX + labelW, tablaTop, tablaBottom);
    for (let i = 0; i <= TOTAL_COLUMNAS; i++) {
      lineaVertical(startX + labelW + colW * i, tablaTop, tablaBottom);
    }

    y += 6;
  });

  dibujarFooter();
  pdf.save("perfil_test_fisicos.pdf");
}

const URL_API = "https://script.google.com/macros/s/AKfycbxO1BPbz-3tmEWQvWVTVlme7mXR08NP-lEVFN9xVLVT2_coZq9ql5GVK6AXOzNPHesyAg/exec";

let testsData = [];
let cargasPendientes = 3;

function cargaLista() {
  cargasPendientes--;
  if (cargasPendientes <= 0) {
    document.getElementById("loadingGlobal").style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
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

    testsGrupo.forEach(t => {
      const opt = document.createElement("option");
      opt.textContent = t.nombre_test;
      opt.dataset.test = JSON.stringify(t);
      select.appendChild(opt);
    });

    select.onchange = () => {
      const opt = select.selectedOptions[0];
      if (!opt?.dataset.test) return;
      cargarTest(tabla, col, JSON.parse(opt.dataset.test));
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


function cargarObjetivos() {
  fetch(`${URL_API}?endpoint=objetivos`)
    .then(r => r.json())
    .then(data => {
      const select = document.getElementById("selectTest");
      select.innerHTML = '<option value="">-- Seleccione un objetivo --</option>';

      data.forEach(o => {
        const opt = document.createElement("option");
        opt.value = o.id_objetivo;
        opt.textContent = o.objetivo;
        select.appendChild(opt);
      });
    })
    .finally(cargaLista);

}

function cargarJugadores() {
  fetch(`${URL_API}?endpoint=jugadores`)
    .then(r => r.json())
    .then(data => {

      const select = document.getElementById("selectJugador");
      select.innerHTML = '<option value="">-- Seleccione jugador --</option>';

      data.forEach(j => {
        const opt = document.createElement("option");
        opt.value = j.id_jugador;
        opt.textContent = j.nombre_jugador?.trim();

        opt.dataset.categoria = j.categoria || "";
        opt.dataset.fase = j.fase || "";

        if (j.foto_url) {
          opt.dataset.foto = convertirDriveURL(j.foto_url);
        }

        select.appendChild(opt);
      });
    })
    .finally(cargaLista);
}
function inicializarFotoJugador() {
  const select = document.getElementById("selectJugador");
  const img = document.getElementById("fotoJugador");
  const cont = document.getElementById("contenedorFoto");

  const inputCategoria = document.getElementById("categoria");
  const inputFase = document.getElementById("fase");

  select.addEventListener("change", () => {
    const opt = select.selectedOptions[0];
    if (!opt) return;


    inputCategoria.value = opt.dataset.categoria || "";
    inputFase.value = opt.dataset.fase || "";


    if (!opt.dataset.foto) {
      img.src = "";
      cont.classList.add("oculto");
    } else {
      img.src = opt.dataset.foto;
      cont.classList.remove("oculto");
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

  const selectObjetivo = document.getElementById("selectTest");
  if (selectObjetivo) selectObjetivo.value = "";

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
      fase: document.getElementById("fase")?.value || ""
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


async function generarPDF(payload) {

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  /* CONFIG */
  const TITULO_VALORACION = "VALORACIÓN";

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

  const j = payload[0];
  let y = 15;

  /* HEADER */
  const dibujarHeader = () => {
    // Fondo azul
    pdf.setFillColor(0, 0, 200);
    pdf.rect(0, 0, 210, 20, "F");

    // Triángulo negro
    pdf.setFillColor(0, 0, 0);
    pdf.triangle(160, 0, 210, 0, 210, 20, "F");

    /* TITULO */
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.text("INDEPENDIENTE DEL VALLE", 10, 9);

    /* FECHA (MAS SUAVE) */
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(220, 220, 220);
    pdf.text(j.fecha, 10, 15);

    // Reset color texto
    pdf.setTextColor(...COLOR_TEXTO);
  };


  /* FOOTER */
  const dibujarFooter = () => {
    pdf.setFillColor(0, 0, 200);
    pdf.rect(0, 287, 210, 10, "F");

    pdf.setFillColor(0, 0, 0);
    pdf.triangle(0, 287, 50, 297, 0, 297, "F");
  };

  dibujarHeader();
  y = 30;

  /* DATOS */
  pdf.setFontSize(16);
  pdf.text("PERFIL DE TESTS FÍSICOS", 105, y, { align: "center" });
  y += 8;

  pdf.setFontSize(10);
  pdf.text(`Jugador: ${j.nombre_jugador}`, 14, y); y += 5;
  pdf.text(`Grupo: ${j.grupo_test}`, 14, y); y += 5;
  pdf.text(`Categoría: ${j.categoria}`, 14, y); y += 5;
  pdf.text(`Fase: ${j.fase}`, 14, y);
  y += 8;

  /* AGRUPAR TABLAS */
  const tablas = {};
  payload.forEach(p => {
    if (!tablas[p.tabla]) tablas[p.tabla] = [];
    tablas[p.tabla].push(p);
  });

  Object.keys(tablas).forEach(num => {

    const datos = tablas[num];
    if (!datos.length) return;

    /* CONFIG TABLA (COMPACTA) */
    const TOTAL_COLUMNAS = 4;
    const startX = 14;
    const labelW = 24;
    const colW = (182 - labelW) / TOTAL_COLUMNAS;
    const rowH = 6;
    const videoH = 18;

    /* TITULO */
    pdf.setFontSize(12);
    pdf.text(TITULO_VALORACION, 105, y, { align: "center" });
    y += 6;

    /* NUMEROS */
    pdf.setFontSize(9);
    for (let i = 0; i < TOTAL_COLUMNAS; i++) {
      pdf.text(
        String(i + 1),
        startX + labelW + colW * i + colW / 2,
        y + 4,
        { align: "center" }
      );
    }

    lineaHorizontal(startX, startX + labelW + colW * TOTAL_COLUMNAS, y);
    const tablaTop = y;
    y += rowH;

    /* NOMBRE TEST */
    pdf.setFontSize(7);
    for (let i = 0; i < TOTAL_COLUMNAS; i++) {
      const test = datos[i];
      pdf.text(
        test ? test.nombre_test : "",
        startX + labelW + colW * i + colW / 2,
        y + 4,
        { align: "center", maxWidth: colW - 4 }
      );
    }

    lineaHorizontal(startX, startX + labelW + colW * TOTAL_COLUMNAS, y);
    y += rowH;

    /* VIDEO */
    y += videoH;
    lineaHorizontal(startX, startX + labelW + colW * TOTAL_COLUMNAS, y);

    for (let i = 0; i < TOTAL_COLUMNAS; i++) {
      const test = datos[i];
      if (test?.video_url) {
        pdf.setTextColor(0, 0, 255);
        pdf.textWithLink(
          "Ver video",
          startX + labelW + colW * i + colW / 2,
          y - videoH / 2,
          { align: "center", url: test.video_url }
        );
        pdf.setTextColor(...COLOR_TEXTO);
      }
    }

    /* FILAS */
    ["series", "rec", "vel", "carga"].forEach(f => {
      pdf.setFontSize(8);
      pdf.text(f.toUpperCase(), startX + 2, y + 4);

      for (let i = 0; i < TOTAL_COLUMNAS; i++) {
        const test = datos[i];
        pdf.text(
          test ? String(test[f] || "") : "",
          startX + labelW + colW * i + colW / 2,
          y + 4,
          { align: "center" }
        );
      }

      lineaHorizontal(startX, startX + labelW + colW * TOTAL_COLUMNAS, y);
      y += rowH;
    });

    lineaHorizontal(startX, startX + labelW + colW * TOTAL_COLUMNAS, y);
    const tablaBottom = y;

    /* GR CENTRADO */
    pdf.setFontSize(10);
    pdf.text(
      `GR${num}`,
      startX + labelW / 2,
      tablaTop + (tablaBottom - tablaTop) / 2,
      { align: "center" }
    );

    /* LINEAS VERTICALES */
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

//const URL_API = "https://script.google.com/macrc";
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
  1: "MOVILIDAD",
  2: "ACTIVACION",
  3: "FUERZA"
};

function cargarTitulosTablas() {
  document.querySelectorAll(".tabla-valoracion").forEach(tabla => {
    const num = tabla.dataset.tabla;
    const titulo = TITULOS_TABLAS[num] || "VALORACIÓN";
    const th = tabla.querySelector(".titulo-valoracion");

    if (th) th.textContent = titulo;
  });
}



// function inicializarTabla(tabla) {
//   const selectGR = tabla.querySelector(".select-gr");
//   selectGR.innerHTML = '<option value="">Seleccione grupo</option>';

//   const grupos = [...new Set(
//     testsData.map(t => t.grupo_test).filter(g => g && g.trim() !== "")
//   )];

//   grupos.forEach(gr => {
//     const opt = document.createElement("option");
//     opt.value = gr;
//     opt.textContent = gr.toUpperCase();
//     selectGR.appendChild(opt);
//   });

//   // selectGR.addEventListener("change", () => {
//   //   const testsGrupo = testsData.filter(t => t.grupo_test === selectGR.value);
//   //   limpiarTabla(tabla);
//   //   cargarTestsTabla(tabla, testsGrupo);
//   // });

//   selectGR.addEventListener("change", () => {
//   limpiarTabla(tabla);
//   cargarTestsTabla(tabla, testsData);
//   });

// }



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

  // DESACTIVAMOS SU USO
  selectGR.disabled = true;

  //  CARGA DIRECTA
  limpiarTabla(tabla);
  cargarTestsTabla(tabla, testsData);
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

// function cargarBloqueA(tabla, col, test) {
//   const select = tabla.querySelector(`.bloquea-select[data-col="${col}"]`);
//   select.innerHTML = '<option value="">-- Bloque A --</option>';

//   [...new Set(
//     testsData
//       .map(t => t.bloquea)
//       .filter(Boolean)
//   )].forEach(b => {
//     select.add(new Option(b.toUpperCase(), b));
//   });

//   select.onchange = () =>
//     cargarBloqueB(tabla, col, test.nombre_test, select.value);
// }


function cargarBloqueB(tabla, col, nombreTest, bloqueA) {
  const select = tabla.querySelector(`.bloqueb-select[data-col="${col}"]`);
  select.innerHTML = '<option value="">-- Bloque B --</option>';

  [...new Set(
    testsData.filter(t => t.nombre_test === nombreTest && t.bloquea === bloqueA)
      .map(t => t.bloqueb).filter(Boolean)
  )].forEach(b => select.add(new Option(b, b)));

  select.onchange = () => cargarBloqueC(tabla, col, nombreTest, bloqueA, select.value);
}

// function cargarBloqueB(tabla, col, nombreTest, bloqueA) {
//   const select = tabla.querySelector(`.bloqueb-select[data-col="${col}"]`);
//   select.innerHTML = '<option value="">-- Bloque B --</option>';

//   [...new Set(
//     testsData
//       .filter(t => t.bloquea === bloqueA)
//       .map(t => t.bloqueb)
//       .filter(Boolean)
//   )].forEach(b => select.add(new Option(b, b)));

//   select.onchange = () =>
//     cargarBloqueC(tabla, col, nombreTest, bloqueA, select.value);
// }


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

// function cargarBloqueC(tabla, col, nombreTest, bloqueA, bloqueB) {
//   const select = tabla.querySelector(`.bloquec-select[data-col="${col}"]`);
//   select.innerHTML = '<option value="">-- Bloque C --</option>';

//   [...new Set(
//     testsData
//       .filter(t => t.bloqueb == bloqueB)
//       .map(t => t.bloquec)
//       .filter(Boolean)
//   )].forEach(c => select.add(new Option(c, c)));

//   select.onchange = () => {
//     const reg = testsData.find(t => t.bloquec == select.value);
//     if (reg) cargarInfo(tabla, col, reg);
//   };
// }





function cargarInfo(tabla, col, t) {
  let html = "";

  const celda = tabla.querySelector(`.test-info[data-col="${col}"]`);

  celda.dataset.video = t.video_url || "";
  celda.dataset.imagen = t.imagen_url || "";

  if (t.descripcion) {
    html += `<div><strong>Desc:</strong> ${t.descripcion}</div>`;
  }

  /*if (t.video_url) {
    html += `<a href="${t.video_url}" target="_blank">Video</a>`;
  }*/
  if (t.video_url) {
    html += `
    <button class="btn-ver-video"
      onclick="abrirModalVideo('${t.video_url}')">
      ▶ Ver Video
    </button>
  `;
  }

  if (t.imagen_url) {
    html += `
      <div class="test-imagen">
        <img src="${t.imagen_url}" alt="Imagen del test" loading="lazy">
      </div>
    `;
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


// Función para normalizar nombres
function normalizarNombre(nombre) {
  if (!nombre) return "";
  nombre = nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  nombre = nombre.replace(/\s+/g, " ").trim();
  return nombre;
}

// Cargar jugadores en el select
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
        opt.dataset.foto = j.foto_url || "";

        select.appendChild(opt);
      });
    })
    .finally(cargaLista);
}

// Inicializar foto usando la URL directa de la API
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

  //const placeholder = "/sistemaIDV/img/jugadores/placeholder.png";

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
      img.src = "";
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

  const selectObjetivo = $('#selectTest');
  if (selectObjetivo.length) {
    selectObjetivo.val(null).trigger('change');
  }


  const selectDia = document.getElementById("selectDia");
  if (selectDia) selectDia.value = "";

  const resumen = document.getElementById("resumenTest");
  if (resumen) resumen.value = "";


  const hiddenFields = [
    "categoria",
    "fase",
    "fecha_nacimiento",
    "demarcacion",
    "peso",
    "pie"
  ];

  hiddenFields.forEach(id => {
    const input = document.getElementById(id);
    if (input) input.value = "";
  });


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

  const diaTest = document.getElementById("selectDia")?.value || "";
  const resumenTest = document.getElementById("resumenTest")?.value || "";


  const payload = [];

  document.querySelectorAll(".test-select").forEach(select => {

    const opt = select.selectedOptions[0];
    if (!opt?.dataset.test) return;

    const t = JSON.parse(opt.dataset.test);
    const col = Number(select.dataset.col);


    const tabla = Number(
      select.closest(".tabla-valoracion").dataset.tabla
    );

    //guardado de tabla y posicion
    const posicion = `T${tabla}-C${col}`;

    payload.push({
      tabla,
      col,

      //guardado la tabla y posicion donde esta el registro
      v1: posicion,

      fecha: new Date().toLocaleString("es-EC"),
      id_test: t.id_test || "",
      grupo_test: grupo,
      nombre_test: t.nombre_test || "",

      dia_test: diaTest,
      resumen_test: resumenTest,


      /*cargar los bloques */
      bloquea: document.querySelector(
        `.tabla-valoracion[data-tabla="${tabla}"] .bloquea-select[data-col="${col}"]`
      )?.value || "",

      bloqueb: document.querySelector(
        `.tabla-valoracion[data-tabla="${tabla}"] .bloqueb-select[data-col="${col}"]`
      )?.value || "",

      descripcion: document.querySelector(
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
      //cambios de variable con variables auxiliares para que mande a guardar la imagen y v
      v3: document.querySelector(
        `.tabla-valoracion[data-tabla="${tabla}"] .test-info[data-col="${col}"]`
      )?.dataset.video || "",

      v4: document.querySelector(
        `.tabla-valoracion[data-tabla="${tabla}"] .test-info[data-col="${col}"] img`
      )?.src || "",


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
    // .finally(async () => {
    //   modal.classList.add("oculto");
    //   await generarPDF(payload);
    //   limpiarFormulario();
    // });


    .finally(async () => {
      modal.classList.add("oculto");

      await generarPDF(payload);

      limpiarFormulario();


      reactivarFormulario();
    });



}

function esperarTestsCargados() {
  return new Promise(resolve => {
    const check = () => {
      if (testsData && testsData.length > 0) {
        resolve();
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
}

//funcion para busqueda de registros
async function buscarPerfil() {

  const jugadorId = document.getElementById("selectJugador").value;

  if (!jugadorId) {
    alert("Seleccione un jugador");
    return;
  }

  try {

    mostrarLoading(true);

    const url = `${URL_API}?endpoint=busqueda&jugador=${jugadorId}`;

    const resp = await fetch(url);
    const data = await resp.json();

    if (!data || data.length === 0) {
      alert("No hay registros para este jugador");
      mostrarLoading(false);
      return;
    }

    await esperarTestsCargados();
    llenarFormulario(data);
    mostrarLoading(false);

  } catch (error) {

    mostrarLoading(false);
    alert("Error cargando datos");
  }
}
//llenar los campos en el html
function llenarFormulario(registros) {

  if (!registros || registros.length === 0) return;

  document.querySelectorAll(".tabla-valoracion").forEach(tabla => {
    cargarTestsTabla(tabla, testsData);
  });

  registros.forEach((r, index) => {


    const partes = r.v1.split("-");
    const tabla = partes[0].replace("T", "");
    const col = partes[1].replace("C", "");

    const tablaHTML = document.querySelector(
      `.tabla-valoracion[data-tabla="${tabla}"]`
    );

    if (!tablaHTML) return;


    const selectTest = tablaHTML.querySelector(
      `.test-select[data-col="${col}"]`
    );

    if (selectTest) {

      const option = [...selectTest.options].find(
        o => o.textContent.trim() === r.nombre_test
      );

      if (option) {

        selectTest.selectedIndex = option.index;

        const testData = JSON.parse(option.dataset.test);

        cargarTest(tablaHTML, col, testData);

      }
    }


    const bloqueA = tablaHTML.querySelector(`.bloquea-select[data-col="${col}"]`);
    if (bloqueA && r.bloquea) {
      bloqueA.value = r.bloquea;
      bloqueA.dispatchEvent(new Event("change"));
    }

    const bloqueB = tablaHTML.querySelector(`.bloqueb-select[data-col="${col}"]`);
    if (bloqueB && r.bloqueb) {
      bloqueB.value = r.bloqueb;
      bloqueB.dispatchEvent(new Event("change"));
    }

    const bloqueC = tablaHTML.querySelector(`.bloquec-select[data-col="${col}"]`);

    const valorBloqueC = r.bloquec || r.descripcion || "";

    if (bloqueC && valorBloqueC) {
      bloqueC.value = valorBloqueC;
      bloqueC.dispatchEvent(new Event("change"));
    }

    tablaHTML.querySelector(`.series[data-col="${col}"]`).value = r.series || "";
    tablaHTML.querySelector(`.rec[data-col="${col}"]`).value = r.rec || "";
    tablaHTML.querySelector(`.vel[data-col="${col}"]`).value = r.vel || "";
    tablaHTML.querySelector(`.carga[data-col="${col}"]`).value = r.carga || "";

  });

  document.getElementById("resumenTest").value =
    registros[0].resumen_test || "";
}

function mostrarLoading(estado) {
  document.getElementById("loadingGlobal").style.display =
    estado ? "flex" : "none";
}




async function cargarImagenParaPDF(url) {
  try {
    const response = await fetch(url, {
      mode: "cors",
      cache: "no-cache"
    });

    if (!response.ok) {
      throw new Error("No se pudo cargar la imagen");
    }

    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  } catch (error) {
    console.warn("Error cargando imagen:", url, error);
    return null;
  }
}



async function generarPDF(payload) {

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const TITULOA = "PLANES INDIVIDUALES";
  const PIEPAGINA = "Lic. Alberto Sciegata";
  const TEXTOPIEPAGINA = "www.independientedelvalle.com";
  const COLOR_MORADO = [90, 0, 120];
  const COLOR_VERTICAL = [200, 200, 200];
  const COLOR_TEXTO = [0, 0, 0];

  const lineaHorizontal = (x1, x2, y) => {
    pdf.setDrawColor(...COLOR_MORADO);
    pdf.setLineWidth(0.15);
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
  //const logoPDF = await cargarImagenParaPDF("../img/escudoIdv.png");

  /*  HEADER  */
  const dibujarHeader = () => {

    const diaTest = payload[0]?.dia_test || "";

    pdf.setFillColor(0, 0, 200);
    pdf.rect(0, 0, 210, 24, "F");

    pdf.setFillColor(0, 0, 0);
    pdf.triangle(170, 0, 210, 0, 210, 24, "F");

    /*if (logoPDF) {
      pdf.addImage(logoPDF, "PNG", 185, 3, 18, 18);
      //pdf.addImage(logoPDF, "PNG", 186, 4, 16, 16);

    }*/

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(255, 255, 255);
    pdf.text("INDEPENDIENTE DEL VALLE", 10, 7);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(230, 230, 230);
    pdf.text(TITULOA, 10, 12);

    if (diaTest) {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(0, 200, 255); // Celeste
      pdf.text(`PLAN: Día ${diaTest}`, 10, 17);
    }

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(5);
    pdf.setTextColor(200, 200, 200);
    //pdf.text(j.fecha || "", 10, 21);
  };


  const dibujarFooter = () => {
    pdf.setFillColor(0, 0, 200);
    pdf.rect(0, 287, 210, 10, "F");

    pdf.setFillColor(0, 0, 0);
    pdf.triangle(0, 287, 50, 297, 0, 297, "F");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(255, 255, 255);
    pdf.text(PIEPAGINA, 5, 293);
    pdf.setFontSize(4);
    pdf.text(TEXTOPIEPAGINA, 205, 293, { align: "right" });
  };

  dibujarHeader();
  y = 30;

  /*  OBJETIVOS  */
  const colIzq = 14;
  let yActual = y;

  /*cuadro de resumen */
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "bold");
  pdf.text("Resumen:", colIzq, yActual);

  yActual += 4;

  pdf.setFont("helvetica", "normal");

  const resumenTexto = j.resumen_test || "";
  const resumenLineas = pdf.splitTextToSize(resumenTexto, 95);

  pdf.text(resumenLineas, colIzq, yActual);
  yActual += resumenLineas.length * 3;

  yActual += 4;

  /**informacion de objetivos */
  const objetivos = $('#selectTest').select2('data').map(o => o.text);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(6);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Objetivos:", colIzq, yActual);

  yActual += 4;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(5);

  objetivos.forEach(obj => {
    const lineas = pdf.splitTextToSize(`- ${obj}`, 90);
    pdf.text(lineas, colIzq, yActual);
    yActual += lineas.length * 3.5;
  });

  /*  FOTO PEQUEÑA  */
  const anchoFoto = 20;
  const altoFoto = 20;
  const xFoto = 120;
  const yFoto = y;


  // cargar imagen jugador
  const fotoJugadorPDF = await cargarImagenParaPDF(
    j.foto_url || ""
  );

  if (fotoJugadorPDF) {
    pdf.addImage(
      fotoJugadorPDF,
      "PNG",
      xFoto,
      yFoto,
      anchoFoto,
      altoFoto
    );
  }

  /*datos del jugador */
  const xDatos = xFoto + anchoFoto + 6;
  let yDatos = yFoto;

  pdf.setFontSize(6);

  const escribirDato = (label, value) => {

    pdf.setFont("helvetica", "bold");
    pdf.text(label, xDatos, yDatos);

    pdf.setFont("helvetica", "normal");
    pdf.text(value || "", xDatos + 22, yDatos);

    yDatos += 3; //espacio entre lineas
  };



  escribirDato("Categoría:", j.categoria);
  escribirDato("Jugador:", j.nombre_jugador);
  escribirDato("Fecha Nac.:", j.fecha_nacimiento);
  escribirDato("Demarcación:", j.demarcacion);
  escribirDato("Peso:", j.peso ? `${j.peso} kg` : "");
  escribirDato("Pie Dominante:", j.pie);


  y = Math.max(yActual, yFoto + altoFoto) + 8;

  /*  TABLAS  */
  const tablas = {};

  payload.forEach(p => {
    if (!tablas[p.tabla]) tablas[p.tabla] = [];
    tablas[p.tabla].push(p);
  });

  for (const num of Object.keys(tablas)) {


    const datos = tablas[num];
    if (!datos.length) return;

    const nombreTabla = TITULOS_TABLAS[num] || "VALORACIÓN";

    const TOTAL_COLUMNAS = 4;
    const startX = 14;
    const labelW = 24;
    const colW = (182 - labelW) / TOTAL_COLUMNAS;
    const rowH = 5;
    const videoH = 5;
    const imgTestH = 18;
    const imgTestW = 18;


    pdf.setFontSize(7);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text(nombreTabla, 105, y, { align: "center" });
    pdf.setTextColor(...COLOR_TEXTO);
    y += 5;

    pdf.setFontSize(7);


    for (let i = 0; i < TOTAL_COLUMNAS; i++) {
      pdf.text(String(i + 1), startX + labelW + colW * i + colW / 2, y + 4, { align: "center" });
    }

    lineaHorizontal(startX, startX + labelW + colW * TOTAL_COLUMNAS, y);
    const tablaTop = y;
    y += rowH;

    pdf.setFontSize(7);
    for (let i = 0; i < TOTAL_COLUMNAS; i++) {
      const test = datos[i];
      pdf.text(
        test?.descripcion || "",
        startX + labelW + colW * i + colW / 2,
        y + 4,
        { align: "center", maxWidth: colW - 4 }
      );
    }

    y += rowH;

    const yInicioBloqueImagen = y;

    for (let i = 0; i < TOTAL_COLUMNAS; i++) {
      const test = datos[i];

      // 1. Dibujar Texto "Ver video"
      if (test?.v3) {
        pdf.setTextColor(0, 0, 255);
        pdf.textWithLink(
          "Ver video",
          startX + labelW + colW * i + colW / 2,
          y + 4,
          { align: "center", url: `https://idv-ecu.github.io/Develop/video.html?src=${encodeURIComponent(test.v3)}` }
        );
        pdf.setTextColor(...COLOR_TEXTO);
      }

      //2. Dibujar Imagen justo debajo (sin línea intermedia)
      if (test?.v4) {
        const imgTestPDF = await cargarImagenParaPDF(test.v4);
        if (imgTestPDF) {
          const xImg = startX + labelW + colW * i + colW / 2 - imgTestW / 2;
          // Ajustamos yImg para que empiece un poco después del texto "Ver video"
          const yImg = y + 6;

          pdf.addImage(
            imgTestPDF,
            "PNG",
            xImg,
            yImg,
            imgTestW,
            imgTestH
          );

        }
      }



    }
    // Actualizamos 'y' sumando el espacio del video y de la imagen de una sola vez
    y += videoH + imgTestH + 2;


    // Dibujamos la línea horizontal SOLAMENTE al final de la imagen
    lineaHorizontal(startX, startX + labelW + colW * TOTAL_COLUMNAS, y);

    // for (const f of ["series", "rec", "vel", "carga"]) {

    //   pdf.setFontSize(7);
    //   pdf.text(f.toUpperCase(), startX + 2, y + 4);

    //   for (let i = 0; i < TOTAL_COLUMNAS; i++) {
    //     const test = datos[i];
    //     pdf.text(
    //       test ? String(test[f] || "") : "",
    //       startX + labelW + colW * i + colW / 2,
    //       y + 4,
    //       { align: "center" }
    //     );
    //   }

    //   lineaHorizontal(startX, startX + labelW + colW * TOTAL_COLUMNAS, y);
    //   y += rowH;
    // };

    const LABELS_PDF = {
      series: "SERIES",
      rec: "REP",
      vel: "VEL",
      carga: "CARGA"
    };

    for (const f of ["series", "rec", "vel", "carga"]) {

      pdf.setFontSize(6);
      pdf.text(LABELS_PDF[f], startX + 2, y + 4);

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
    }



    lineaHorizontal(startX, startX + labelW + colW * TOTAL_COLUMNAS, y);
    const tablaBottom = y;

    pdf.setFontSize(7);
    pdf.text(
      nombreTabla,
      startX + labelW / 2,
      tablaTop + (tablaBottom - tablaTop) / 2,
      { align: "center" }
    );

    //lineaVertical(startX, tablaTop, tablaBottom);
    //lineaVertical(startX + labelW, tablaTop, tablaBottom);

    for (let i = 0; i <= TOTAL_COLUMNAS; i++) {
      //lineaVertical(startX + labelW + colW * i, tablaTop, tablaBottom);
    }

    y += 6;
  };

  dibujarFooter();

  const nombreJugador = (j.nombre_jugador || "Jugador")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^\w\-]/g, "");

  const fechaHoy = new Date().toISOString().split("T")[0];

  pdf.save(`PLAN_${nombreJugador}_${fechaHoy}.pdf`);


}


function reactivarFormulario() {

  // Reactivar selects de tests
  document.querySelectorAll(".tabla-valoracion").forEach(tabla => {

    // limpiar contenido visual
    limpiarTabla(tabla);

    // volver a cargar los tests en los selects
    cargarTestsTabla(tabla, testsData);

    // resetear bloques
    tabla.querySelectorAll(".bloquea-select").forEach(s => {
      s.innerHTML = '<option value="">-- Bloque A --</option>';
    });

    tabla.querySelectorAll(".bloqueb-select").forEach(s => {
      s.innerHTML = '<option value="">-- Bloque B --</option>';
    });

    tabla.querySelectorAll(".bloquec-select").forEach(s => {
      s.innerHTML = '<option value="">-- Bloque C --</option>';
    });
  });

  // reset jugador
  const selectJugador = document.getElementById("selectJugador");
  if (selectJugador) selectJugador.value = "";

  // reset objetivos (select2)
  const selectObjetivo = $('#selectTest');
  if (selectObjetivo.length) {
    selectObjetivo.val(null).trigger('change');
  }

  // ocultar foto
  const img = document.getElementById("fotoJugador");
  const cont = document.getElementById("contenedorFoto");
  img.src = "";
  cont.classList.add("oculto");
}
 //funciones para la ventana modal 
 function abrirModalVideo(url) {

  const modal = document.getElementById("modalVideo");
  const video = document.getElementById("videoPlayer");

  video.src = url;
  video.load();
  video.play();

  modal.classList.remove("oculto");
}

function cerrarModalVideo() {

  const modal = document.getElementById("modalVideo");
  const video = document.getElementById("videoPlayer");

  video.pause();
  video.src = "";

  modal.classList.add("oculto");
}
import 'dart:convert';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../modelo/variable_modelo.dart';
import '../servicios/local_queue_service.dart';
import '../vista/formulario_vista.dart';
import 'package:flutter/scheduler.dart';
import 'package:intl/intl.dart';

class FormularioController extends ChangeNotifier {
  final String apiUrl =
      "https://script.google.com/macros/s/AKfycbzhiLHI4GZjruRN-zkreV2gHLVCUIhgybW7OJwVB2l3kLbirJGqwg-kko74q7Doo3cYgA/exec";

  String equipoSeleccionado = "PROFESIONAL";
  void cambiarEquipo(String value) {
    equipoSeleccionado = value;
    notifyListeners();
  }

  // IDENTIFICACIÓN / FECHA (exponer para Summary)
  String id = "";
  String fecha = ""; // yyyy-mm-dd
  String fechaNacimiento = ""; // yyyy-mm-dd

  // SUPL: "si" o "no"
  String supl = "si";
  void setSupl(String v) {
    supl = v;
    notifyListeners();
  }

  // Categorías / nombres / demarcacion
  List<String> categorias = [];
  String? categoriaSeleccionada;
  List<String> nombres = [];
  String? nombreSeleccionado;
  TextEditingController demarcacionController = TextEditingController();

  // Variables VAR1..VAR29
  Map<String, VariableControl> vars = {
    for (int i = 1; i <= 29; i++) "VAR$i": VariableControl(nombre: "VAR $i")
  };
  // SPINNER · Cargando Jugador
  bool cargandoJugador = false;
  void setCargando(bool v) {
    cargandoJugador = v;
    notifyListeners();
  }

  // Limpia los datos si no existe el jugador
  void limpiarDatosJugador() {
    fechaNacimiento = "";
    supl = "no";

    vars.forEach((k, v) {
      v.valor = 0;
    });

    notifyListeners();
  }

  // RESULTADOS R1 - R6
  double r1 = 0;
  double r2 = 0;
  double r3 = 0;
  double r4 = 0;
  double r5 = 0;
  double r6 = 0;
  // REGLAS DE CÁLCULO
  final Map<String, dynamic> reglas = {
    "R1": {
      "indices": ["VAR1", "VAR2", "VAR3"],
      "op": "suma",
    },
    "R2": {
      "indices": ["VAR4", "VAR5"],
      "op": "resta",
    },
    "R3": {
      "indices": ["VAR6", "VAR7"],
      "op": "suma",
    },
    "R4": {
      "indices": ["VAR8", "VAR9", "VAR10"],
      "op": "suma",
    },
    "R5": {
      "indices": ["VAR11", "VAR12", "VAR13"],
      "op": "suma",
    },
    "R6": {
      "indices": ["VAR14", "VAR15", "VAR16", "VAR17", "VAR18"],
      "op": "suma",
    },
  };
  // OPERAR
  double _operar(List<String> indices, String op) {
    double resultado = 0.0;
    for (var key in indices) {
      final double valor = (vars[key]?.valor ?? 0).toDouble();
      if (op == "suma") {
        resultado += valor;
      } else if (op == "resta") {
        resultado -= valor;
      }
    }
    return resultado;
  }
  // CALCULAR R1 - R6
  void procesarReglas() {
    r1 = _operar(List<String>.from(reglas["R1"]["indices"]), reglas["R1"]["op"]);
    r2 = _operar(List<String>.from(reglas["R2"]["indices"]), reglas["R2"]["op"]);
    r3 = _operar(List<String>.from(reglas["R3"]["indices"]), reglas["R3"]["op"]);
    r4 = _operar(List<String>.from(reglas["R4"]["indices"]), reglas["R4"]["op"]);
    r5 = _operar(List<String>.from(reglas["R5"]["indices"]), reglas["R5"]["op"]);
    r6 = _operar(List<String>.from(reglas["R6"]["indices"]), reglas["R6"]["op"]);
    notifyListeners();
  }

  void ejecutarOperaciones() {
    procesarReglas();
  }

  // API: Cargar categorías
  /*Future<void> cargarCategorias() async {
    try {
      final url = Uri.parse("$apiUrl?tipo=categoria");
      final res = await http.get(url);
      final data = jsonDecode(res.body);

      categorias = List<String>.from(data["categorias"]);
      notifyListeners();
    } catch (e) {
      print("Error cargando categorías: $e");
    }
  }*/
  Future<void> cargarCategorias() async {
    final prefs = await SharedPreferences.getInstance();

    try {
      final url = Uri.parse("$apiUrl?tipo=categoria");
      final res = await http.get(url);
      final data = jsonDecode(res.body);

      categorias = List<String>.from(data["categorias"]);

      //guarda en el cache
      await prefs.setStringList("cache_categorias", categorias);

      notifyListeners();
    } catch (e) {
      print("Error cargando categorías: $e");

      //carga datos desde e cache
      categorias = prefs.getStringList("cache_categorias") ?? [];
      notifyListeners();
    }
  }


  Future<void> cambiarCategoria(String? value) async {
    categoriaSeleccionada = value;
    nombreSeleccionado = null;
    nombres = [];
    demarcacionController.text = "";
    notifyListeners();
    if (value != null) {
      await cargarNombresPorCategoria(value);
    }
  }

  /*Future<void> cargarNombresPorCategoria(String categoria) async {
    try {
      final url = Uri.parse("$apiUrl?tipo=nombres&categoria=$categoria");
      final res = await http.get(url);
      final data = jsonDecode(res.body);

      nombres = List<String>.from(data["nombres"]);
      notifyListeners();
    } catch (e) {
      print("Error cargando nombres: $e");
    }
  }*/
  Future<void> cargarNombresPorCategoria(String categoria) async {
    final prefs = await SharedPreferences.getInstance();

    try {
      final url = Uri.parse("$apiUrl?tipo=nombres&categoria=$categoria");
      final res = await http.get(url);
      final data = jsonDecode(res.body);

      nombres = List<String>.from(data["nombres"]);

      //guarda en el cache pero le diferencia por su categoria cada nombre
      await prefs.setStringList("cache_nombres_$categoria", nombres);

      notifyListeners();
    } catch (e) {
      print("Error cargando nombres: $e");

      //carga desde el cache
      nombres = prefs.getStringList("cache_nombres_$categoria") ?? [];

      notifyListeners();
    }
  }


  Future<void> seleccionarNombre(String? value) async {
    nombreSeleccionado = value;
    demarcacionController.text = "";
    notifyListeners();

    if (value != null) {
      await cargarDemarcacion(value);
      await cargarDatosJugador(value);
    }
  }

  /*Future<void> cargarDemarcacion(String nombre) async {
    try {
      final url = Uri.parse("$apiUrl?tipo=marcacion&nombres=$nombre");
      final res = await http.get(url);
      final data = jsonDecode(res.body);

      demarcacionController.text =
      (data["nombres"] is List && data["nombres"].isNotEmpty)
          ? data["nombres"][0]
          : "No encontrado";

      notifyListeners();
    } catch (e) {
      print("Error cargando demarcación: $e");
    }
  }*/
  Future<void> cargarDemarcacion(String nombre) async {
    final prefs = await SharedPreferences.getInstance();

    try {
      final url = Uri.parse("$apiUrl?tipo=marcacion&nombres=$nombre");
      final res = await http.get(url);
      final data = jsonDecode(res.body);

      final demarcacion =
      (data["nombres"] is List && data["nombres"].isNotEmpty)
          ? data["nombres"][0]
          : "No encontrado";

      demarcacionController.text = demarcacion;

      //guarda los datos en el cache
      await prefs.setString("cache_demarcacion_$nombre", demarcacion);

      notifyListeners();
    } catch (e) {
      print("Error cargando demarcación: $e");

      //carga los datos desde el cache
      demarcacionController.text =
          prefs.getString("cache_demarcacion_$nombre") ?? "No encontrado";

      notifyListeners();
    }
  }
  /*datos para el cache*/
  Future<void> sincronizarTodo() async {
    final prefs = await SharedPreferences.getInstance();

    try {
      print("Sincronizando categorías...");

      // 1. Cargar categorías
      final urlCategorias = Uri.parse("$apiUrl?tipo=categoria");
      final resCategorias = await http.get(urlCategorias);
      final dataCategorias = jsonDecode(resCategorias.body);

      categorias = List<String>.from(dataCategorias["categorias"]);
      await prefs.setStringList("cache_categorias", categorias);

      print("Categorías sincronizadas");

      // 2. Recorrer categorías y traer nombres
      for (String cat in categorias) {
        print("Cargando nombres de $cat...");

        final urlNombres = Uri.parse("$apiUrl?tipo=nombres&categoria=$cat");
        final resNombres = await http.get(urlNombres);
        final dataNombres = jsonDecode(resNombres.body);

        final nombresCat = List<String>.from(dataNombres["nombres"]);
        await prefs.setStringList("cache_nombres_$cat", nombresCat);

        print("Nombres de $cat sincronizados");

        // 3. Por cada nombre → cargar demarcación + datos
        for (String nombre in nombresCat) {
          print("Cargando demarcación de $nombre...");

          // === DEMARCACIÓN ===
          final urlDem = Uri.parse("$apiUrl?tipo=marcacion&nombres=$nombre");
          final resDem = await http.get(urlDem);
          final dataDem = jsonDecode(resDem.body);

          final demarcacion =
          (dataDem["nombres"] is List && dataDem["nombres"].isNotEmpty)
              ? dataDem["nombres"][0]
              : "No encontrado";

          await prefs.setString("cache_demarcacion_$nombre", demarcacion);

          print("Demarcación de $nombre lista");


          // === DATOS DEL JUGADOR COMPLETOS ===
          print("Cargando datos del jugador $nombre...");

          final urlJugador = Uri.parse("$apiUrl?tipo=busqueda_nombres&nombre=$nombre");
          final resJugador = await http.get(urlJugador);

          if (resJugador.statusCode == 200) {
            await prefs.setString("cache_jugador_$nombre", resJugador.body);
            print("Datos de $nombre guardados");
          } else {
            print("No se pudo cargar datos de $nombre");
          }
        }
      }

      print("SINCRONIZACIÓN COMPLETA");
    } catch (e) {
      print("Error en sincronización total: $e");
    }
  }


  // CARGAR DATOS JUGADOR
  Future<void> cargarDatosJugador(String nombre) async {
    try {
      setCargando(true);

      final url = Uri.parse("$apiUrl?tipo=busqueda_nombres&nombre=$nombre");
      final res = await http.get(url);

      if (res.statusCode != 200) {
        limpiarDatosJugador();
        setCargando(false);
        return;
      }

      final data = jsonDecode(res.body);

      // Si no hay datos
      if (data.isEmpty || data[0] == null) {
        limpiarDatosJugador();
        setCargando(false);
        return;
      }

      // Fecha nacimiento
      fechaNacimiento = (data[41]?.toString().split("T")[0] ?? "").trim();

      supl = data[7]?.toString().toLowerCase() == "no" ? "no" : "si";

      // Asignación VARs
      final asignaciones = [
        8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        32, 33, 34, 35, 36, 37, 38, 39
      ];

      for (int i = 0; i < asignaciones.length; i++) {
        final raw = data[asignaciones[i]];

        double value = 0;

        if (raw is num) {
          value = raw.toDouble();
        } else if (raw is String) {
          final limpio = raw.replaceAll(RegExp(r'[^0-9\-]'), '');
          value = double.tryParse(limpio) ?? 0;
        }

        vars["VAR${i + 1}"]?.valor = value;
      }

      setCargando(false);

    } catch (e) {
      limpiarDatosJugador();
      setCargando(false);
      //print("ERROR cargarDatosJugador: $e");
    }
  }
  // MANEJO DE VARS
  void incrementar(String key) {
    vars[key]!.valor += 1;
    notifyListeners();
  }
  void decrementar(String key) {
    if (vars[key]!.valor > 0) {
      vars[key]!.valor -= 1;
      notifyListeners();
    }
  }
  // LIMPIARCAMPOS
  void limpiarFormulario() {
    id = "";
    fecha = "";
    fechaNacimiento = "";
    equipoSeleccionado = "PROFESIONAL";
    categoriaSeleccionada = null;
    nombreSeleccionado = null;
    nombres = [];
    demarcacionController.clear();
    supl = "si";
    vars.forEach((key, v) => v.valor = 0);
    r1 = r2 = r3 = r4 = r5 = r6 = 0;
    notifyListeners();
  }
  // GUARDAR REGISTRO
  String limpiarNumero(double v) {
    return (v % 1 == 0) ? v.toInt().toString() : v.toString();
  }

  Future<bool> guardarRegistro() async {
    Map<String, dynamic> dataForm = {};

    try {
      ejecutarOperaciones();

      dataForm = {
        'ID': id.isNotEmpty ? id : "",
        'FECHA': fecha.isNotEmpty ? fecha : "",
        'FECHA_NACIMIENTO': fechaNacimiento.isNotEmpty ? fechaNacimiento : "",
        'EQUIPO': equipoSeleccionado,
        'CATEGORY': categoriaSeleccionada ?? "",
        'NOMBRES': nombreSeleccionado ?? "",
        'DEMARCACION': demarcacionController.text,
        'SUPL': supl,

        for (int i = 1; i <= 29; i++)
          "VAR $i": limpiarNumero(vars["VAR$i"]?.valor ?? 0.0),

        'R1': r1.toString(),
        'R2': r2.toString(),
        'R3': r3.toString(),
        'R4': r4.toString(),
        'R5': r5.toString(),
        'R6': r6.toString(),
      };

      // Verificar Internet
      final conexion = await Connectivity().checkConnectivity();

      if (conexion == ConnectivityResult.none) {
        await LocalQueueService.guardarPendiente(dataForm);
        return true;
      }

      final response = await http.post(Uri.parse(apiUrl), body: dataForm);

      if (response.statusCode == 200 || response.statusCode == 302) {
        return true;
      } else {
        await LocalQueueService.guardarPendiente(dataForm);
        return true;
      }

    } catch (e) {
      await LocalQueueService.guardarPendiente(dataForm);
      return true;
    }
  }

  // -------------------------
  // Guardar y regresar
  // -------------------------
  Future<void> guardarYRegresar(BuildContext context) async {
    bool ok = await guardarRegistro();

    if (ok) {
      limpiarFormulario();

      SchedulerBinding.instance.addPostFrameCallback((_) {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (context) => FormularioView()),
              (route) => false,
        );

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Registro guardado"),
            backgroundColor: Colors.green,
          ),
        );
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Error al guardar"),
          backgroundColor: Colors.red,
        ),
      );
    }
  }
}

import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class LocalQueueService {

  static const String keyPendientes = "registros_pendientes";

  ///Guarda un registro que estan en cache
  static Future<void> guardarPendiente(Map<String, dynamic> data) async {
    final prefs = await SharedPreferences.getInstance();
    List<String> lista = prefs.getStringList(keyPendientes) ?? [];

    // Convertimos todo a String no nulo
    final dataSanitizada = data.map((key, value) {
      if (value == null) return MapEntry(key, "");
      return MapEntry(key, value.toString());
    });

    lista.add(jsonEncode(dataSanitizada));
    await prefs.setStringList(keyPendientes, lista);
  }


  ///Obtiene todos los registro q estan pendientes
  static Future<List<Map<String, dynamic>>> obtenerPendientes() async {
    final prefs = await SharedPreferences.getInstance();
    List<String> lista = prefs.getStringList(keyPendientes) ?? [];

    return lista.map((item) {
      final decoded = jsonDecode(item) as Map<String, dynamic>;

      // Convertir todos los null → "" para evitar errores posteriores
      final limpio = decoded.map((key, value) {
        return MapEntry(key, value?.toString() ?? "");
      });

      return limpio;
    }).toList();
  }


  ///Limpiamos todos los registros
  static Future<void> limpiarPendientes() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(keyPendientes);
  }
}

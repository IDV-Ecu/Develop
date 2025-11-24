import 'dart:convert';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:http/http.dart' as http;

import 'local_queue_service.dart';

class SyncService {

  final String apiUrl;

  SyncService(this.apiUrl);

  /// Detecta cambios de red
  void iniciarListener() {
    Connectivity().onConnectivityChanged.listen((estado) async {
      if (estado != ConnectivityResult.none) {
        print("Se detectó internet. Enviando información pendiente...");
        await enviarPendientes();
      }
    });
  }

  /// Envía todos los registros pendientes al servidor
  Future<void> enviarPendientes() async {
    final pendientes = await LocalQueueService.obtenerPendientes();

    if (pendientes.isEmpty) {
      print("No hay registros pendientes.");
      return;
    }


    for (var registro in pendientes) {
      try {
        // Sanitizar nulls
        final registroLimpio = registro.map((key, value) {
          return MapEntry(key, value?.toString() ?? "");
        });

        final res = await http.post(
          Uri.parse(apiUrl),
          body: registroLimpio,
        );

        if (res.statusCode == 200 || res.statusCode == 302) {
          print("Registro enviado correctamente");
        } else {
          print("alló un envío. Se detiene.");
          return;
        }

      } catch (e) {
        print("Error enviando: $e");
        return;
      }
    }

    await LocalQueueService.limpiarPendientes();
    print("Sincronización completada. Cache limpiado.");
  }
}

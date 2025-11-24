import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'controlador/formulario_controlador.dart';
import 'vista/formulario_vista.dart';
import 'servicios/sync_service.dart';

void main() async {

  WidgetsFlutterBinding.ensureInitialized();

  // Crear manualmente el controlador para acceder a la URL
  final formularioController = FormularioController();

  // Crear el SyncService usando la URL del controlador
  final syncService = SyncService(formularioController.apiUrl);

  // Sincronizar pendientes al iniciar la app
  await syncService.enviarPendientes();

  // Escuchar red
  syncService.iniciarListener();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => formularioController),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: FormularioView(),
    );
  }
}


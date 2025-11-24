import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../controlador/formulario_controlador.dart';
import 'pantalla_skin.dart';
import 'var_card.dart';

class PantallaPeri extends StatelessWidget {
  const PantallaPeri({super.key});

  @override
  Widget build(BuildContext context) {
    final c = Provider.of<FormularioController>(context);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: const Color(0xFF7B2AFF),
        iconTheme: const IconThemeData(
          color: Colors.white,
        ),
        title: const Text(
          "",
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        centerTitle: true,
      ),

      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("PERI",
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF7B2AFF))),
            const Divider(),

            _filaVars(context, c, [
              "VAR12", "VAR13", "VAR14", "VAR15"
            ]),
            const SizedBox(height: 10),
            _filaVars(context, c, [
              "VAR16", "VAR17", "VAR18", "VAR19"
            ]),
            const SizedBox(height: 10),
            _filaVars(context, c, [
              "VAR20", "VAR21"
            ]),

            const SizedBox(height: 30),

            Align(
              alignment: Alignment.centerRight,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF7B2AFF)),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (_) => const PantallaSkin()),
                  );
                },
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      "Continuar",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,   // ← COLOR BLANCO
                      ),
                    ),
                    SizedBox(width: 10),
                    Icon(
                      Icons.arrow_forward,
                      color: Colors.white,
                    ),
                  ],
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
Widget _filaVars(BuildContext context, FormularioController c, List<String> keys) {
  final double screenWidth = MediaQuery.of(context).size.width;

  double tileWidth = (screenWidth >= 900)
      ? (screenWidth - 120) / 4
      : (screenWidth >= 600)
      ? (screenWidth - 100) / 3
      : (screenWidth - 60) / 2;

  if (tileWidth < 140) tileWidth = (screenWidth - 40) / 2;
  if (tileWidth > 320) tileWidth = 320;

  return Wrap(
    spacing: 12,
    runSpacing: 12,
    children: keys.map((k) {
      final v = c.vars[k]!;
      return SizedBox(
        width: tileWidth,
        child: VarCard(controller: c, keyVar: k, variable: v), // ← usamos VarCard aquí
      );
    }).toList(),
  );
}
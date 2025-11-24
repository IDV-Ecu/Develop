import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../controlador/formulario_controlador.dart';
import 'Summary.dart';
import 'var_card.dart';

class PantallaSkin extends StatefulWidget {
  const PantallaSkin({super.key});

  @override
  State<PantallaSkin> createState() => _PantallaSkinState();
}

class _PantallaSkinState extends State<PantallaSkin> {
  final TextEditingController fechaNacController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final c = Provider.of<FormularioController>(context);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      fechaNacController.text = c.fechaNacimiento;
    });

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

            const Text("SKIN",
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF7B2AFF))),
            const Divider(),

            _filaVars(context, c,
                ["VAR22", "VAR23", "VAR24", "VAR25"]),
            const SizedBox(height: 10),
            _filaVars(context, c, ["VAR26", "VAR27", "VAR28", "VAR29"]),

            const SizedBox(height: 25),
            // Fecha nacimiento
            const Text("Fecha Nacimiento",
                style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            TextField(
              controller: fechaNacController,
              readOnly: true,
              decoration: InputDecoration(
                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                suffixIcon: const Icon(Icons.calendar_today),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onTap: () async {
                final d = await showDatePicker(
                  context: context,
                  initialDate: DateTime(2005),
                  firstDate: DateTime(1980),
                  lastDate: DateTime.now(),
                );
                if (d != null) {
                  String f = "${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}";
                  fechaNacController.text = f;
                  c.fechaNacimiento = f; // guardar en provider
                }
              },
            ),
            /*boton de continuar*/
            const SizedBox(height: 40),
            Align(
              alignment: Alignment.centerRight,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF7B2AFF)),
                onPressed: () {
                  c.ejecutarOperaciones();
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (_) => const PantallaSummary()),
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
                      color: Colors.white,     // ← ÍCONO BLANCO (opcional)
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



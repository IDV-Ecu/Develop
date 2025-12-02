import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../controlador/formulario_controlador.dart';

class PantallaSummary extends StatelessWidget {
  const PantallaSummary({super.key});

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

            const Text("SUMMARY",
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF7B2AFF))),
            const Divider(),

            const SizedBox(height: 5),
            // R1 – R6 (tus tarjetas)
            _cardResultado("R1", c.r1),
            _cardResultado("R2", c.r2),
            _cardResultado("R3", c.r3),
            _cardResultado("R4", c.r4),
            _cardResultado("R5", c.r5),
            _cardResultado("R6", c.r6),

            const SizedBox(height: 5),

            const Text("SUPL",
                style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold)),
            const SizedBox(height: 7),

            Row(
              children: [
                _radioSupl(c, context, "si", "SI"),
                const SizedBox(width: 10),
                _radioSupl(c, context, "no", "NO"),
              ],
            ),

            const SizedBox(height: 35),
            // BOTÓN GUARDAR
            Align(
              alignment: Alignment.centerRight,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF7B2AFF),
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: () async {
                  final c = Provider.of<FormularioController>(context, listen: false);

                  // MENSAJE DE CONFIRMACIÓN
                  final confirmar = await showDialog<bool>(
                    context: context,
                    builder: (_) => AlertDialog(
                      title: const Text("Confirmar"),
                      content: const Text("¿Deseas guardar los datos?"),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context, false),
                          child: const Text(
                            "Cancelar",
                            style: TextStyle(color: Colors.black),
                          ),
                        ),
                        TextButton(
                          onPressed: () => Navigator.pop(context, true),
                          child: const Text(
                            "Guardar",
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Colors.black, // ← IGUAL estilo que Cancelar
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                  if (confirmar != true) return;
                  showDialog(
                    context: context,
                    barrierDismissible: false,
                    builder: (_) => const Center(
                      child: CircularProgressIndicator(color: Color(0xFF7B2AFF)),
                    ),
                  );
                  await c.guardarYRegresar(context);
                  Navigator.pop(context); // Cerrar loading
                },

                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      "Guardar",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    SizedBox(width: 10),
                    Icon(Icons.save, color: Colors.white),
                  ],
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _radioSupl(FormularioController c, BuildContext context, String value, String label) {
    final bool activo = c.supl == value;

    return Expanded(
      child: GestureDetector(
        onTap: () => c.setSupl(value),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: activo ? const Color(0xFF7B2AFF) : Colors.white,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: const Color(0xFF7B2AFF)),
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: TextStyle(
              color: activo ? Colors.white : const Color(0xFF7B2AFF),
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }
  Widget _cardResultado(String titulo, double valor) {
    return Stack(
      children: [
        // Tarjeta con valor centrado
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
          margin: const EdgeInsets.only(top: 12, bottom: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFF7B2AFF), width: 1.2),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.1),
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Center(
            child: Text(
              valor.toStringAsFixed(2),
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
          ),
        ),
        // Título afuera de la tarjeta
        Positioned(
          left: 8,
          top: 0,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 6),
            color: Colors.white,
            child: Text(
              titulo,
              style: const TextStyle(
                color: Colors.black,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
          ),
        ),
      ],
    );
  }




}

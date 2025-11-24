import 'package:flutter/material.dart';
import '../controlador/formulario_controlador.dart';

class VarCard extends StatelessWidget {
  final FormularioController controller;
  final String keyVar;
  final dynamic variable;

  const VarCard({
    super.key,
    required this.controller,
    required this.keyVar,
    required this.variable,
  });

  @override
  Widget build(BuildContext context) {
    final TextEditingController valorController =
    TextEditingController(text: variable.valor.toString());

    valorController.addListener(() {
      final doubleValue = double.tryParse(valorController.text);
      if (doubleValue != null) {
        variable.valor = doubleValue;
      }
    });

    return LayoutBuilder(
      builder: (context, constraints) {
        double cardWidth = (constraints.maxWidth / 4) - 12; // 4 por fila
        if (constraints.maxWidth > 800) cardWidth = (constraints.maxWidth / 6) - 12;

        return Container(
          width: cardWidth,
          margin: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: const Color(0xFFF8F1FF),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                variable.nombre,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                  color: Colors.black,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  GestureDetector(
                    onTap: () {
                      controller.decrementar(keyVar);
                      valorController.text = variable.valor.toInt().toString();
                    },
                    child: Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: const Color(0xFF7B2AFF), width: 1.5),
                        color: Colors.white,
                      ),
                      child: const Icon(Icons.remove, color: Color(0xFF7B2AFF), size: 16),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: SizedBox(
                      height: 32,
                      child: TextField(
                        controller: valorController,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                        decoration: InputDecoration(
                          contentPadding: const EdgeInsets.symmetric(vertical: 4),
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(6),
                            borderSide: BorderSide(color: Colors.grey.shade300, width: 1),
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: () {
                      controller.incrementar(keyVar);
                      valorController.text = variable.valor.toInt().toString();
                    },
                    child: Container(
                      width: 28,
                      height: 28,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: Color(0xFF7B2AFF),
                      ),
                      child: const Icon(Icons.add, color: Colors.white, size: 16),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}


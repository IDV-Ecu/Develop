import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../controlador/formulario_controlador.dart';
import 'PantallaPeri.dart';
import 'package:flutter/services.dart';
import 'var_card.dart';

class FormularioView extends StatefulWidget {
  const FormularioView({super.key});

  @override
  State<FormularioView> createState() => _FormularioViewState();
}

class _FormularioViewState extends State<FormularioView> {
  final TextEditingController idController = TextEditingController();
  final TextEditingController fechaController = TextEditingController();

  @override
  void initState() {
    super.initState();

    final controller = Provider.of<FormularioController>(context, listen: false);

    // Solo cuando haya internet
    controller.sincronizarTodo();

    Future.microtask(() =>
        Provider.of<FormularioController>(context, listen: false)
            .cargarCategorias());
  }

  @override
  Widget build(BuildContext context) {
    final controller = Provider.of<FormularioController>(context);

    return Stack(
      children: [
        Scaffold(
          backgroundColor: Colors.white,
          appBar: AppBar(
            backgroundColor: const Color(0xFF7B2AFF),
            title: const Text(
              "FORMULARIO DE CONTROL",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            centerTitle: false,
            actions: [
              IconButton(
                icon: const Icon(Icons.logout, color: Colors.white),
                onPressed: () {
                  _confirmarSalida(context);
                },
              )
            ],
          ),

          body: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ID + Fecha
                Row(
                  children: [
                    Expanded(
                      child: _campoTexto(
                        "ID",
                        idController,
                        onChanged: (v) {
                          controller.id = v;
                        },
                      ),
                    ),
                    const SizedBox(width: 15),
                    Expanded(child: _campoFecha(context)),
                  ],
                ),
                const SizedBox(height: 15),
                const Text("EQUIPO",
                    style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Row(
                  children: [
                    _btnEquipo(context, "PROFESIONAL"),
                    const SizedBox(width: 10),
                    _btnEquipo(context, "FORMATIVAS"),
                  ],
                ),

                const SizedBox(height: 15),
                const Text("Categoría",
                    style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 5),
                DropdownButtonFormField<String>(
                  isExpanded: true,
                  decoration: InputDecoration(
                    contentPadding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  value: controller.categoriaSeleccionada,
                  items: controller.categorias
                      .map((cat) => DropdownMenuItem(
                    value: cat,
                    child: Text(cat,
                        overflow: TextOverflow.ellipsis),
                  ))
                      .toList(),
                  onChanged: controller.cambiarCategoria,
                ),

                const SizedBox(height: 15),
                const Text("Nombre",
                    style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 5),

                DropdownButtonFormField<String>(
                  isExpanded: true,
                  decoration: InputDecoration(
                    contentPadding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 12),
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  value: controller.nombreSeleccionado,
                  items: controller.nombres
                      .map((nom) => DropdownMenuItem(
                    value: nom,
                    child: Text(nom,
                        overflow: TextOverflow.ellipsis),
                  ))
                      .toList(),
                  onChanged: (v) {
                    controller.seleccionarNombre(v);

                    if (v != null) {
                      controller.cargarDatosJugador(v);
                    }
                  },
                ),

                const SizedBox(height: 10),
                Visibility(
                  visible: false,
                  child: TextField(
                    controller: controller.demarcacionController,
                    readOnly: true,
                    decoration: InputDecoration(
                      contentPadding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),

                // ======= VARS ========
                const Text("BASIC",
                    style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF7B2AFF))),
                const Divider(),

                _filaVars(controller, ["VAR1", "VAR2", "VAR3", "VAR4"]),
                const SizedBox(height: 10),

                const Text("DIAM",
                    style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF7B2AFF))),
                const Divider(),

                _filaVars(controller, ["VAR5", "VAR6", "VAR7", "VAR8"]),
                const SizedBox(height: 10),

                _filaVars(controller, ["VAR9", "VAR10", "VAR11"]),

                const SizedBox(height: 5),

                Align(
                  alignment: Alignment.centerRight,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF7B2AFF),
                    ),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const PantallaPeri()),
                      );
                    },
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text("Continuar",
                            style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.white)),
                        SizedBox(width: 10),
                        Icon(Icons.arrow_forward, color: Colors.white),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),

        // SPINNER
        if (controller.cargandoJugador) ...[
          Positioned.fill(
            child: Container(
              color: Colors.black54,
              child: const Center(
                child: CircularProgressIndicator(color: Colors.white),
              ),
            ),
          )
        ]
      ],
    );
  }
  /*mensaje de confirmacion para cerrar seccion*/
  void _confirmarSalida(BuildContext context) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return AlertDialog(
          title: const Text(
            "Confirmación",
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          content: const Text("¿Está seguro que desea cerrar la aplicación?"),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("No"),
            ),
            TextButton(
              onPressed: () {
                SystemNavigator.pop(); // 🔥 CIERRA LA APP
              },
              child: const Text(
                "Sí",
                style: TextStyle(color: Colors.red),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _campoTexto(String label, TextEditingController controller,
      {Function(String)? onChanged}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
        const SizedBox(height: 5),
        TextField(
          controller: controller,
          onChanged: onChanged,
          decoration: InputDecoration(
            contentPadding:
            const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            border:
            OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
      ],
    );
  }

  Widget _campoFecha(BuildContext context) {
    final controllerProv =
    Provider.of<FormularioController>(context, listen: false);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("FECHA",
            style: TextStyle(fontWeight: FontWeight.bold)),
        const SizedBox(height: 5),
        TextField(
          controller: fechaController,
          readOnly: true,
          decoration: InputDecoration(
            suffixIcon: const Icon(Icons.calendar_today),
            contentPadding:
            const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            border:
            OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
          onTap: () async {
            final DateTime? pickedDate = await showDatePicker(
              context: context,
              initialDate: DateTime.now(),
              firstDate: DateTime(2020),
              lastDate: DateTime(2100),
            );
            if (pickedDate != null) {
              String f =
                  "${pickedDate.year}-${pickedDate.month.toString().padLeft(2, '0')}-${pickedDate.day.toString().padLeft(2, '0')}";
              fechaController.text = f;
              controllerProv.fecha = f;
            }
          },
        ),
      ],
    );
  }

  Widget _btnEquipo(BuildContext context, String texto) {
    final controller = Provider.of<FormularioController>(context);
    final activo = controller.equipoSeleccionado == texto;

    return Expanded(
      child: GestureDetector(
        onTap: () => controller.cambiarEquipo(texto),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: activo ? const Color(0xFF7B2AFF) : Colors.white,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: const Color(0xFF7B2AFF)),
          ),
          alignment: Alignment.center,
          child: Text(
            texto,
            style: TextStyle(
              color: activo ? Colors.white : const Color(0xFF7B2AFF),
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }

  Widget _filaVars(FormularioController c, List<String> keys) {
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
      children: keys
          .map((k) => SizedBox(
          width: tileWidth,
          child: VarCard(controller: c, keyVar: k, variable: c.vars[k]!)))
          .toList(),
    );
  }
}

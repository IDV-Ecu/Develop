class Jugador {
  String id;
  String nombres;
  String categoria;
  String fecha;
  Map<String, double> vars;

  Jugador({
    required this.id,
    required this.nombres,
    required this.categoria,
    required this.fecha,
    required this.vars,
  });
}


const mongoose = require("mongoose");

const bitacoraSchema = new mongoose.Schema({
  ordenServicioId: {
    type: Number,
    required: [true, "El ID de la orden es obligatorio"],
    min: [1, "El ID de la orden debe ser mayor que cero"],
  },
  userId: {
    type: Number,
    required: [true, "El ID del usuario es obligatorio"],
  },
  servicio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Servicio",
  },
  numeroEntrada: {
    type: Number,
    required: [true, "El número de entrada es obligatorio"],
    min: [1, "El número de entrada debe ser mayor que cero"],
    validate: {
      validator: Number.isInteger,
      message: "El número de entrada debe ser entero",
    },
  },
  detalle: {
    type: String,
    required: [true, "El detalle es obligatorio"],
    minlength: [10, "El detalle debe tener al menos 10 caracteres"],
  },
  vehiculoPlaca: {
    type: String,
    required: [true, "La placa es obligatoria"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

bitacoraSchema.index({ ordenServicioId: 1, numeroEntrada: 1 }, { unique: true });
bitacoraSchema.index({ servicio: 1, createdAt: -1 });

module.exports = mongoose.model("Bitacora", bitacoraSchema);


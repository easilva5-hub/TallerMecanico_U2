
const mongoose = require("mongoose");
const slugify = require("slugify");

const servicioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    minlength: [3, "El nombre debe tener al menos 3 caracteres"],
  },
  codigo: {
    type: String,
    required: [true, "El código es obligatorio"],
    unique: true,
    match: [/^[A-Z]{3}-\d{2}$/, "El código debe tener el formato ABC-01"],
  },
  categoria: {
    type: String,
    enum: {
      values: ["mantenimiento", "reparacion", "diagnostico"],
      message: "La categoría {VALUE} no es válida",
    },
    required: [true, "La categoría es obligatoria"],
  },
  tiempoEstimadoMin: {
    type: Number,
    required: [true, "El tiempo estimado es obligatorio"],
    min: [15, "El tiempo mínimo es 15 minutos"],
    max: [480, "El tiempo máximo es 480 minutos"],
    validate: {
      validator: (value) => value % 15 === 0,
      message: (props) => `${props.value} no es múltiplo de 15 minutos`,
    },
  },
  repuestos: {
    type: [String],
    default: [],
  },
  slug: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { toJSON: { virtuals: true } });

servicioSchema.virtual("info").get(function () {
  return `${this.nombre} (${this.codigo}): ${this.tiempoEstimadoMin} minutos`;
});

servicioSchema.pre("validate", function () {
  if (this.nombre) {
    this.slug = slugify(this.nombre, { lower: true, strict: true });
  }
});

module.exports = mongoose.model("Servicio", servicioSchema);

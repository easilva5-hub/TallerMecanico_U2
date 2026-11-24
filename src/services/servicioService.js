
const Servicio = require("../models/servicio");
const Bitacora = require("../models/bitacora");
const prisma = require("../db/prisma");

const UPDATABLE_FIELDS = [
  "nombre",
  "codigo",
  "categoria",
  "tiempoEstimadoMin",
  "repuestos",
];

const createServicioService = async (data) => {
  return await Servicio.create(data);
};

const listServiciosService = async ({ q, fields, sort } = {}) => {
  const filtro = {};
  if (q) filtro.nombre = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
  const campos = fields ? fields.split(",").join(" ") : "-__v";
  const ordenes = ["nombre", "-nombre", "tiempoEstimadoMin", "-tiempoEstimadoMin", "createdAt", "-createdAt"];
  const orden = ordenes.includes(sort) ? sort : "nombre";
  return await Servicio.find(filtro).select(campos).sort(orden);
};

const getServicioByIdService = async (id) => {
  return await Servicio.findById(id);
};

const updateServicioService = async (id, data = {}) => {
  const servicio = await Servicio.findById(id);
  if (!servicio) return null;
  for (const field of UPDATABLE_FIELDS) {
    if (data[field] !== undefined) servicio.set(field, data[field]);
  }
  return await servicio.save();
};

const deleteServicioService = async (id) => {
  const servicio = await Servicio.findById(id);
  if (!servicio) return null;

  const ordenes = await prisma.ordenServicio.count({
    where: { servicioId: id },
  });

  if (ordenes > 0) {
    const error = new Error("No se puede eliminar el servicio porque tiene órdenes relacionadas");
    error.statusCode = 409;
    throw error;
  }

  await Bitacora.deleteMany({ servicio: servicio._id });
  await servicio.deleteOne();
  return servicio;
};

module.exports = { createServicioService, listServiciosService, getServicioByIdService, updateServicioService, deleteServicioService };

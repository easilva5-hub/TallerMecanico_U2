
const prisma = require("../db/prisma");
const Servicio = require("../models/servicio");
const Bitacora = require("../models/bitacora");
const { isValidObjectId } = require("mongoose");

const crearError = (mensaje, statusCode) => {
  const error = new Error(mensaje);
  error.statusCode = statusCode;
  throw error;
};

const createOrdenServicioService = async (data, userId) => {
  const { vehiculoPlaca, servicioId } = data;

  if (typeof vehiculoPlaca !== "string" || vehiculoPlaca.trim().length < 5) {
    crearError("La placa del vehículo debe tener al menos 5 caracteres", 400);
  }

  if (servicioId !== undefined && servicioId !== null) {
    if (typeof servicioId !== "string" || !isValidObjectId(servicioId)) {
      crearError("El ID del servicio no es válido", 400);
    }

    const existe = await Servicio.exists({ _id: servicioId });
    if (!existe) crearError("El servicio no existe en MongoDB", 404);
  }

  return await prisma.ordenServicio.create({
    data: {
      vehiculoPlaca: vehiculoPlaca.trim().toUpperCase(),
      estado: "pendiente",
      servicioId: servicioId || null,
      userId,
    },
  });
};

const listOrdenesServicioService = async (userId, role) => {
  const ordenes = await prisma.ordenServicio.findMany({
    where: role === "ADMIN" ? {} : { userId },
    orderBy: { fechaIngreso: "desc" },
  });

  const ids = [...new Set(ordenes.map(o => o.servicioId).filter(Boolean))];

  const servicios = await Servicio.find({
    _id: { $in: ids },
  }).select("nombre codigo categoria tiempoEstimadoMin");

  const mapa = new Map(servicios.map(s => [s._id.toString(), s]));

  return ordenes.map(orden => ({
    ...orden,
    servicio: mapa.get(orden.servicioId) || null,
  }));
};

const getOrdenServicioByIdService = async (id, userId, role) => {
  const orden = await prisma.ordenServicio.findUnique({
    where: { id: Number(id) },
  });

  if (!orden) crearError("Orden de servicio no encontrada", 404);
  if (orden.userId !== userId && role !== "ADMIN") {
    crearError("No tienes permiso para consultar esta orden", 403);
  }

  const servicio = orden.servicioId
    ? await Servicio.findById(orden.servicioId)
    : null;

  return { ...orden, servicio };
};

const updateEstadoOrdenServicioService = async (id, estado, userId, role) => {
  const estados = ["pendiente", "en_proceso", "finalizada"];

  if (!estados.includes(estado)) {
    crearError("El estado debe ser pendiente, en_proceso o finalizada", 400);
  }

  const orden = await prisma.ordenServicio.findUnique({
    where: { id: Number(id) },
  });

  if (!orden) crearError("Orden de servicio no encontrada", 404);
  if (orden.userId !== userId && role !== "ADMIN") {
    crearError("No tienes permiso para modificar esta orden", 403);
  }

  return await prisma.ordenServicio.update({
    where: { id: Number(id) },
    data: { estado },
  });
};

const deleteOrdenServicioService = async (id, userId, role) => {
  const orden = await prisma.ordenServicio.findUnique({
    where: { id: Number(id) },
  });

  if (!orden) crearError("Orden de servicio no encontrada", 404);
  if (orden.userId !== userId && role !== "ADMIN") {
    crearError("No tienes permiso para eliminar esta orden", 403);
  }

  await Bitacora.deleteMany({ ordenServicioId: orden.id });

  return await prisma.ordenServicio.delete({
    where: { id: orden.id },
  });
};

module.exports = { createOrdenServicioService, listOrdenesServicioService, getOrdenServicioByIdService, updateEstadoOrdenServicioService, deleteOrdenServicioService };

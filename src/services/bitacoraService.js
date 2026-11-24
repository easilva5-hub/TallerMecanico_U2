
const prisma = require("../db/prisma");
const Bitacora = require("../models/bitacora");
const { isValidObjectId } = require("mongoose");

const crearError = (mensaje, statusCode) => {
  const error = new Error(mensaje);
  error.statusCode = statusCode;
  throw error;
};

const obtenerFiltro = async (userId, role) => {
  if (role === "ADMIN") return {};
  const ordenes = await prisma.ordenServicio.findMany({
    where: { userId },
    select: { id: true },
  });
  return { ordenServicioId: { $in: ordenes.map(o => o.id) } };
};

const createBitacoraService = async (data, userId, role) => {
  const ordenServicioId = Number(data.ordenServicioId);

  if (!Number.isSafeInteger(ordenServicioId) || ordenServicioId <= 0) {
    crearError("El ID de la orden no es válido", 400);
  }

  const orden = await prisma.ordenServicio.findUnique({
    where: { id: ordenServicioId },
  });

  if (!orden) crearError("Orden de servicio no encontrada", 404);

  if (orden.userId !== userId && role !== "ADMIN") {
    crearError("No tienes permiso para registrar esta bitácora", 403);
  }

  return await Bitacora.create({
    ordenServicioId: orden.id,
    userId,
    servicio: orden.servicioId || undefined,
    numeroEntrada: data.numeroEntrada,
    detalle: data.detalle,
    vehiculoPlaca: orden.vehiculoPlaca,
  });
};

const listBitacorasService = async (userId, role) => {
  const filtro = await obtenerFiltro(userId, role);

  return await Bitacora.find(filtro)
    .populate("servicio", "nombre codigo categoria tiempoEstimadoMin")
    .sort({ createdAt: -1, numeroEntrada: -1 });
};

const resumenBitacorasService = async (userId, role) => {
  const filtro = await obtenerFiltro(userId, role);

  return await Bitacora.aggregate([
    { $match: filtro },
    {
      $group: {
        _id: "$ordenServicioId",
        totalEntradas: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

const deleteBitacoraService = async (id, userId, role) => {
  if (!isValidObjectId(id)) {
    crearError("El ID de la bitácora no es válido", 400);
  }

  const bitacora = await Bitacora.findById(id);
  if (!bitacora) crearError("Bitácora no encontrada", 404);

  const orden = await prisma.ordenServicio.findUnique({
    where: { id: bitacora.ordenServicioId },
  });

  if (!orden) crearError("Orden de servicio no encontrada", 404);

  if (orden.userId !== userId && role !== "ADMIN") {
    crearError("No tienes permiso para eliminar esta bitácora", 403);
  }

  return await Bitacora.findByIdAndDelete(id);
};

module.exports = { createBitacoraService, listBitacorasService, resumenBitacorasService, deleteBitacoraService };

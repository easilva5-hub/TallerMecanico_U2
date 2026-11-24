
const { createServicioService, listServiciosService, getServicioByIdService, updateServicioService, deleteServicioService } = require("../services/servicioService");

const handleError = (res, error) => {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({ error: "Datos inválidos", errors });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ error: "ID inválido" });
  }
  if (error.code === 11000) {
    return res.status(409).json({ error: "El código del servicio ya existe" });
  }
  if (error.statusCode) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  return res.status(500).json({ error: "Error interno del servidor" });
};

const createServicio = async (req, res) => {
  try {
    const servicio = await createServicioService(req.body);
    res.status(201).json(servicio);
  } catch (error) {
    handleError(res, error);
  }
};

const listServicios = async (req, res) => {
  try {
    const servicios = await listServiciosService(req.query);
    res.status(200).json(servicios);
  } catch (error) {
    handleError(res, error);
  }
};

const getServicio = async (req, res) => {
  try {
    const servicio = await getServicioByIdService(req.params.id);
    if (!servicio) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }
    res.status(200).json(servicio);
  } catch (error) {
    handleError(res, error);
  }
};

const updateServicio = async (req, res) => {
  try {
    const servicio = await updateServicioService(req.params.id, req.body);
    if (!servicio) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }
    res.status(200).json(servicio);
  } catch (error) {
    handleError(res, error);
  }
};

const deleteServicio = async (req, res) => {
  try {
    const servicio = await deleteServicioService(req.params.id);
    if (!servicio) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }
    res.status(200).json(servicio);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { createServicio, listServicios, getServicio, updateServicio, deleteServicio };


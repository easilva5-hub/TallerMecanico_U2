
const { createOrdenServicioService, listOrdenesServicioService, getOrdenServicioByIdService, updateEstadoOrdenServicioService, deleteOrdenServicioService } = require("../services/ordenServicioService");

const handleError = (res, error) => {
  if (error.statusCode) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  return res.status(500).json({ error: "Error interno del servidor" });
};

const validarId = (id) => Number.isSafeInteger(Number(id)) && Number(id) > 0;

const createOrdenServicio = async (req, res) => {
  try {
    const orden = await createOrdenServicioService(req.body, req.user.id);
    res.status(201).json(orden);
  } catch (error) {
    handleError(res, error);
  }
};

const listOrdenesServicio = async (req, res) => {
  try {
    const ordenes = await listOrdenesServicioService(req.user.id, req.user.role);
    res.status(200).json(ordenes);
  } catch (error) {
    handleError(res, error);
  }
};

const getOrdenServicio = async (req, res) => {
  if (!validarId(req.params.id)) {
    return res.status(400).json({ error: "ID de orden inválido" });
  }
  try {
    const orden = await getOrdenServicioByIdService(req.params.id, req.user.id, req.user.role);
    res.status(200).json(orden);
  } catch (error) {
    handleError(res, error);
  }
};

const updateEstadoOrdenServicio = async (req, res) => {
  if (!validarId(req.params.id)) {
    return res.status(400).json({ error: "ID de orden inválido" });
  }
  try {
    const orden = await updateEstadoOrdenServicioService(req.params.id, req.body.estado, req.user.id, req.user.role);
    res.status(200).json(orden);
  } catch (error) {
    handleError(res, error);
  }
};

const deleteOrdenServicio = async (req, res) => {
  if (!validarId(req.params.id)) {
    return res.status(400).json({ error: "ID de orden inválido" });
  }
  try {
    const orden = await deleteOrdenServicioService(req.params.id, req.user.id, req.user.role);
    res.status(200).json(orden);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { createOrdenServicio, listOrdenesServicio, getOrdenServicio, updateEstadoOrdenServicio, deleteOrdenServicio };

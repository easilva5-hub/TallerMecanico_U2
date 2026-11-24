
const { createBitacoraService, listBitacorasService, resumenBitacorasService, deleteBitacoraService } = require("../services/bitacoraService");

const handleError = (res, error) => {
  if (error.statusCode) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({ error: "Datos inválidos", errors });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ error: "Valor inválido" });
  }
  if (error.code === 11000) {
    return res.status(409).json({ error: "Ya existe una entrada con ese número para la orden" });
  }
  return res.status(500).json({ error: "Error interno del servidor" });
};

const createBitacora = async (req, res) => {
  try {
    const bitacora = await createBitacoraService(req.body, req.user.id, req.user.role);
    res.status(201).json(bitacora);
  } catch (error) {
    handleError(res, error);
  }
};

const listBitacoras = async (req, res) => {
  try {
    const bitacoras = await listBitacorasService(req.user.id, req.user.role);
    res.status(200).json(bitacoras);
  } catch (error) {
    handleError(res, error);
  }
};

const resumenBitacoras = async (req, res) => {
  try {
    const resumen = await resumenBitacorasService(req.user.id, req.user.role);
    res.status(200).json(resumen);
  } catch (error) {
    handleError(res, error);
  }
};

const deleteBitacora = async (req, res) => {
  try {
    const bitacora = await deleteBitacoraService(req.params.id, req.user.id, req.user.role);
    res.status(200).json(bitacora);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { createBitacora, listBitacoras, resumenBitacoras, deleteBitacora };

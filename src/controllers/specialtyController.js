
const { createSpecialtyService } = require("../services/specialtyService");
const { listSpecialtiesService } = require("../services/specialtyService");
const { deleteSpecialtiesService } = require("../services/specialtyService");
const { updateSpecialtiesService } = require("../services/specialtyService");
const { getSpecialtyByIdService } = require("../services/specialtyService");
const { deleteByAreaService } = require("../services/specialtyService");

const handleError = (res, error) => {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({ error: "Datos inválidos", errors });
  }
  if (error.name === "CastError") {
    return res
      .status(400)
      .json({ error: `Valor inválido para ${error.path}: ${error.value}` });
  }
  return res.status(500).json({ error: "Error interno del servidor" });
};

const createSpecialty = async (req, res) => {
  try {
    const specialty = await createSpecialtyService(req.body);
    res.status(201).json(specialty);
  } catch (error) {
    handleError(res, error);
  }
};

const listSpecialty = async (req, res) => {
  try {
    const specialty = await listSpecialtiesService();
    res.status(200).json(specialty);
  } catch (error) {
    handleError(res, error);
  }
};

const getSpecialty = async (req, res) => {
  try {
    const specialty = await getSpecialtyByIdService(req.params.id);
    if (!specialty) {
      return res.status(404).json({ error: "Especialidad no encontrada" });
    }
    res.status(200).json(specialty);
  } catch (error) {
    handleError(res, error);
  }
};

const updateSpecialty = async (req, res) => {
  try {
    const specialty = await updateSpecialtiesService(req.params.id, req.body);
    if (!specialty) {
      return res.status(404).json({ error: "Error registro no encontrado" });
    }
    res.status(200).json(specialty);
  } catch (error) {
    handleError(res, error);
  }
};

const deleteSpecialty = async (req, res) => {
  try {
    const specialty = await deleteSpecialtiesService(req.params.id);
    if (!specialty)
      return res.status(404).json({ error: "Especialidad no encontrada" });
    res.json(specialty);
  } catch (error) {
    handleError(res, error);
  }
};

const deleteByArea = async (req, res) => {
  try {
    const specialty = await deleteByAreaService(req.params.area);
    res.json(specialty);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { createSpecialty, listSpecialty, getSpecialty, deleteSpecialty, updateSpecialty, deleteByArea };


const Speciality = require("../models/specialty");
const UPDATABLE_FIELDS = [
  "name",
  "code",
  "description",
  "area",
  "durationMinutes",
  "contactEmail",
  "info",
  "label",
];

const createSpecialtyService = async (data) => {
  return await Speciality.create(data);
};

const listSpecialtiesService = async () => {
  return await Speciality.find();
};

const getSpecialtyByIdService = async (id) => {
  return await Speciality.findById(id);
};

const deleteSpecialtiesService = async (id) => {
  return await Speciality.findByIdAndDelete(id);
};

const updateSpecialtiesService = async (id,data ={}) => {
  const specialty = await Speciality.findById(id);
  if (!specialty) return null;
  for(const field of UPDATABLE_FIELDS){
    if (data[field] !== undefined) specialty.set(field, data[field]);
  }
  return await specialty.save();
};

const deleteByAreaService = async (area) => {
  return Speciality.deleteMany({ area });
};


module.exports = { createSpecialtyService, listSpecialtiesService ,deleteSpecialtiesService, updateSpecialtiesService, getSpecialtyByIdService, deleteByAreaService };

import api from "../api/axios";
import ENDPOINTS from "../api/endpoints";

const getEducation = async () => {
  try {
    const { data } = await api.get(ENDPOINTS.EDUCATION.BASE);
    return data;
  } catch (error) {
    console.error("[educationService] GET error:", error.message);
    throw new Error(error.message);
  }
};

const getEducationById = async (id) => {
  try {
    const { data } = await api.get(ENDPOINTS.EDUCATION.BY_ID(id));
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createEducation = async (educationData) => {
  try {
    const { data } = await api.post(ENDPOINTS.EDUCATION.BASE, educationData);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateEducation = async (id, educationData) => {
  try {
    const { data } = await api.put(ENDPOINTS.EDUCATION.BY_ID(id), educationData);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteEducation = async (id) => {
  try {
    const { data } = await api.delete(ENDPOINTS.EDUCATION.BY_ID(id));
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const educationService = {
  getEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
};

export default educationService;

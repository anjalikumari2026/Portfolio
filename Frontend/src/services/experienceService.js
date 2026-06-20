import api from "../api/axios";
import ENDPOINTS from "../api/endpoints";

const getExperiences = async () => {
  try {
    const { data } = await api.get(ENDPOINTS.EXPERIENCE.BASE);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch experiences");
  }
};

const getExperienceById = async (id) => {
  try {
    const { data } = await api.get(ENDPOINTS.EXPERIENCE.BY_ID(id));
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch experience");
  }
};

const createExperience = async (formData) => {
  try {
    const isFormData = formData instanceof FormData;
    const { data } = await api.post(ENDPOINTS.EXPERIENCE.BASE, formData, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create experience");
  }
};

const updateExperience = async (id, formData) => {
  try {
    const isFormData = formData instanceof FormData;
    const { data } = await api.put(ENDPOINTS.EXPERIENCE.BY_ID(id), formData, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update experience");
  }
};

const deleteExperience = async (id) => {
  try {
    const { data } = await api.delete(ENDPOINTS.EXPERIENCE.BY_ID(id));
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete experience");
  }
};

const experienceService = {
  getExperiences, getExperienceById,
  createExperience, updateExperience, deleteExperience,
};
export default experienceService;

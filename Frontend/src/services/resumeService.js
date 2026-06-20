import api from "../api/axios";
import ENDPOINTS from "../api/endpoints";

const getResume = async () => {
  try {
    const { data } = await api.get(ENDPOINTS.RESUME.GET);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch resume");
  }
};

const uploadResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append("resume", file);
    const { data } = await api.put(ENDPOINTS.RESUME.UPLOAD, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to upload resume");
  }
};

const deleteResume = async () => {
  try {
    const { data } = await api.delete(ENDPOINTS.RESUME.DELETE);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete resume");
  }
};

const resumeService = { getResume, uploadResume, deleteResume };
export default resumeService;

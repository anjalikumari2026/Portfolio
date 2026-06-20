import api from "../api/axios";
import ENDPOINTS from "../api/endpoints";

// ── projectService ────────────────────────────────────────────────────

// GET /projects  →  { projects }
const getProjects = async () => {
  try {
    const { data } = await api.get(ENDPOINTS.PROJECTS.BASE);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// GET /projects/:id  →  { project }
const getProjectById = async (id) => {
  try {
    const { data } = await api.get(ENDPOINTS.PROJECTS.BY_ID(id));
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// POST /projects  →  { project }
// Accepts FormData (thumbnail upload) or plain object
const createProject = async (projectData) => {
  try {
    const isFormData = projectData instanceof FormData;
    const { data } = await api.post(ENDPOINTS.PROJECTS.BASE, projectData, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// PUT /projects/:id  →  { project }
const updateProject = async (id, projectData) => {
  try {
    const isFormData = projectData instanceof FormData;
    const { data } = await api.put(ENDPOINTS.PROJECTS.BY_ID(id), projectData, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// DELETE /projects/:id  →  { message }
const deleteProject = async (id) => {
  try {
    const { data } = await api.delete(ENDPOINTS.PROJECTS.BY_ID(id));
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const projectService = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
export default projectService;

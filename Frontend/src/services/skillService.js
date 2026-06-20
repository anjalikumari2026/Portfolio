import api from "../api/axios";
import ENDPOINTS from "../api/endpoints";

// ── skillService ──────────────────────────────────────────────────────

// GET /skills  →  { skills }
const getSkills = async () => {
  try {
    const { data } = await api.get(ENDPOINTS.SKILLS.BASE);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// POST /skills  →  { skill }
const createSkill = async (skillData) => {
  try {
    const { data } = await api.post(ENDPOINTS.SKILLS.BASE, skillData);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// PUT /skills/:id  →  { skill }
const updateSkill = async (id, skillData) => {
  try {
    const { data } = await api.put(ENDPOINTS.SKILLS.BY_ID(id), skillData);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// DELETE /skills/:id  →  { message }
const deleteSkill = async (id) => {
  try {
    const { data } = await api.delete(ENDPOINTS.SKILLS.BY_ID(id));
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const skillService = { getSkills, createSkill, updateSkill, deleteSkill };
export default skillService;

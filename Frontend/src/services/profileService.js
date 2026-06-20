import api from "../api/axios";
import ENDPOINTS from "../api/endpoints";

const getProfile = async () => {
  try {
    const { data } = await api.get(ENDPOINTS.PROFILE.GET);
    console.log("[profileService] GET /profile response:", data);
    return data;
  } catch (error) {
    console.error("[profileService] GET /profile error:", error.message);
    throw new Error(error.message);
  }
};

const createProfile = async (profileData) => {
  try {
    const isFormData = profileData instanceof FormData;
    const { data } = await api.post(ENDPOINTS.PROFILE.CREATE, profileData, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    console.log("[profileService] POST /profile response:", data);
    return data;
  } catch (error) {
    console.error("[profileService] POST /profile error:", error.message);
    throw new Error(error.message);
  }
};

const updateProfile = async (profileData) => {
  try {
    const isFormData = profileData instanceof FormData;
    console.log("[profileService] PUT /profile payload:", profileData);
    const { data } = await api.put(ENDPOINTS.PROFILE.UPDATE, profileData, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    console.log("[profileService] PUT /profile response:", data);
    return data;
  } catch (error) {
    console.error("[profileService] PUT /profile error:", error.message);
    throw new Error(error.message);
  }
};

const uploadProfileImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("profileImage", file);
    console.log("[profileService] Uploading profile image:", file.name);
    const { data } = await api.put(ENDPOINTS.PROFILE.IMAGE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("[profileService] Upload response:", data);
    return data;
  } catch (error) {
    console.error("[profileService] Upload error:", error.message);
    throw new Error(error.message);
  }
};

const deleteProfileImage = async () => {
  try {
    const { data } = await api.delete(ENDPOINTS.PROFILE.IMAGE);
    console.log("[profileService] DELETE /profile/image response:", data);
    return data;
  } catch (error) {
    console.error("[profileService] DELETE /profile/image error:", error.message);
    throw new Error(error.message);
  }
};

const profileService = { getProfile, createProfile, updateProfile, uploadProfileImage, deleteProfileImage };
export default profileService;

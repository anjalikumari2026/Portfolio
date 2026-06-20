import api from "../api/axios";
import ENDPOINTS from "../api/endpoints";

const getCertificates = async () => {
  try {
    const { data } = await api.get(ENDPOINTS.CERTIFICATES.BASE);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getCertificateById = async (id) => {
  try {
    const { data } = await api.get(ENDPOINTS.CERTIFICATES.BY_ID(id));
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createCertificate = async (certData) => {
  try {
    const isFormData = certData instanceof FormData;
    const { data } = await api.post(ENDPOINTS.CERTIFICATES.BASE, certData, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateCertificate = async (id, certData) => {
  try {
    const isFormData = certData instanceof FormData;
    const { data } = await api.put(ENDPOINTS.CERTIFICATES.BY_ID(id), certData, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteCertificate = async (id) => {
  try {
    const { data } = await api.delete(ENDPOINTS.CERTIFICATES.BY_ID(id));
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const certificateService = {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};

export default certificateService;

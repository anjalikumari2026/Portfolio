import api from "../api/axios";
import ENDPOINTS from "../api/endpoints";

const sendMessage = async (formData) => {
  try {
    const { data } = await api.post(ENDPOINTS.CONTACT.SEND, formData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to send message");
  }
};

const getMessages = async (params = {}) => {
  try {
    const { data } = await api.get(ENDPOINTS.CONTACT.LIST, { params });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to load messages");
  }
};

const deleteMessage = async (id) => {
  try {
    const { data } = await api.delete(ENDPOINTS.CONTACT.BY_ID(id));
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete message");
  }
};

const markAsRead = async (id) => {
  try {
    const { data } = await api.patch(ENDPOINTS.CONTACT.MARK_READ(id), { read: true });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update message");
  }
};

const markAsUnread = async (id) => {
  try {
    const { data } = await api.patch(ENDPOINTS.CONTACT.MARK_READ(id), { read: false });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update message");
  }
};

const getUnreadCount = async () => {
  try {
    const { data } = await api.get(ENDPOINTS.CONTACT.UNREAD_COUNT);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to get unread count");
  }
};

const contactService = {
  sendMessage, getMessages, markAsRead, markAsUnread, deleteMessage, getUnreadCount,
};
export default contactService;

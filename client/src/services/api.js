import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// The server root (without /api) - used to resolve uploaded file paths
// like "/uploads/avatars/xyz.png" into a full, loadable URL.
export const SERVER_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

// Turns a relative path returned by the backend (e.g. "/uploads/avatars/x.png")
// into a full URL. Leaves already-absolute URLs (http://...) untouched.
export function resolveAssetUrl(pathOrUrl) {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SERVER_ORIGIN}${pathOrUrl}`;
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the JWT (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, the backend returns 401.
// Clear it so the app doesn't get stuck in a broken "logged in" state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

// ================= Auth =================
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");
export const updateMe = (data) => api.put("/auth/me", data);

export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  return api.post("/auth/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const changePassword = (data) => api.put("/auth/change-password", data);
export const forgotPassword = (email) => api.post("/auth/forgot-password", { email });
export const resetPassword = (token, newPassword) =>
  api.put(`/auth/reset-password/${token}`, { newPassword });

// ================= Tasks =================
export const getTasks = (params) => api.get("/tasks", { params });
export const getTaskStats = () => api.get("/tasks/stats");
export const getProductivityStats = () => api.get("/tasks/stats/productivity");
export const getAnalyticsStats = () => api.get("/tasks/stats/analytics");
export const getActivityHistory = (params) => api.get("/tasks/history", { params });

// ================= Push Notifications =================
export const getVapidPublicKey = () => api.get("/push/vapid-public-key");
export const subscribeToPush = (subscription) => api.post("/push/subscribe", subscription);
export const unsubscribeFromPush = (endpoint) => api.post("/push/unsubscribe", { endpoint });
export const getTaskById = (id) => api.get(`/tasks/${id}`);
export const createTask = (data) => api.post("/tasks", data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// ================= Groups =================
export const getGroups = () => api.get("/groups");
export const createGroup = (data) => api.post("/groups", data);
export const getGroup = (id) => api.get(`/groups/${id}`);
export const updateGroup = (id, data) => api.put(`/groups/${id}`, data);
export const deleteGroup = (id) => api.delete(`/groups/${id}`);

export const addGroupMember = (id, email) =>
  api.post(`/groups/${id}/members`, { email });
export const removeGroupMember = (id, userId) =>
  api.delete(`/groups/${id}/members/${userId}`);
export const updateGroupMemberRole = (id, userId, role) =>
  api.put(`/groups/${id}/members/${userId}`, { role });

export const getGroupTasks = (id, params) =>
  api.get(`/groups/${id}/tasks`, { params });
export const createGroupTask = (id, data) =>
  api.post(`/groups/${id}/tasks`, data);
export const updateGroupTask = (id, taskId, data) =>
  api.put(`/groups/${id}/tasks/${taskId}`, data);
export const deleteGroupTask = (id, taskId) =>
  api.delete(`/groups/${id}/tasks/${taskId}`);

// ================= Group chat =================
export const getGroupMessages = (id, params) =>
  api.get(`/groups/${id}/messages`, { params });
// `formData` holds: text, task (optional), duration (voice notes), media (file)
export const sendGroupMessage = (id, formData, onUploadProgress) =>
  api.post(`/groups/${id}/messages`, formData, { onUploadProgress });
export const deleteGroupMessage = (id, messageId) =>
  api.delete(`/groups/${id}/messages/${messageId}`);

// ================= Private (1-to-1) chat =================
export const getDmMessages = (userId, params) =>
  api.get(`/dm/${userId}/messages`, { params });
export const sendDmMessage = (userId, formData, onUploadProgress) =>
  api.post(`/dm/${userId}/messages`, formData, { onUploadProgress });
export const deleteDmMessage = (userId, messageId) =>
  api.delete(`/dm/${userId}/messages/${messageId}`);
export const markDmRead = (userId) => api.post(`/dm/${userId}/read`);
export const getDmUnread = () => api.get("/dm/unread");

export default api;

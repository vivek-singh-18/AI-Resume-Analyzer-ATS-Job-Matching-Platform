import { request } from "./api";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const getDocs = async () => {
  const res = await request({
    method: "GET",
    url: `${API_URL}/api/docs`,
  });
  return res.docs;
};

export const getDoc = async (doc) => {
  const res = await request({
    method: "GET",
    url: `${API_URL}/api/docs/${doc._id}/preview`,
  });
  return res;
};

export const analyzeDoc = async (doc) => {
  const res = await request({
    method: "POST",
    url: `${API_URL}/api/docs/${doc._id}/analyze`,
  });
  return res;
};

export const downloadDoc = async (doc) => {
  try {
    const res = await request({
      method: "get",
      url: `/docs/${doc._id}/download`,
      responseType: "blob",
    });

    const blob = new Blob([res], {
      type: res.type || "application/octet-stream",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.originalName || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (err) {
    console.error("Download failed:", err);
    return {
      success: false,
      message: err.response?.data?.error || err.message || "Download failed",
    };
  }
};

export const deleteDoc = async (doc) => {
  const res = await request({
    method: "DELETE",
    url: `${API_URL}/api/docs/${doc._id}`,
  });
  return res;
};

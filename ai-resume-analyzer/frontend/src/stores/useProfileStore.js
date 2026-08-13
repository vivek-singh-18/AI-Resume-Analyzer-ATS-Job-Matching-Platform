import { create } from "zustand";
import { getProfile, updateProfile } from "@/utils/profile";
import { toast } from "sonner";

const userFromStorage =
  JSON.parse(localStorage.getItem("auth-storage"))?.user || null;

const useProfileStore = create((set, get) => ({
  user: userFromStorage,
  activeProvider: userFromStorage?.preferredAI || "openai",
  apiKey: userFromStorage?.aiKeys?.[userFromStorage?.preferredAI] || "",
  isLoading: false,

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      // Use stored user if exists, otherwise fetch from API
      const user = get().user || (await getProfile());
      const provider = user.preferredAI || "openai";
      const apiKey = user.aiKeys?.[provider] || "";

      set({
        user,
        activeProvider: provider,
        apiKey,
        isLoading: false,
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      toast.error("Unable to load profile");
      set({ isLoading: false });
    }
  },

  setApiKey: async (provider, key) => {
    try {
      const updated = await updateProfile({
        preferredAI: provider,
        aiKeys: { [provider]: key },
      });
      set({
        activeProvider: provider,
        apiKey: key,
        user: updated,
      });
      toast.success("API key saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save API key");
    }
  },

  clearApiKey: async () => {
    try {
      const updated = await updateProfile({
        preferredAI: "openai",
        aiKeys: { openai: "", anthropic: "", gemini: "" },
      });
      set({
        user: updated,
        apiKey: "",
        activeProvider: "openai",
      });
      toast.success("API key removed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove API key");
    }
  },
}));

export default useProfileStore;

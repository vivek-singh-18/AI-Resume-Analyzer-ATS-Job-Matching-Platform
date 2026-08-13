import { create } from "zustand";

const useFileStore = create((set) => ({
  files: [],
  isDragging: false,

  addFiles: (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file: file,
      name: file.name,
      size: file.size,
      status: "uploading",
      progress: 0,
    }));

    set((state) => ({ files: [...state.files, ...newFiles] }));

    newFiles.forEach((f) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          set((state) => ({
            files: state.files.map((file) =>
              file.id === f.id
                ? { ...file, status: "completed", progress: 100 }
                : file
            ),
          }));
        } else {
          set((state) => ({
            files: state.files.map((file) =>
              file.id === f.id
                ? { ...file, progress: Math.min(progress, 100) }
                : file
            ),
          }));
        }
      }, 500);
    });
  },

  removeFile: (fileId) => {
    set((state) => ({
      files: state.files.filter((f) => f.id !== fileId),
    }));
  },

  setDragging: (isDragging) => set({ isDragging }),
}));

export default useFileStore;
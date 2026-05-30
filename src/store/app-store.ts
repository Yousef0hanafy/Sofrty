import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language } from "@/types";

interface AppState {
  language: Language;
  isAdmin: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  setAdmin: (isAdmin: boolean) => void;
  toggleAdmin: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: "ar" as Language,
      isAdmin: false,
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () =>
        set({ language: get().language === "ar" ? "en" : "ar" }),
      setAdmin: (isAdmin) => set({ isAdmin }),
      toggleAdmin: () => set({ isAdmin: !get().isAdmin }),
    }),
    {
      name: "madaq-app-store",
      partialize: (state) => ({ language: state.language }),
    }
  )
);

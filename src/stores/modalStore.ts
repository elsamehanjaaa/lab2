// stores/modalStore.ts
import { create } from "zustand";

type ModalStore = {
  showLogin: boolean;
  showProfile: boolean;
  showSignup: boolean;
  showResetPassword: boolean;
  setShowLogin: (value: boolean) => void;
  setShowProfile: (value: boolean) => void;
  setShowSignup: (value: boolean) => void;
  setShowResetPassword: (value: boolean) => void;
  closeAllModals: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  showLogin: false,
  showProfile: false,
  showSignup: false,
  showResetPassword: false,
  setShowLogin: (value) => set({ showLogin: value }),
  setShowProfile: (value) => set({ showProfile: value }),
  setShowSignup: (value) => set({ showSignup: value }),
  setShowResetPassword: (value) => set({ showResetPassword: value }),
  closeAllModals: () =>
    set({
      showLogin: false,
      showProfile: false,
      showSignup: false,
      showResetPassword: false,
    }),
}));

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 'create' makes the store.
// 'persist' automatically saves the store's data to localStorage,
// so the user stays logged in even after refreshing the page!
const useAuthStore = create(
  persist(
    (set) => ({
      // --- 1. Our State ---
      token: null,  // The JWT token
      user: null,   // The user's profile { id, name, email }

      // --- 2. Our Actions (functions to change the state) ---
      
      // This is called when the user successfully logs in
      login: (token, user) => set({
        token: token,
        user: user,
      }),

      // This is called when the user logs out
      logout: () => set({
        token: null,
        user: null,
      }),
    }),
    {
      // --- 3. Configuration for 'persist' ---
      name: 'auth-storage', // The name of the item in localStorage
    }
  )
);

export default useAuthStore;
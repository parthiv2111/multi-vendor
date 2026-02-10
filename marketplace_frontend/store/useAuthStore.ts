import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";

interface User {
    id: number;
    email: string;
    username: string;
    role: "ADMIN" | "SELLER" | "BUYER";
    is_verified: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, refresh: string) => Promise<void>;
    logout: () => void;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: async (token, refresh) => {
                set({ token, isAuthenticated: true });
                // Fetch user details
                try {
                    const { data } = await api.get('/auth/me/');
                    set({ user: data });
                } catch (error) {
                    console.error("Failed to fetch user", error);
                }
            },
            logout: () => set({ user: null, token: null, isAuthenticated: false }),
            fetchUser: async () => {
                try {
                    const { data } = await api.get('/auth/me/');
                    set({ user: data });
                } catch (error) {
                    set({ user: null, token: null, isAuthenticated: false });
                }
            }
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);

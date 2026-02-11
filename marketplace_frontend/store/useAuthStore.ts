import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "@/lib/api";

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
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    fetchUser: () => Promise<void>;
    initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (email, password) => {
                set({ isLoading: true });
                try {
                    const data = await authAPI.login(email, password);
                    set({
                        token: data.access,
                        refreshToken: data.refresh,
                        isAuthenticated: true,
                        isLoading: false
                    });

                    // Fetch user details
                    try {
                        const userData = await authAPI.getCurrentUser();
                        set({ user: userData });
                    } catch (error) {
                        console.error("Failed to fetch user", error);
                    }

                    return { success: true };
                } catch (error: any) {
                    set({ isLoading: false });
                    const errorMessage = error.response?.data?.detail || "Login failed";
                    return { success: false, error: errorMessage };
                }
            },

            logout: () => set({
                user: null,
                token: null,
                refreshToken: null,
                isAuthenticated: false
            }),

            fetchUser: async () => {
                const { token } = get();
                if (!token) return;

                try {
                    const userData = await authAPI.getCurrentUser();
                    set({ user: userData, isAuthenticated: true });
                } catch (error) {
                    set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
                }
            },

            initializeAuth: async () => {
                const { token, refreshToken } = get();
                if (token) {
                    set({ isLoading: true });
                    await get().fetchUser();
                    set({ isLoading: false });
                }
            }
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                token: state.token,
                refreshToken: state.refreshToken,
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);

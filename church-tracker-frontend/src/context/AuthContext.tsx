import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, clearToken, getToken, setToken } from "../api/client";
import type { User } from "../api/types";

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterPayload {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  leader_role: User["leader_role"];
  demography: User["demography"];
  gender: User["gender"];
  area: User["area"];
  contact_number: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  updateUser: (updated: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On first load, if we already have a token, fetch the profile it belongs to.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get<User>("/auth/me/")
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  async function login(username: string, password: string) {
    const data = await api.post<LoginResponse>("/auth/login/", { username, password });
    setToken(data.token);
    setUser(data.user);
  }

  async function register(payload: RegisterPayload) {
    const data = await api.post<LoginResponse>("/auth/register/", payload);
    setToken(data.token);
    setUser(data.user);
  }

  function updateUser(updated: User) {
    setUser(updated);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

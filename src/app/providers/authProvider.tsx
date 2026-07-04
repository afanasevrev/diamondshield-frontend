import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import { apiClient } from '../../shared/api/apiClient';

interface LoginResponse {
  token?: string;
  accessToken?: string;
  jwt?: string;
  username?: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  username: string | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = 'diamondshield_access_token';
const USERNAME_KEY = 'diamondshield_username';

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );

  const [username, setUsername] = useState<string | null>(() =>
    localStorage.getItem(USERNAME_KEY),
  );

  async function login(nextUsername: string, password: string) {
    const response = await apiClient.post<LoginResponse>(
      '/api/auth/login',
      {
        username: nextUsername,
        password,
      },
      {
        target: 'central',
        auth: false,
      },
    );

    const nextToken = response.token || response.accessToken || response.jwt;

    if (!nextToken) {
      throw new Error('Центральный сервер не вернул JWT token');
    }

    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USERNAME_KEY, response.username || nextUsername);

    setToken(nextToken);
    setUsername(response.username || nextUsername);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);

    setToken(null);
    setUsername(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(token),
      username,
      token,
      login,
      logout,
    }),
    [token, username],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
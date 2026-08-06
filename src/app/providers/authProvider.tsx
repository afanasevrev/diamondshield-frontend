import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
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

export interface CurrentUser {
  id?: string;
  username: string;
  displayName?: string | null;
  roles?: string[];
  permissions?: string[];
}

interface AuthContextValue {
  isAuthenticated: boolean;
  username: string | null;
  token: string | null;
  currentUser: CurrentUser | null;
  permissions: string[];
  loadingProfile: boolean;

  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  reloadProfile: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
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

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(false);

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
    setCurrentUser(null);
    setPermissions([]);
  }

  async function reloadProfile() {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setCurrentUser(null);
      setPermissions([]);
      return;
    }

    try {
      setLoadingProfile(true);

      const profile = await apiClient.get<CurrentUser>('/api/auth/me');

      setCurrentUser(profile);
      setPermissions(profile.permissions || []);

      if (profile.username) {
        setUsername(profile.username);
        localStorage.setItem(USERNAME_KEY, profile.username);
      }
    } finally {
      setLoadingProfile(false);
    }
  }

  function hasPermission(permission: string) {
    if (!permission) {
      return true;
    }

    if (permissions.includes('*')) {
      return true;
    }

    return permissions.includes(permission);
  }

  function hasAnyPermission(nextPermissions: string[]) {
    if (nextPermissions.length === 0) {
      return true;
    }

    if (permissions.includes('*')) {
      return true;
    }

    return nextPermissions.some((permission) => permissions.includes(permission));
  }

  useEffect(() => {
    if (token) {
      reloadProfile().catch(() => {
        // profile может быть недоступен на раннем backend-этапе.
      });
    }
  }, [token]);

  useEffect(() => {
    function handleUnauthorized() {
      logout();
      window.location.href = '/central/login';
    }

    window.addEventListener('diamondshield:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('diamondshield:unauthorized', handleUnauthorized);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(token),
      username,
      token,
      currentUser,
      permissions,
      loadingProfile,

      login,
      logout,
      reloadProfile,
      hasPermission,
      hasAnyPermission,
    }),
    [token, username, currentUser, permissions, loadingProfile],
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
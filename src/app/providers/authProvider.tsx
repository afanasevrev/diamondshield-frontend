import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

interface AuthContextValue {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => void;
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

  function login(nextUsername: string, _password: string) {
    const fakeToken = `dev-token-${Date.now()}`;

    localStorage.setItem(TOKEN_KEY, fakeToken);
    localStorage.setItem(USERNAME_KEY, nextUsername);

    setToken(fakeToken);
    setUsername(nextUsername);
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
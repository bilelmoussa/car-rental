import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/types/user';
import { getCurrent, login, logout } from '@/api/auth';
import { isTokenExpired } from '@/utils/auth';
import axios from "axios";
import { API_URL } from '@/api/auth';

// Add auth status type
type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  status: AuthStatus;
  refreshAuthToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const clearAuthState = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setStatus('unauthenticated');
  }

  const refreshAuthToken = useCallback(async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken || isTokenExpired(refreshToken)) {
      return false;
    }

    try {
      const response = await axios.get(`${API_URL}auth/refresh`, {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      })

      const { access_token, refresh_token: newRefreshToken } = response.data;

      // Validate new tokens before storing
      if (isTokenExpired(access_token)) {
        throw new Error('Received expired access token');
      }

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', newRefreshToken);
      return true;
    } catch (error) {
      console.error('Token refresh failed: ', error);
      return false;
    }
  }, [clearAuthState]);

  // Used to check the session status with the server
  const checkAuth = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');
    const refreshTokenExpireAt = localStorage.getItem('refreshTokenExpireAt');
    const isRefreshTokenValid = refreshToken && !isTokenExpired(refreshTokenExpireAt);

    if (!accessToken && !refreshToken) {
      clearAuthState();
      setInitialCheckDone(true);
      return;
    }

    if (!isRefreshTokenValid) {
      clearAuthState();
      setInitialCheckDone(true);
      return;
    }

    // If access token is expired or notfound but we have a valid refresh token
    if ((accessToken && isTokenExpired(accessToken)) || !accessToken) {
      const refreshed = await refreshAuthToken();
      if (!refreshed) {
        clearAuthState();
        setInitialCheckDone(true);
        return;
      }
    }

    // GET Current User after checking auth
    try {
      const res = await getCurrent();
      setUser(res.data);
      console.log(res.data)
      setStatus("authenticated");
    } catch (error) {
      console.error('Failed to get user data: ', error);
      setStatus("authenticated");
    } finally {
      setInitialCheckDone(true);
    }
  }, [refreshAuthToken]);

  useEffect(() => {
    if (!initialCheckDone) {
      checkAuth();
    }
  }, [initialCheckDone, checkAuth]);

  // Used to create a session and store the user data in the context
  const signIn = async (email: string, password: string) => {
    const response = await login({ email, password });

    if (!response.data) {
      throw new Error('Failed to sign in');
    }

    const data = response.data;

    if (data) {
      const { access_token, refresh_token, refreshTokenExpireAt } = data;

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('refreshTokenExpireAt', refreshTokenExpireAt)
    }

    checkAuth();

    return data;
  }

  // Used to sign out a user and clear the user data from the context
  const signOut = async () => {
    await logout()
    clearAuthState();
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, status, refreshAuthToken }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to access the auth context from any component
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

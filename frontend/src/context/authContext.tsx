import React, { createContext, useState, ReactNode } from 'react';
import { UserSession, LoginInput } from '../types/userTypes.ts';
import { authService } from '../services/authService.ts';
import { currentUserSession } from '../services/currentUserSession.ts';

interface AuthContextData {
  user: UserSession | null;
  login: (credentials: LoginInput) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const loading = false;

  const login = async (credentials: LoginInput) => {
    const { user: sessionData } = await authService.login(credentials);

    setUser(sessionData);
    currentUserSession.setUserId(sessionData.id);
  };

  const logout = () => {
    currentUserSession.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

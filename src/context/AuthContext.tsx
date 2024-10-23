import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (id: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (id: string, password: string) => {
    if (id === 'Delta0101' && password === 'Admin') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuth', 'true');
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuth');
  };

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuth') === 'true';
    setIsAuthenticated(isAuth);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
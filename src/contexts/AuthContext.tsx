import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, department?: string, jobTitle?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  autoLogin: (userType: 'admin' | 'data-steward' | 'user') => Promise<void>;
  isDevMode: boolean;
}

// Create the auth context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUser: async () => {},
  autoLogin: async () => {},
  isDevMode: process.env.NODE_ENV === 'development'
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isDevMode = process.env.NODE_ENV === 'development';

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      setLoading(true);
      try {
        // Get user data if token exists
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } else if (isDevMode && localStorage.getItem('devAutoLogin')) {
          // Auto login in development mode if flag is set
          const userType = localStorage.getItem('devAutoLogin') as 'admin' | 'data-steward' | 'user';
          await autoLogin(userType);
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        // Clear potentially invalid token
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login({ email, password });
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, department?: string, jobTitle?: string, role: 'user' | 'data-steward' | 'admin' = 'user') => {
    setLoading(true);
    setError(null);
    try {
      await authService.register({ name, email, password, department, jobTitle, role });
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  // Update user function
  const updateUser = async (userData: Partial<User>) => {
    setLoading(true);
    try {
      const updatedUser = await authService.updateUserDetails(userData);
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Auto-login function for development mode only
  const autoLogin = async (userType: 'admin' | 'data-steward' | 'user') => {
    if (!isDevMode) {
      console.warn('Auto-login is only available in development mode');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      let email = 'user@example.com';
      
      // Select the appropriate test user based on userType
      if (userType === 'admin') {
        email = 'admin@example.com';
      } else if (userType === 'data-steward') {
        email = 'steward@example.com';
      }
      
      // Set the password based on user type
      let password = 'password123';
      if (userType === 'admin') {
        password = 'admin123!';
      }
      
      // Perform login
      await authService.login({ email, password });
      const userData = await authService.getCurrentUser();
      setUser(userData);
      
      // Store the auto-login preference in localStorage
      localStorage.setItem('devAutoLogin', userType);
      
      console.info(`[DEV MODE] Auto-logged in as ${userType} user: ${email}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Auto-login failed');
      console.error('[DEV MODE] Auto-login failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        autoLogin,
        isDevMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as authUtils from "@/utils/auth";

interface User {
  id: string;
  username: string;
  last_name?: string;
  first_name?: string;
  email: string;
  bio?: string;
  role: string;
  isTeacher?: boolean;
}

interface Credentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  initialLoading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: () => boolean;
  fetchUser: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    if (!user) {
      setInitialLoading(true);
    }

    try {
      let userData = await authUtils.me();

      if (!userData) {
        const recovered = await authUtils.recoverSession();

        if (recovered) {
          userData = await authUtils.me();
        }
      }

      if (userData) {
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("An error occurred during the fetch user process:", error);
      setUser(null);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials: Credentials) => {
    setLoading(true);
    try {
      await authUtils.login(credentials);

      await fetchUser();
    } catch (error) {
      setUser(null);
      console.error("Login process failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authUtils.logout();
    } catch (error) {
      console.error("Logout process failed:", error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const isLoggedIn = (): boolean => !!user;
  const updateProfile = async (data: any) => {
    setLoading(true);
    try {
      const res = await authUtils.updateProfile(data);
      setUser(res);
      isLoggedIn();
      setLoading(false);
    } catch (error) {
      console.error("Logout process failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    loading,
    initialLoading,
    login,
    logout,
    isLoggedIn,
    fetchUser,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// 6. Create a custom hook to easily consume the Auth Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

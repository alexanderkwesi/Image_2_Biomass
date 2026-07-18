// app/contexts/AuthContext.js
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Storage, StorageKeys } from '../utils/storage'; // Updated import path
import { useNavigate } from "react-router-dom";

// Create the Auth Context
const AuthContext = createContext({});

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load user from storage on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const storedUser = Storage.getItem(StorageKeys.USER);
        const storedToken = Storage.getItem(StorageKeys.AUTH_TOKEN);

        if (storedUser && storedToken) {
          // Validate token if needed (optional)
          // const isValid = await validateToken(storedToken);
          // if (isValid) {
          setUser(storedUser);
          // } else {
          //   // Clear invalid credentials
          //   Storage.removeItem(StorageKeys.USER);
          //   Storage.removeItem(StorageKeys.AUTH_TOKEN);
          // }
        }
      } catch (err) {
        console.error("Failed to load user from storage:", err);
        setError(err.message);
        // Clear potentially corrupted data
        Storage.removeItem(StorageKeys.USER);
        Storage.removeItem(StorageKeys.AUTH_TOKEN);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Listen for storage changes across tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (
        event.key === StorageKeys.USER ||
        event.key === StorageKeys.AUTH_TOKEN
      ) {
        if (event.newValue === null) {
          // User logged out in another tab
          setUser(null);
          navigate("/auth", { replace: true });
        } else {
          // User logged in or updated in another tab
          const newUser = Storage.getItem(StorageKeys.USER);
          if (newUser) {
            setUser(newUser);
          }
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  // Login function with enhanced error handling
  const login = useCallback(
    async (userData, token = null, rememberMe = false) => {
      try {
        setIsLoading(true);
        setError(null);

        // Store user data
        Storage.setItem(StorageKeys.USER, userData);

        // Store token if provided
        if (token) {
          Storage.setItem(StorageKeys.AUTH_TOKEN, token);
        }

        // Handle remember me option
        if (rememberMe) {
          Storage.setItem(StorageKeys.REMEMBER_ME, true);
        } else {
          Storage.removeItem(StorageKeys.REMEMBER_ME);
        }

        setUser(userData);

        // Dispatch custom event for other parts of the app
        window.dispatchEvent(
          new CustomEvent("authChange", {
            detail: { user: userData, isLoggedIn: true },
          })
        );

        return { success: true, user: userData };
      } catch (err) {
        console.error("Login failed:", err);
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Logout function
  const logout = useCallback(() => {
    try {
      // Clear all auth-related storage
      Storage.removeItem(StorageKeys.USER);
      Storage.removeItem(StorageKeys.AUTH_TOKEN);

      // Only clear remember me if not set
      const rememberMe = Storage.getItem(StorageKeys.REMEMBER_ME);
      if (!rememberMe) {
        Storage.removeItem(StorageKeys.REMEMBER_ME);
      }

      setUser(null);
      setError(null);

      // Dispatch custom event
      window.dispatchEvent(
        new CustomEvent("authChange", {
          detail: { user: null, isLoggedIn: false },
        })
      );

      // Navigate to auth page
      navigate("/auth", { replace: true });

      return { success: true };
    } catch (err) {
      console.error("Logout failed:", err);
      return { success: false, error: err.message };
    }
  }, [navigate]);

  // Update user data
  const updateUser = useCallback(
    (updatedData) => {
      try {
        const updatedUser = { ...user, ...updatedData };
        Storage.setItem(StorageKeys.USER, updatedUser);
        setUser(updatedUser);

        // Dispatch custom event
        window.dispatchEvent(
          new CustomEvent("userUpdated", {
            detail: { user: updatedUser },
          })
        );

        return { success: true, user: updatedUser };
      } catch (err) {
        console.error("Failed to update user:", err);
        return { success: false, error: err.message };
      }
    },
    [user]
  );

  // Check if user is authenticated
  const isAuthenticated = !!user && !!Storage.getItem(StorageKeys.AUTH_TOKEN);

  // Get user permissions (extend as needed)
  const hasPermission = useCallback(
    (permission) => {
      if (!user || !user.permissions) return false;
      return user.permissions.includes(permission);
    },
    [user]
  );

  // Get user role
  const getRole = useCallback(() => {
    return user?.role || null;
  }, [user]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh user data (for session refresh or data sync)
  const refreshUser = useCallback(async () => {
    try {
      const storedUser = Storage.getItem(StorageKeys.USER);
      if (storedUser) {
        setUser(storedUser);
      }
      return { success: true };
    } catch (err) {
      console.error("Failed to refresh user:", err);
      return { success: false, error: err.message };
    }
  }, []);

  // Value to be provided by context
  const value = {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    updateUser,
    refreshUser,
    hasPermission,
    getRole,
    clearError,
  };

  // Show loading state while initializing
  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
        <p>Loading authentication...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Optional: Higher Order Component for protected routes
export const withAuth = (Component) => {
  return function WithAuthComponent(props) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="auth-loading">
          <div className="loading-spinner"></div>
          <p>Verifying authentication...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />;
    }

    return <Component {...props} />;
  };
};

// Optional: Hook for automatic redirect on auth state change
export const useAuthRedirect = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);
};

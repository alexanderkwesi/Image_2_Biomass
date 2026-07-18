// app/contexts/ThemeContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery"; // Custom hook for media queries

// Define theme types
export type ThemeType = "light" | "dark" | "green" | "blue" | "purple" | "system";

// System theme detection
export type SystemTheme = "light" | "dark";

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  accent: string;
  error: string;
  warning: string;
  success: string;
  info: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  textLight: string;
  border: string;
  divider: string;
  overlay: string;
  shadow: string;
  hover: string;
  active: string;
}

// Define available themes as constants
export const THEMES = {
  LIGHT: "light" as ThemeType,
  DARK: "dark" as ThemeType,
  GREEN: "green" as ThemeType,
  BLUE: "blue" as ThemeType,
  PURPLE: "purple" as ThemeType,
  SYSTEM: "system" as ThemeType,
} as const;

// Type-safe theme colors with extended palette
export const THEME_COLORS: Record<Exclude<ThemeType, "system">, ThemeColors> = {
  light: {
    primary: "#4CAF50",
    primaryLight: "rgba(76, 175, 80, 0.1)",
    primaryDark: "#388E3C",
    secondary: "#FF9800",
    secondaryLight: "rgba(255, 152, 0, 0.1)",
    secondaryDark: "#F57C00",
    accent: "#2196F3",
    error: "#f44336",
    warning: "#ff9800",
    success: "#4caf50",
    info: "#2196f3",
    background: "#f8f9fa",
    surface: "#FFFFFF",
    surfaceVariant: "#f5f5f5",
    textPrimary: "#333333",
    textSecondary: "#666666",
    textDisabled: "#9E9E9E",
    textLight: "#FFFFFF",
    border: "#E0E0E0",
    divider: "#EEEEEE",
    overlay: "rgba(0, 0, 0, 0.5)",
    shadow: "rgba(0, 0, 0, 0.1)",
    hover: "rgba(0, 0, 0, 0.05)",
    active: "rgba(0, 0, 0, 0.1)",
  },
  dark: {
    primary: "#66BB6A",
    primaryLight: "rgba(102, 187, 106, 0.2)",
    primaryDark: "#388E3C",
    secondary: "#FFB74D",
    secondaryLight: "rgba(255, 183, 77, 0.2)",
    secondaryDark: "#F57C00",
    accent: "#64B5F6",
    error: "#EF5350",
    warning: "#ffb74d",
    success: "#66bb6a",
    info: "#64b5f6",
    background: "#121212",
    surface: "#1E1E1E",
    surfaceVariant: "#2D2D2D",
    textPrimary: "#FFFFFF",
    textSecondary: "#B0B0B0",
    textDisabled: "#666666",
    textLight: "#FFFFFF",
    border: "#404040",
    divider: "#2D2D2D",
    overlay: "rgba(0, 0, 0, 0.7)",
    shadow: "rgba(0, 0, 0, 0.3)",
    hover: "rgba(255, 255, 255, 0.05)",
    active: "rgba(255, 255, 255, 0.1)",
  },
  green: {
    primary: "#2E7D32",
    primaryLight: "rgba(46, 125, 50, 0.1)",
    primaryDark: "#1B5E20",
    secondary: "#558B2F",
    secondaryLight: "rgba(85, 139, 47, 0.1)",
    secondaryDark: "#33691E",
    accent: "#689F38",
    error: "#C62828",
    warning: "#ef6c00",
    success: "#2e7d32",
    info: "#1565c0",
    background: "#F1F8E9",
    surface: "#FFFFFF",
    surfaceVariant: "#E8F5E9",
    textPrimary: "#1B5E20",
    textSecondary: "#388E3C",
    textDisabled: "#81C784",
    textLight: "#FFFFFF",
    border: "#C8E6C9",
    divider: "#E8F5E9",
    overlay: "rgba(27, 94, 32, 0.5)",
    shadow: "rgba(46, 125, 50, 0.1)",
    hover: "rgba(46, 125, 50, 0.05)",
    active: "rgba(46, 125, 50, 0.1)",
  },
  blue: {
    primary: "#1565C0",
    primaryLight: "rgba(21, 101, 192, 0.1)",
    primaryDark: "#0D47A1",
    secondary: "#0277BD",
    secondaryLight: "rgba(2, 119, 189, 0.1)",
    secondaryDark: "#01579B",
    accent: "#0288D1",
    error: "#D32F2F",
    warning: "#ff8f00",
    success: "#2e7d32",
    info: "#1565c0",
    background: "#E3F2FD",
    surface: "#FFFFFF",
    surfaceVariant: "#F5F7FF",
    textPrimary: "#0D47A1",
    textSecondary: "#1976D2",
    textDisabled: "#64B5F6",
    textLight: "#FFFFFF",
    border: "#BBDEFB",
    divider: "#E3F2FD",
    overlay: "rgba(13, 71, 161, 0.5)",
    shadow: "rgba(21, 101, 192, 0.1)",
    hover: "rgba(21, 101, 192, 0.05)",
    active: "rgba(21, 101, 192, 0.1)",
  },
  purple: {
    primary: "#7B1FA2",
    primaryLight: "rgba(123, 31, 162, 0.1)",
    primaryDark: "#4A148C",
    secondary: "#AB47BC",
    secondaryLight: "rgba(171, 71, 188, 0.1)",
    secondaryDark: "#8E24AA",
    accent: "#BA68C8",
    error: "#C2185B",
    warning: "#ff8f00",
    success: "#2e7d32",
    info: "#7b1fa2",
    background: "#F3E5F5",
    surface: "#FFFFFF",
    surfaceVariant: "#EDE7F6",
    textPrimary: "#4A148C",
    textSecondary: "#7B1FA2",
    textDisabled: "#CE93D8",
    textLight: "#FFFFFF",
    border: "#E1BEE7",
    divider: "#F3E5F5",
    overlay: "rgba(74, 20, 140, 0.5)",
    shadow: "rgba(123, 31, 162, 0.1)",
    hover: "rgba(123, 31, 162, 0.05)",
    active: "rgba(123, 31, 162, 0.1)",
  },
};

// Storage keys for browser localStorage
export const STORAGE_KEYS = {
  THEME: "app_theme",
  THEME_PREFERENCE: "app_theme_preference", // 'system' or specific theme
} as const;

// Enhanced Browser Storage utility with TypeScript and better error handling
export const ThemeStorage = {
  // Theme storage
  getThemePreference: (): ThemeType => {
    try {
      if (typeof window === "undefined") return THEMES.LIGHT;
      const preference = localStorage.getItem(STORAGE_KEYS.THEME_PREFERENCE);
      if (preference && Object.values(THEMES).includes(preference as ThemeType)) {
        return preference as ThemeType;
      }
      return THEMES.SYSTEM; // Default to system theme
    } catch (error) {
      console.error("Error reading theme preference from localStorage:", error);
      return THEMES.LIGHT;
    }
  },

  setThemePreference: (theme: ThemeType): boolean => {
    try {
      if (typeof window === "undefined") return false;
      localStorage.setItem(STORAGE_KEYS.THEME_PREFERENCE, theme);
      return true;
    } catch (error) {
      console.error("Error saving theme preference to localStorage:", error);
      return false;
    }
  },

  // Fallback for backward compatibility
  getTheme: (): Exclude<ThemeType, "system"> => {
    const preference = ThemeStorage.getThemePreference();
    if (preference !== THEMES.SYSTEM) {
      return preference as Exclude<ThemeType, "system">;
    }
    return THEMES.LIGHT;
  },

  // Check if localStorage is available
  isAvailable: (): boolean => {
    try {
      if (typeof window === "undefined") return false;
      const test = "test";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
};

// Interface for theme context
export interface ThemeContextType {
  // Theme state
  currentTheme: ThemeType;
  appliedTheme: Exclude<ThemeType, "system">;
  systemTheme: SystemTheme;
  themeColors: ThemeColors;
  
  // Theme methods
  setTheme: (theme: ThemeType) => boolean;
  toggleTheme: () => void;
  resetTheme: () => void;
  
  // Theme info
  availableThemes: ThemeType[];
  themePreference: ThemeType;
  isLoading: boolean;
  
  // Helper methods
  getColor: (colorName: keyof ThemeColors) => string;
  getCSSVariables: () => Record<string, string>;
  
  // Storage utility
  storage: typeof ThemeStorage;
}

// Create context with default values
export const ThemeContext = createContext<ThemeContextType>({
  currentTheme: THEMES.LIGHT,
  appliedTheme: THEMES.LIGHT,
  systemTheme: "light",
  themeColors: THEME_COLORS[THEMES.LIGHT],
  setTheme: () => false,
  toggleTheme: () => {},
  resetTheme: () => {},
  availableThemes: Object.values(THEMES),
  themePreference: THEMES.SYSTEM,
  isLoading: true,
  getColor: () => "",
  getCSSVariables: () => ({}),
  storage: ThemeStorage,
});

// Custom hook for using theme context
export const useTheme = (): ThemeContextType => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeType;
  onThemeChange?: (theme: ThemeType) => void;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = THEMES.SYSTEM,
  onThemeChange 
}) => {
  const [themePreference, setThemePreference] = useState<ThemeType>(defaultTheme);
  const [appliedTheme, setAppliedTheme] = useState<Exclude<ThemeType, "system">>(THEMES.LIGHT);
  const [systemTheme, setSystemTheme] = useState<SystemTheme>("light");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Detect system theme changes
  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  // Update system theme when media query changes
  useEffect(() => {
    const newSystemTheme = systemPrefersDark ? "dark" : "light";
    setSystemTheme(newSystemTheme);
  }, [systemPrefersDark]);

  // Determine which theme to apply based on preference
  const determineAppliedTheme = useCallback((preference: ThemeType): Exclude<ThemeType, "system"> => {
    if (preference === THEMES.SYSTEM) {
      return systemTheme === "dark" ? THEMES.DARK : THEMES.LIGHT;
    }
    return preference as Exclude<ThemeType, "system">;
  }, [systemTheme]);

  // Initialize theme on component mount
  useEffect(() => {
    const initializeTheme = () => {
      try {
        // Load theme preference from storage
        const storedPreference = ThemeStorage.getThemePreference();
        const preference = storedPreference || defaultTheme;
        
        setThemePreference(preference);
        
        // Determine which theme to apply
        const themeToApply = determineAppliedTheme(preference);
        setAppliedTheme(themeToApply);
        
        // Apply theme to document
        applyThemeToDocument(themeToApply);
        
        setIsLoading(false);
        
        // Notify parent component if callback provided
        if (onThemeChange) {
          onThemeChange(preference);
        }
      } catch (error) {
        console.error("Error initializing theme:", error);
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, [defaultTheme, determineAppliedTheme, onThemeChange]);

  // Update applied theme when preference or system theme changes
  useEffect(() => {
    const newAppliedTheme = determineAppliedTheme(themePreference);
    if (newAppliedTheme !== appliedTheme) {
      setAppliedTheme(newAppliedTheme);
      applyThemeToDocument(newAppliedTheme);
      
      // Notify parent component if callback provided
      if (onThemeChange) {
        onThemeChange(themePreference);
      }
    }
  }, [themePreference, systemTheme, appliedTheme, determineAppliedTheme, onThemeChange]);

  // Set theme preference
  const setTheme = useCallback((theme: ThemeType): boolean => {
    try {
      if (!Object.values(THEMES).includes(theme)) {
        console.error(`Invalid theme: ${theme}`);
        return false;
      }
      
      const success = ThemeStorage.setThemePreference(theme);
      if (success) {
        setThemePreference(theme);
        
        // Determine and apply the actual theme
        const themeToApply = determineAppliedTheme(theme);
        setAppliedTheme(themeToApply);
        applyThemeToDocument(themeToApply);
        
        // Dispatch custom event for other parts of the app
        window.dispatchEvent(new CustomEvent('themeChanged', {
          detail: { 
            themePreference: theme,
            appliedTheme: themeToApply,
            systemTheme 
          }
        }));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error setting theme:", error);
      return false;
    }
  }, [determineAppliedTheme, systemTheme]);

  // Toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    if (themePreference === THEMES.SYSTEM) {
      // If using system, switch to opposite of current system theme
      const newTheme = systemTheme === "dark" ? THEMES.LIGHT : THEMES.DARK;
      setTheme(newTheme);
    } else if (themePreference === THEMES.LIGHT) {
      setTheme(THEMES.DARK);
    } else if (themePreference === THEMES.DARK) {
      setTheme(THEMES.LIGHT);
    } else {
      // For other themes, toggle between light/dark
      setTheme(appliedTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK);
    }
  }, [themePreference, appliedTheme, systemTheme, setTheme]);

  // Reset to system theme
  const resetTheme = useCallback(() => {
    setTheme(THEMES.SYSTEM);
  }, [setTheme]);

  // Get specific color value
  const getColor = useCallback((colorName: keyof ThemeColors): string => {
    return THEME_COLORS[appliedTheme][colorName];
  }, [appliedTheme]);

  // Get CSS variables object
  const getCSSVariables = useCallback((): Record<string, string> => {
    const colors = THEME_COLORS[appliedTheme];
    const cssVars: Record<string, string> = {};
    
    Object.entries(colors).forEach(([key, value]) => {
      const cssVarName = `--color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      cssVars[cssVarName] = value;
    });
    
    return cssVars;
  }, [appliedTheme]);

  // Get current theme colors
  const themeColors = THEME_COLORS[appliedTheme];

  const contextValue: ThemeContextType = {
    currentTheme: themePreference,
    appliedTheme,
    systemTheme,
    themeColors,
    setTheme,
    toggleTheme,
    resetTheme,
    availableThemes: Object.values(THEMES),
    themePreference,
    isLoading,
    getColor,
    getCSSVariables,
    storage: ThemeStorage,
  };

  // Show loading state while initializing
  if (isLoading) {
    return (
      <div className="theme-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// CSS Variables setup for theme application
export const applyThemeToDocument = (theme: Exclude<ThemeType, "system">): void => {
  if (typeof document === "undefined") return;
  
  const colors = THEME_COLORS[theme];
  const root = document.documentElement;
  
  // Set CSS variables for each color
  Object.entries(colors).forEach(([key, value]) => {
    const cssVarName = `--color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    root.style.setProperty(cssVarName, value);
  });
  
  // Set theme attribute for CSS selectors
  root.setAttribute("data-theme", theme);
  
  // Set meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', colors.primary);
  }
};

// Custom hook for media queries (create this file if needed)
// app/hooks/useMediaQuery.ts
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } 
    // Legacy browsers
    else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
};

// Initialize theme on app startup (server-side safe)
if (typeof window !== "undefined") {
  const initialTheme = ThemeStorage.getTheme();
  applyThemeToDocument(initialTheme);
}

// CSS for loading state
const themeLoadingStyles = `
.theme-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: var(--color-background, #f8f9fa);
}

.theme-loading .loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid var(--color-primary, #4CAF50);
  width: 40px;
  height: 40px;
  animation: theme-spin 1s linear infinite;
}

@keyframes theme-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Add styles to document if not already present
if (typeof document !== "undefined") {
  if (!document.querySelector('#theme-context-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'theme-context-styles';
    styleElement.textContent = themeLoadingStyles;
    document.head.appendChild(styleElement);
  }
}
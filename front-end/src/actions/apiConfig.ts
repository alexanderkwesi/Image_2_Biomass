// apiConfig.ts
// Centralized API configuration for React Web application

/**
 * Environment types
 */
export type EnvironmentType = "development" | "staging" | "production";

/**
 * Environment configurations
 */
const ENVIRONMENTS: Record<EnvironmentType, EnvironmentConfig> = {
  development: {
    apiBaseUrl: process.env.REACT_APP_API_URL || "http://localhost:3080",
    apiTimeout: 15000, // 15 seconds
    debugMode: true,
    enableLogging: true,
    enableMocking: process.env.REACT_APP_ENABLE_MOCK_API === "true",
  },
  staging: {
    apiBaseUrl: process.env.REACT_APP_API_URL || "http://localhost:3080",
    apiTimeout: 20000, // 20 seconds
    debugMode: true,
    enableLogging: true,
    enableMocking: false,
  },
  production: {
    apiBaseUrl: process.env.REACT_APP_API_URL || "http://localhost:3080",
    apiTimeout: 30000, // 30 seconds
    debugMode: false,
    enableLogging: false,
    enableMocking: false,
  },
} as const;

/**
 * Environment configuration interface
 */
export interface EnvironmentConfig {
  apiBaseUrl: string;
  apiTimeout: number;
  debugMode: boolean;
  enableLogging: boolean;
  enableMocking: boolean;
}

/**
 * Determine the current environment
 */
export const getCurrentEnvironment = (): EnvironmentType => {
  // Check environment variables in order of priority
  const envFromProcess =
    process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV || "development";

  // Validate environment
  const validEnvironments: EnvironmentType[] = [
    "development",
    "staging",
    "production",
  ];
  const normalizedEnv = envFromProcess.toLowerCase() as EnvironmentType;

  if (validEnvironments.includes(normalizedEnv)) {
    return normalizedEnv;
  }

  // Fallback based on hostname
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
      return "development";
    }

    if (hostname.includes("staging.") || hostname.includes("-staging.")) {
      return "staging";
    }

    if (hostname.includes("www.") || !hostname.includes(".")) {
      return "production";
    }
  }

  return "development"; // Default
};

// Current environment
export const CURRENT_ENV = getCurrentEnvironment();
export const CURRENT_CONFIG = ENVIRONMENTS[CURRENT_ENV];

/**
 * Base API configuration
 */
export const API_BASE_URL = CURRENT_CONFIG.apiBaseUrl;
export const API_TIMEOUT = CURRENT_CONFIG.apiTimeout;
export const IS_DEVELOPMENT = CURRENT_ENV === "development";
export const IS_STAGING = CURRENT_ENV === "staging";
export const IS_PRODUCTION = CURRENT_ENV === "production";
export const IS_MOCK_ENABLED = CURRENT_CONFIG.enableMocking;

/**
 * API version configuration
 */
export const API_VERSION = "v1";
export const API_BASE_PATH = `/api/${API_VERSION}`;

/**
 * API Endpoints configuration
 */
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}${API_BASE_PATH}/auth/login`,
    REGISTER: `${API_BASE_URL}${API_BASE_PATH}/auth/register`,
    LOGOUT: `${API_BASE_URL}${API_BASE_PATH}/auth/logout`,
    REFRESH_TOKEN: `${API_BASE_URL}${API_BASE_PATH}/auth/refresh`,
    PROFILE: `${API_BASE_URL}${API_BASE_PATH}/auth/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}${API_BASE_PATH}/auth/change-password`,
    FORGOT_PASSWORD: `${API_BASE_URL}${API_BASE_PATH}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}${API_BASE_PATH}/auth/reset-password`,
    VERIFY_EMAIL: `${API_BASE_URL}${API_BASE_PATH}/auth/verify-email`,
    RESEND_VERIFICATION: `${API_BASE_URL}${API_BASE_PATH}/auth/resend-verification`,
  },

  // User endpoints
  USERS: {
    BASE: `${API_BASE_URL}${API_BASE_PATH}/users`,
    PROFILE: `${API_BASE_URL}${API_BASE_PATH}/users/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}${API_BASE_PATH}/users/profile`,
    UPLOAD_AVATAR: `${API_BASE_URL}${API_BASE_PATH}/users/avatar`,
    PREFERENCES: `${API_BASE_URL}${API_BASE_PATH}/users/preferences`,
    DELETE_ACCOUNT: `${API_BASE_URL}${API_BASE_PATH}/users/account`,
    GET_USER: (userId: string | number) =>
      `${API_BASE_URL}${API_BASE_PATH}/users/${userId}`,
    SEARCH_USERS: `${API_BASE_URL}${API_BASE_PATH}/users/search`,
  },

  // Prediction endpoints
  PREDICTIONS: {
    BASE: `${API_BASE_URL}${API_BASE_PATH}/predictions`,
    CREATE: `${API_BASE_URL}${API_BASE_PATH}/predictions`,
    LIST: `${API_BASE_URL}${API_BASE_PATH}/predictions`,
    GET: (id: string | number) =>
      `${API_BASE_URL}${API_BASE_PATH}/predictions/${id}`,
    UPDATE: (id: string | number) =>
      `${API_BASE_URL}${API_BASE_PATH}/predictions/${id}`,
    DELETE: (id: string | number) =>
      `${API_BASE_URL}${API_BASE_PATH}/predictions/${id}`,
    USER_PREDICTIONS: (userId: string | number) =>
      `${API_BASE_URL}${API_BASE_PATH}/users/${userId}/predictions`,
    BATCH_CREATE: `${API_BASE_URL}${API_BASE_PATH}/predictions/batch`,
    STATS: `${API_BASE_URL}${API_BASE_PATH}/predictions/stats`,
  },

  // File upload endpoints
  UPLOAD: {
    IMAGE: `${API_BASE_URL}${API_BASE_PATH}/upload/image`,
    DOCUMENT: `${API_BASE_URL}${API_BASE_PATH}/upload/document`,
    AVATAR: `${API_BASE_URL}${API_BASE_PATH}/upload/avatar`,
    MULTIPLE: `${API_BASE_URL}${API_BASE_PATH}/upload/multiple`,
    PRESIGNED_URL: `${API_BASE_URL}${API_BASE_PATH}/upload/presigned-url`,
  },

  // Analytics endpoints
  ANALYTICS: {
    DASHBOARD: `${API_BASE_URL}${API_BASE_PATH}/analytics/dashboard`,
    USER_STATS: `${API_BASE_URL}${API_BASE_PATH}/analytics/user-stats`,
    PREDICTION_STATS: `${API_BASE_URL}${API_BASE_PATH}/analytics/prediction-stats`,
    ACTIVITY_LOGS: `${API_BASE_URL}${API_BASE_PATH}/analytics/activity-logs`,
  },

  // Admin endpoints
  ADMIN: {
    USERS: `${API_BASE_URL}${API_BASE_PATH}/admin/users`,
    PREDICTIONS: `${API_BASE_URL}${API_BASE_PATH}/admin/predictions`,
    ANALYTICS: `${API_BASE_URL}${API_BASE_PATH}/admin/analytics`,
    SYSTEM_HEALTH: `${API_BASE_URL}${API_BASE_PATH}/admin/system-health`,
    CONFIG: `${API_BASE_URL}${API_BASE_PATH}/admin/config`,
  },

  // Health and utility endpoints
  HEALTH: {
    STATUS: `${API_BASE_URL}${API_BASE_PATH}/health`,
    VERSION: `${API_BASE_URL}${API_BASE_PATH}/version`,
    PING: `${API_BASE_URL}${API_BASE_PATH}/ping`,
    CONFIG: `${API_BASE_URL}${API_BASE_PATH}/config`,
  },

  // WebSocket endpoints
  WEBSOCKET: {
    BASE: IS_PRODUCTION
      ? `wss://${new URL(API_BASE_URL).hostname}/ws`
      : `ws://${new URL(API_BASE_URL).hostname}:${
          new URL(API_BASE_URL).port || 80
        }/ws`,
    NOTIFICATIONS: "/notifications",
    PREDICTIONS: "/predictions",
  },
} as const;

/**
 * Default headers configuration
 */
export const DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
  "X-Requested-With": "XMLHttpRequest",
  "X-Client-Version": process.env.REACT_APP_VERSION || "1.0.0",
  "X-Client-Platform": "web",
} as const;

/**
 * Multipart/form-data headers for file uploads
 */
export const MULTIPART_HEADERS: Record<string, string> = {
  Accept: "application/json",
  "Cache-Control": "no-cache",
  "X-Client-Version": process.env.REACT_APP_VERSION || "1.0.0",
  "X-Client-Platform": "web",
} as const;

/**
 * Get authentication headers with bearer token
 */
export const getAuthHeaders = (token?: string): Record<string, string> => {
  const headers = { ...DEFAULT_HEADERS };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Get multipart headers with authentication
 */
export const getMultipartAuthHeaders = (
  token?: string
): Record<string, string> => {
  const headers = { ...MULTIPART_HEADERS };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * API Response Status Codes
 */
export const API_STATUS_CODES = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,

  // Client errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

/**
 * Custom error messages for different API scenarios
 */
export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your internet connection.",
  TIMEOUT_ERROR: "Request timeout. Please try again.",
  UNAUTHORIZED: "Your session has expired. Please log in again.",
  FORBIDDEN: "You do not have permission to access this resource.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  MAINTENANCE_ERROR: "The service is currently undergoing maintenance.",
  TOO_MANY_REQUESTS: "Too many requests. Please try again later.",
  DEFAULT: "An unexpected error occurred. Please try again.",
} as const;

/**
 * Retry configuration for failed requests
 */
export const API_RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  RETRY_ON_NETWORK_ERROR: true,
  RETRY_ON_STATUS_CODES: [408, 429, 500, 502, 503, 504],
  EXPONENTIAL_BACKOFF: true,
  BACKOFF_FACTOR: 2,
} as const;

/**
 * Cache configuration
 */
export const API_CACHE_CONFIG = {
  ENABLED: true,
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes in milliseconds
  MAX_CACHE_SIZE: 50, // Maximum number of cached responses
  CACHEABLE_METHODS: ["GET"] as const,
} as const;

/**
 * WebSocket configuration
 */
export const WEBSOCKET_CONFIG = {
  RECONNECT_INTERVAL: 3000, // 3 seconds
  MAX_RECONNECT_ATTEMPTS: 5,
  HEARTBEAT_INTERVAL: 30000, // 30 seconds
  HEARTBEAT_TIMEOUT: 10000, // 10 seconds
} as const;

/**
 * Request/Response interceptors configuration
 */
export const INTERCEPTOR_CONFIG = {
  ENABLE_REQUEST_LOGGING: CURRENT_CONFIG.enableLogging,
  ENABLE_RESPONSE_LOGGING: CURRENT_CONFIG.enableLogging,
  ENABLE_ERROR_LOGGING: true,
  LOG_REQUEST_BODY: IS_DEVELOPMENT,
  LOG_RESPONSE_BODY: IS_DEVELOPMENT,
  MASK_SENSITIVE_DATA: true,
  SENSITIVE_FIELDS: [
    "password",
    "token",
    "authorization",
    "credit_card",
    "ssn",
  ],
} as const;

/**
 * Helper function to build full API URL
 */
export const buildApiUrl = (
  endpoint: string,
  params?: Record<string, string | number | boolean>,
  queryParams?: Record<string, string | number | boolean | (string | number)[]>
): string => {
  let url = endpoint;

  // Replace path parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, encodeURIComponent(String(value)));
    });
  }

  // Add query parameters
  if (queryParams) {
    const searchParams = new URLSearchParams();

    Object.entries(queryParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          searchParams.append(`${key}[]`, String(item));
        });
      } else if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return url;
};

/**
 * Get WebSocket URL for a specific channel
 */
export const getWebSocketUrl = (channel?: string): string => {
  const wsBase = API_ENDPOINTS.WEBSOCKET.BASE;
  return channel ? `${wsBase}${channel}` : wsBase;
};

/**
 * Check if response should be cached
 */
export const shouldCacheResponse = (
  method: string,
  endpoint: string
): boolean => {
  if (!API_CACHE_CONFIG.ENABLED) return false;
  if (!API_CACHE_CONFIG.CACHEABLE_METHODS.includes(method as any)) return false;

  // Add custom logic for endpoints that shouldn't be cached
  const nonCacheableEndpoints = ["/auth/", "/logout", "/health"];
  return !nonCacheableEndpoints.some((prefix) => endpoint.includes(prefix));
};

/**
 * Mask sensitive data in logs
 */
export const maskSensitiveData = (data: any): any => {
  if (!INTERCEPTOR_CONFIG.MASK_SENSITIVE_DATA) return data;

  if (typeof data === "string") {
    return INTERCEPTOR_CONFIG.SENSITIVE_FIELDS.some((field) =>
      data.toLowerCase().includes(field.toLowerCase())
    )
      ? "[MASKED]"
      : data;
  }

  if (typeof data === "object" && data !== null) {
    const masked = { ...data };
    INTERCEPTOR_CONFIG.SENSITIVE_FIELDS.forEach((field) => {
      if (masked[field] !== undefined) {
        masked[field] = "[MASKED]";
      }
    });
    return masked;
  }

  return data;
};

/**
 * Log API configuration (only in development)
 */
if (CURRENT_CONFIG.debugMode) {
  console.group("📡 API Configuration");
  console.log("Environment:", CURRENT_ENV);
  console.log("Base URL:", API_BASE_URL);
  console.log("Timeout:", API_TIMEOUT, "ms");
  console.log("Debug Mode:", CURRENT_CONFIG.debugMode);
  console.log("Mocking Enabled:", IS_MOCK_ENABLED);
  console.log("WebSocket URL:", API_ENDPOINTS.WEBSOCKET.BASE);
  console.groupEnd();
}

/**
 * Export configuration object
 */
const apiConfig = {
  // Environment
  CURRENT_ENV,
  CURRENT_CONFIG,
  IS_DEVELOPMENT,
  IS_STAGING,
  IS_PRODUCTION,
  IS_MOCK_ENABLED,

  // URLs and Endpoints
  API_BASE_URL,
  API_BASE_PATH,
  API_ENDPOINTS,
  API_VERSION,

  // Headers
  DEFAULT_HEADERS,
  MULTIPART_HEADERS,
  getAuthHeaders,
  getMultipartAuthHeaders,

  // Timeouts and Limits
  API_TIMEOUT,
  API_RETRY_CONFIG,
  API_CACHE_CONFIG,

  // WebSocket
  WEBSOCKET_CONFIG,
  getWebSocketUrl,

  // Status and Errors
  API_STATUS_CODES,
  API_ERROR_MESSAGES,

  // Interceptors
  INTERCEPTOR_CONFIG,
  maskSensitiveData,

  // Utilities
  buildApiUrl,
  shouldCacheResponse,

  // Environment detection
  getCurrentEnvironment,
};

export default apiConfig;

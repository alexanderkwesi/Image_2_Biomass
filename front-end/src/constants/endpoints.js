// constants/endpoints.js

// Base API URL - configurable based on environment
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

// API Version
const API_VERSION = "v1";

// Construct full endpoint URLs
const buildEndpoint = (path) => `${API_BASE_URL}/api/${API_VERSION}${path}`;

export const API_ENDPOINTS = {
  // Authentication Endpoints
  AUTH: {
    LOGIN: buildEndpoint("/auth/login"),
    REGISTER: buildEndpoint("/auth/register"),
    LOGOUT: buildEndpoint("/auth/logout"),
    REFRESH: buildEndpoint("/auth/refresh"),
    ME: buildEndpoint("/auth/me"),
    VERIFY_EMAIL: buildEndpoint("/auth/verify-email"),
    RESEND_VERIFICATION: buildEndpoint("/auth/resend-verification"),

    // Password Management
    FORGOT_PASSWORD: buildEndpoint("/auth/forgot-password"),
    RESET_PASSWORD: buildEndpoint("/auth/reset-password"),
    CHANGE_PASSWORD: buildEndpoint("/auth/change-password"),

    // Social Login
    SOCIAL_LOGIN: buildEndpoint("/auth/social"),
    GOOGLE_LOGIN: buildEndpoint("/auth/google"),
    FACEBOOK_LOGIN: buildEndpoint("/auth/facebook"),
    GITHUB_LOGIN: buildEndpoint("/auth/github"),

    // Two-Factor Authentication
    ENABLE_2FA: buildEndpoint("/auth/2fa/enable"),
    VERIFY_2FA: buildEndpoint("/auth/2fa/verify"),
    DISABLE_2FA: buildEndpoint("/auth/2fa/disable"),

    // Session Management
    SESSIONS: buildEndpoint("/auth/sessions"),
    REVOKE_SESSION: buildEndpoint("/auth/sessions/revoke"),
  },

  // User Management
  USER: {
    PROFILE: buildEndpoint("/users/profile"),
    UPDATE_PROFILE: buildEndpoint("/users/profile"),
    UPLOAD_AVATAR: buildEndpoint("/users/avatar"),
    DELETE_ACCOUNT: buildEndpoint("/users/account"),

    // User Preferences
    PREFERENCES: buildEndpoint("/users/preferences"),
    NOTIFICATION_SETTINGS: buildEndpoint("/users/notifications/settings"),
    EMAIL_SETTINGS: buildEndpoint("/users/email/settings"),
  },

  // Farm Management
  FARMS: {
    BASE: buildEndpoint("/farms"),
    LIST: buildEndpoint("/farms"),
    CREATE: buildEndpoint("/farms"),
    DETAIL: (farmId) => buildEndpoint(`/farms/${farmId}`),
    UPDATE: (farmId) => buildEndpoint(`/farms/${farmId}`),
    DELETE: (farmId) => buildEndpoint(`/farms/${farmId}`),

    // Farm Activities
    ACTIVITIES: (farmId) => buildEndpoint(`/farms/${farmId}/activities`),
    CREATE_ACTIVITY: (farmId) => buildEndpoint(`/farms/${farmId}/activities`),

    // Farm Analytics
    STATS: (farmId) => buildEndpoint(`/farms/${farmId}/stats`),
    ANALYTICS: (farmId) => buildEndpoint(`/farms/${farmId}/analytics`),
    PREDICTIONS: (farmId) => buildEndpoint(`/farms/${farmId}/predictions`),

    // Farm Media
    IMAGES: (farmId) => buildEndpoint(`/farms/${farmId}/images`),
    UPLOAD_IMAGE: (farmId) => buildEndpoint(`/farms/${farmId}/images/upload`),
    DOCUMENTS: (farmId) => buildEndpoint(`/farms/${farmId}/documents`),
  },

  // Crop Management
  CROPS: {
    BASE: buildEndpoint("/crops"),
    LIST: buildEndpoint("/crops"),
    CREATE: buildEndpoint("/crops"),
    DETAIL: (cropId) => buildEndpoint(`/crops/${cropId}`),
    UPDATE: (cropId) => buildEndpoint(`/crops/${cropId}`),
    DELETE: (cropId) => buildEndpoint(`/crops/${cropId}`),

    // Crop Monitoring
    GROWTH_STAGES: (cropId) => buildEndpoint(`/crops/${cropId}/stages`),
    HEALTH_CHECK: (cropId) => buildEndpoint(`/crops/${cropId}/health`),
    YIELD_ESTIMATE: (cropId) => buildEndpoint(`/crops/${cropId}/yield`),
  },

  // Analytics & Reports
  ANALYTICS: {
    OVERVIEW: buildEndpoint("/analytics/overview"),
    FARM_PERFORMANCE: buildEndpoint("/analytics/farm-performance"),
    CROP_ANALYSIS: buildEndpoint("/analytics/crop-analysis"),
    WEATHER_IMPACT: buildEndpoint("/analytics/weather-impact"),
    FINANCIAL_REPORT: buildEndpoint("/analytics/financial-report"),

    // Custom Reports
    REPORTS: buildEndpoint("/analytics/reports"),
    CREATE_REPORT: buildEndpoint("/analytics/reports"),
    DOWNLOAD_REPORT: (reportId) =>
      buildEndpoint(`/analytics/reports/${reportId}/download`),
  },

  // Weather & Climate Data
  WEATHER: {
    CURRENT: buildEndpoint("/weather/current"),
    FORECAST: buildEndpoint("/weather/forecast"),
    HISTORICAL: buildEndpoint("/weather/historical"),
    ALERTS: buildEndpoint("/weather/alerts"),
  },

  // Market & Pricing Data
  MARKET: {
    PRICES: buildEndpoint("/market/prices"),
    TRENDS: buildEndpoint("/market/trends"),
    FORECAST: buildEndpoint("/market/forecast"),
    NEWS: buildEndpoint("/market/news"),
  },

  // IoT & Sensor Data
  IOT: {
    DEVICES: buildEndpoint("/iot/devices"),
    SENSOR_DATA: buildEndpoint("/iot/sensor-data"),
    REAL_TIME: buildEndpoint("/iot/realtime"),
    ALERTS: buildEndpoint("/iot/alerts"),
  },

  // Image Processing & AI
  IMAGES: {
    UPLOAD: buildEndpoint("/images/upload"),
    ANALYZE: buildEndpoint("/images/analyze"),
    PREDICTIONS: buildEndpoint("/images/predictions"),
    HISTORY: buildEndpoint("/images/history"),
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: buildEndpoint("/notifications"),
    UNREAD: buildEndpoint("/notifications/unread"),
    MARK_READ: (notificationId) =>
      buildEndpoint(`/notifications/${notificationId}/read`),
    MARK_ALL_READ: buildEndpoint("/notifications/read-all"),
    SETTINGS: buildEndpoint("/notifications/settings"),
    PREFERENCES: buildEndpoint("/notifications/preferences"),
  },

  // File Uploads & Storage
  UPLOADS: {
    IMAGES: buildEndpoint("/uploads/images"),
    DOCUMENTS: buildEndpoint("/uploads/documents"),
    VIDEOS: buildEndpoint("/uploads/videos"),
    TEMP: buildEndpoint("/uploads/temp"),
    GENERATE_PRESIGNED_URL: buildEndpoint("/uploads/presigned-url"),
  },

  // Dashboard & Home
  DASHBOARD: {
    OVERVIEW: buildEndpoint("/dashboard/overview"),
    QUICK_STATS: buildEndpoint("/dashboard/quick-stats"),
    RECENT_ACTIVITIES: buildEndpoint("/dashboard/recent-activities"),
    UPCOMING_TASKS: buildEndpoint("/dashboard/upcoming-tasks"),
    ALERTS: buildEndpoint("/dashboard/alerts"),
  },

  // Settings
  SETTINGS: {
    ACCOUNT: buildEndpoint("/settings/account"),
    NOTIFICATIONS: buildEndpoint("/settings/notifications"),
    SECURITY: buildEndpoint("/settings/security"),
    PREFERENCES: buildEndpoint("/settings/preferences"),
    INTEGRATIONS: buildEndpoint("/settings/integrations"),
    BILLING: buildEndpoint("/settings/billing"),
  },

  // Help & Support
  HELP: {
    FAQ: buildEndpoint("/help/faq"),
    CONTACT: buildEndpoint("/help/contact"),
    FEEDBACK: buildEndpoint("/help/feedback"),
    TUTORIALS: buildEndpoint("/help/tutorials"),
    DOCUMENTATION: buildEndpoint("/help/documentation"),
  },

  // Public Endpoints (no auth required)
  PUBLIC: {
    CONTACT_US: buildEndpoint("/public/contact"),
    SUBSCRIBE: buildEndpoint("/public/subscribe"),
    FEATURES: buildEndpoint("/public/features"),
    PRICING: buildEndpoint("/public/pricing"),
    TESTIMONIALS: buildEndpoint("/public/testimonials"),
  },
};

// WebSocket/Real-time endpoints
export const WS_ENDPOINTS = {
  NOTIFICATIONS: `${API_BASE_URL.replace("http", "ws")}/ws/notifications`,
  SENSOR_DATA: `${API_BASE_URL.replace("http", "ws")}/ws/sensor-data`,
  REAL_TIME_UPDATES: `${API_BASE_URL.replace("http", "ws")}/ws/updates`,
};

// External API endpoints (third-party services)
export const EXTERNAL_ENDPOINTS = {
  // Weather Services
  OPENWEATHER_MAP: "https://api.openweathermap.org/data/2.5",

  // Mapping Services
  GOOGLE_MAPS: {
    GEOCODE: "https://maps.googleapis.com/maps/api/geocode/json",
    DIRECTIONS: "https://maps.googleapis.com/maps/api/directions/json",
    STATIC_MAP: "https://maps.googleapis.com/maps/api/staticmap",
  },

  // Satellite Imagery
  SENTINEL_HUB: "https://services.sentinel-hub.com/api/v1",

  // Soil Data
  SOILGRIDS: "https://rest.isric.org",

  // Market Data
  USDA_API: "https://api.ers.usda.gov/data",

  // Payment Gateways
  STRIPE: {
    CREATE_PAYMENT: "https://api.stripe.com/v1/payment_intents",
    CREATE_CUSTOMER: "https://api.stripe.com/v1/customers",
  },

  // Email Service
  SENDGRID: "https://api.sendgrid.com/v3/mail/send",
};

// Query parameter constants
export const QUERY_PARAMS = {
  PAGE: "page",
  LIMIT: "limit",
  SORT_BY: "sortBy",
  SORT_ORDER: "sortOrder",
  SEARCH: "search",
  FILTER: "filter",
  DATE_FROM: "dateFrom",
  DATE_TO: "dateTo",
  TIME_RANGE: "timeRange",
  FARM_ID: "farmId",
  CROP_ID: "cropId",
  USER_ID: "userId",
};

// Default query parameter values
export const DEFAULT_QUERY_VALUES = {
  PAGE: 1,
  LIMIT: 20,
  LIMIT_LARGE: 50,
  LIMIT_SMALL: 10,
  SORT_ORDER: "desc",
};

// Time ranges for analytics
export const TIME_RANGES = {
  DAY: "24h",
  WEEK: "7d",
  MONTH: "30d",
  QUARTER: "90d",
  YEAR: "365d",
  CUSTOM: "custom",
};

// File upload constants
export const UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/mpeg", "video/quicktime"],
  CHUNK_SIZE: 1024 * 1024, // 1MB chunks for large files
};

// Cache constants
export const CACHE_KEYS = {
  USER_PROFILE: "user_profile",
  FARMS_LIST: "farms_list",
  DASHBOARD_DATA: "dashboard_data",
  WEATHER_DATA: "weather_data",
  MARKET_PRICES: "market_prices",
};

// Cache TTL (Time To Live) in milliseconds
export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
  VERY_LONG: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Feature flags endpoints (for feature toggles)
export const FEATURE_FLAGS = {
  GET_FLAGS: buildEndpoint("/features/flags"),
  VALIDATE: buildEndpoint("/features/validate"),
};

// API Response Status Codes
export const API_STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  HEAD: "HEAD",
  OPTIONS: "OPTIONS",
};

// Default headers for API requests
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Requested-With": "XMLHttpRequest",
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  VERSION: API_VERSION,
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Export a helper function to build dynamic endpoints
export const buildDynamicEndpoint = (template, ...params) => {
  return buildEndpoint(
    template.replace(/\{(\w+)\}/g, (match, key) => {
      const index = params.findIndex((p) => p.key === key);
      return index !== -1 ? params[index].value : match;
    })
  );
};

// Example usage of the helper function
/*
const farmId = 123;
const endpoint = buildDynamicEndpoint('/farms/{farmId}/activities', { key: 'farmId', value: farmId });
*/

export default API_ENDPOINTS;

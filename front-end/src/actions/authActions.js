// actions/authActions.js (or authActions.jsx)
import ApiClient from "../services/ApiClient";
import { API_ENDPOINTS } from "../constants/endpoints";
import { storage } from "../utils/storage";

export const AUTH_ACTION_TYPES = {
  // Basic Auth
  LOGIN_REQUEST: "AUTH/LOGIN_REQUEST",
  LOGIN_SUCCESS: "AUTH/LOGIN_SUCCESS",
  LOGIN_FAILURE: "AUTH/LOGIN_FAILURE",
  REGISTER_REQUEST: "AUTH/REGISTER_REQUEST",
  REGISTER_SUCCESS: "AUTH/REGISTER_SUCCESS",
  REGISTER_FAILURE: "AUTH/REGISTER_FAILURE",
  LOGOUT: "AUTH/LOGOUT",
  CLEAR_ERROR: "AUTH/CLEAR_ERROR",
  
  // Token Management
  REFRESH_TOKEN_REQUEST: "AUTH/REFRESH_TOKEN_REQUEST",
  REFRESH_TOKEN_SUCCESS: "AUTH/REFRESH_TOKEN_SUCCESS",
  REFRESH_TOKEN_FAILURE: "AUTH/REFRESH_TOKEN_FAILURE",
  
  // Password Management
  FORGOT_PASSWORD_REQUEST: "AUTH/FORGOT_PASSWORD_REQUEST",
  FORGOT_PASSWORD_SUCCESS: "AUTH/FORGOT_PASSWORD_SUCCESS",
  FORGOT_PASSWORD_FAILURE: "AUTH/FORGOT_PASSWORD_FAILURE",
  RESET_PASSWORD_REQUEST: "AUTH/RESET_PASSWORD_REQUEST",
  RESET_PASSWORD_SUCCESS: "AUTH/RESET_PASSWORD_SUCCESS",
  RESET_PASSWORD_FAILURE: "AUTH/RESET_PASSWORD_FAILURE",
  
  // User Management
  UPDATE_PROFILE_REQUEST: "AUTH/UPDATE_PROFILE_REQUEST",
  UPDATE_PROFILE_SUCCESS: "AUTH/UPDATE_PROFILE_SUCCESS",
  UPDATE_PROFILE_FAILURE: "AUTH/UPDATE_PROFILE_FAILURE",
  CHANGE_PASSWORD_REQUEST: "AUTH/CHANGE_PASSWORD_REQUEST",
  CHANGE_PASSWORD_SUCCESS: "AUTH/CHANGE_PASSWORD_SUCCESS",
  CHANGE_PASSWORD_FAILURE: "AUTH/CHANGE_PASSWORD_FAILURE",
  
  // Session Management
  SESSION_EXPIRED: "AUTH/SESSION_EXPIRED",
  SET_USER_ACTIVITY: "AUTH/SET_USER_ACTIVITY",
};

// Store tokens securely
const storeAuthTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    // Store in memory for immediate use
    ApiClient.setToken(accessToken);
    
    // Store in localStorage (consider using HttpOnly cookies in production)
    storage.set("access_token", accessToken);
    
    // Store in sessionStorage for session persistence
    sessionStorage.setItem("access_token", accessToken);
  }
  
  if (refreshToken) {
    storage.set("refresh_token", refreshToken);
  }
  
  // Store last activity timestamp
  storage.set("last_activity", Date.now());
};

// Clear all auth data
const clearAuthData = () => {
  ApiClient.clearAuthToken();
  storage.remove("access_token");
  storage.remove("refresh_token");
  storage.remove("last_activity");
  storage.remove("user_data");
  sessionStorage.removeItem("access_token");
  
  // Clear all localStorage entries prefixed with auth
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith("auth_")) {
      localStorage.removeItem(key);
    }
  });
};

export const login = (email, password, rememberMe = false) => async (dispatch) => {
  dispatch({ type: AUTH_ACTION_TYPES.LOGIN_REQUEST });

  try {
    const response = await ApiClient.request(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify({ email, password, remember_me: rememberMe }),
    });

    // Store tokens based on remember me preference
    if (rememberMe) {
      storeAuthTokens(response.access_token, response.refresh_token);
    } else {
      // Session-only tokens
      storeAuthTokens(response.access_token, null);
    }

    // Get user profile
    ApiClient.setToken(response.access_token);
    const userProfile = await ApiClient.request(API_ENDPOINTS.AUTH.ME);

    // Store user data
    storage.set("user_data", userProfile);

    dispatch({
      type: AUTH_ACTION_TYPES.LOGIN_SUCCESS,
      payload: {
        user: userProfile,
        token: response.access_token,
        refreshToken: response.refresh_token,
        expiresIn: response.expires_in,
      },
    });

    // Track login event for analytics
    if (window.gtag) {
      window.gtag("event", "login", {
        method: "email",
      });
    }

    return { success: true, user: userProfile };
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Login failed";
    
    dispatch({
      type: AUTH_ACTION_TYPES.LOGIN_FAILURE,
      payload: errorMessage,
    });

    // Track failed login for security monitoring
    if (window.gtag) {
      window.gtag("event", "login_failed", {
        error_message: errorMessage,
      });
    }

    return { 
      success: false, 
      error: errorMessage,
      status: error.status,
    };
  }
};

// Social login (Google, Facebook, etc.)
export const socialLogin = (provider, token) => async (dispatch) => {
  dispatch({ type: AUTH_ACTION_TYPES.LOGIN_REQUEST });

  try {
    const response = await ApiClient.request(API_ENDPOINTS.AUTH.SOCIAL_LOGIN, {
      method: "POST",
      body: JSON.stringify({ provider, token }),
    });

    storeAuthTokens(response.access_token, response.refresh_token);
    
    ApiClient.setToken(response.access_token);
    const userProfile = await ApiClient.request(API_ENDPOINTS.AUTH.ME);
    storage.set("user_data", userProfile);

    dispatch({
      type: AUTH_ACTION_TYPES.LOGIN_SUCCESS,
      payload: {
        user: userProfile,
        token: response.access_token,
        refreshToken: response.refresh_token,
        expiresIn: response.expires_in,
      },
    });

    // Track social login
    if (window.gtag) {
      window.gtag("event", "login", {
        method: provider,
      });
    }

    return { success: true, user: userProfile };
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Social login failed";
    
    dispatch({
      type: AUTH_ACTION_TYPES.LOGIN_FAILURE,
      payload: errorMessage,
    });

    return { success: false, error: errorMessage };
  }
};

export const register = (userData) => async (dispatch) => {
  dispatch({ type: AUTH_ACTION_TYPES.REGISTER_REQUEST });

  try {
    const response = await ApiClient.request(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify(userData),
    });

    // Auto-login after registration if token is provided
    if (response.access_token) {
      storeAuthTokens(response.access_token, response.refresh_token);
      ApiClient.setToken(response.access_token);
      
      const userProfile = await ApiClient.request(API_ENDPOINTS.AUTH.ME);
      storage.set("user_data", userProfile);

      dispatch({
        type: AUTH_ACTION_TYPES.REGISTER_SUCCESS,
        payload: {
          user: userProfile,
          token: response.access_token,
          refreshToken: response.refresh_token,
          expiresIn: response.expires_in,
        },
      });

      // Track registration
      if (window.gtag) {
        window.gtag("event", "sign_up", {
          method: "email",
        });
      }

      return { success: true, user: userProfile, requiresEmailVerification: false };
    } else {
      // Registration successful but requires email verification
      dispatch({
        type: AUTH_ACTION_TYPES.REGISTER_SUCCESS,
        payload: { user: null, token: null },
      });

      return { 
        success: true, 
        user: null, 
        requiresEmailVerification: true,
        message: "Please check your email to verify your account"
      };
    }
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Registration failed";
    
    dispatch({
      type: AUTH_ACTION_TYPES.REGISTER_FAILURE,
      payload: errorMessage,
    });

    return { 
      success: false, 
      error: errorMessage,
      validationErrors: error.data?.errors,
    };
  }
};

export const logout = (manual = true) => (dispatch) => {
  // Track logout reason
  if (manual && window.gtag) {
    window.gtag("event", "logout", {
      method: "manual",
    });
  }

  // Clear all auth data
  clearAuthData();

  // Clear any pending requests
  if (window.activeRequests) {
    Object.keys(window.activeRequests).forEach(key => {
      window.activeRequests[key].abort();
    });
  }

  dispatch({ 
    type: AUTH_ACTION_TYPES.LOGOUT,
    payload: { manual },
  });

  // Dispatch event for other components to listen to
  window.dispatchEvent(new CustomEvent("auth-logout", { detail: { manual } }));
};

export const refreshToken = () => async (dispatch, getState) => {
  dispatch({ type: AUTH_ACTION_TYPES.REFRESH_TOKEN_REQUEST });

  try {
    const refreshToken = storage.get("refresh_token");
    
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await ApiClient.request(API_ENDPOINTS.AUTH.REFRESH, {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
      skipAuth: true, // Don't add current token to request
    });

    storeAuthTokens(response.access_token, response.refresh_token);
    ApiClient.setToken(response.access_token);

    dispatch({
      type: AUTH_ACTION_TYPES.REFRESH_TOKEN_SUCCESS,
      payload: {
        token: response.access_token,
        refreshToken: response.refresh_token,
        expiresIn: response.expires_in,
      },
    });

    return { success: true, token: response.access_token };
  } catch (error) {
    dispatch({
      type: AUTH_ACTION_TYPES.REFRESH_TOKEN_FAILURE,
      payload: error.message || "Token refresh failed",
    });

    // If refresh fails, logout the user
    dispatch(logout(false));

    return { success: false, error: error.message };
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  dispatch({ type: AUTH_ACTION_TYPES.FORGOT_PASSWORD_REQUEST });

  try {
    await ApiClient.request(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    dispatch({
      type: AUTH_ACTION_TYPES.FORGOT_PASSWORD_SUCCESS,
      payload: email,
    });

    return { success: true, message: "Password reset email sent" };
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Failed to send reset email";
    
    dispatch({
      type: AUTH_ACTION_TYPES.FORGOT_PASSWORD_FAILURE,
      payload: errorMessage,
    });

    return { success: false, error: errorMessage };
  }
};

export const resetPassword = (token, newPassword, confirmPassword) => async (dispatch) => {
  dispatch({ type: AUTH_ACTION_TYPES.RESET_PASSWORD_REQUEST });

  try {
    await ApiClient.request(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: "POST",
      body: JSON.stringify({ 
        token, 
        new_password: newPassword,
        confirm_password: confirmPassword 
      }),
    });

    dispatch({
      type: AUTH_ACTION_TYPES.RESET_PASSWORD_SUCCESS,
    });

    return { success: true, message: "Password reset successful" };
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Password reset failed";
    
    dispatch({
      type: AUTH_ACTION_TYPES.RESET_PASSWORD_FAILURE,
      payload: errorMessage,
    });

    return { success: false, error: errorMessage };
  }
};

export const updateProfile = (profileData) => async (dispatch) => {
  dispatch({ type: AUTH_ACTION_TYPES.UPDATE_PROFILE_REQUEST });

  try {
    const response = await ApiClient.request(API_ENDPOINTS.AUTH.UPDATE_PROFILE, {
      method: "PUT",
      body: JSON.stringify(profileData),
    });

    // Update stored user data
    const currentUser = storage.get("user_data");
    const updatedUser = { ...currentUser, ...response.user };
    storage.set("user_data", updatedUser);

    dispatch({
      type: AUTH_ACTION_TYPES.UPDATE_PROFILE_SUCCESS,
      payload: updatedUser,
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Profile update failed";
    
    dispatch({
      type: AUTH_ACTION_TYPES.UPDATE_PROFILE_FAILURE,
      payload: errorMessage,
    });

    return { success: false, error: errorMessage };
  }
};

export const changePassword = (currentPassword, newPassword, confirmPassword) => async (dispatch) => {
  dispatch({ type: AUTH_ACTION_TYPES.CHANGE_PASSWORD_REQUEST });

  try {
    await ApiClient.request(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      method: "POST",
      body: JSON.stringify({ 
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword 
      }),
    });

    dispatch({
      type: AUTH_ACTION_TYPES.CHANGE_PASSWORD_SUCCESS,
    });

    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    const errorMessage = error.data?.message || error.message || "Password change failed";
    
    dispatch({
      type: AUTH_ACTION_TYPES.CHANGE_PASSWORD_FAILURE,
      payload: errorMessage,
    });

    return { success: false, error: errorMessage };
  }
};

export const clearAuthError = () => (dispatch) => {
  dispatch({ type: AUTH_ACTION_TYPES.CLEAR_ERROR });
};

export const checkSession = () => async (dispatch, getState) => {
  const lastActivity = storage.get("last_activity");
  const sessionTimeout = 30 * 60 * 1000; // 30 minutes

  if (lastActivity && Date.now() - lastActivity > sessionTimeout) {
    dispatch({ type: AUTH_ACTION_TYPES.SESSION_EXPIRED });
    dispatch(logout(false));
    return false;
  }

  return true;
};

export const setUserActivity = () => (dispatch) => {
  storage.set("last_activity", Date.now());
  dispatch({ 
    type: AUTH_ACTION_TYPES.SET_USER_ACTIVITY,
    payload: Date.now(),
  });
};

// Initialize auth from storage (on app load)
export const initializeAuth = () => async (dispatch) => {
  const token = storage.get("access_token");
  const userData = storage.get("user_data");

  if (token && userData) {
    // Set token in API client
    ApiClient.setToken(token);
    
    // Validate token by fetching user profile
    try {
      const userProfile = await ApiClient.request(API_ENDPOINTS.AUTH.ME);
      
      // Update stored user data if needed
      if (JSON.stringify(userProfile) !== JSON.stringify(userData)) {
        storage.set("user_data", userProfile);
      }

      dispatch({
        type: AUTH_ACTION_TYPES.LOGIN_SUCCESS,
        payload: {
          user: userProfile,
          token,
          refreshToken: storage.get("refresh_token"),
        },
      });

      return { success: true, user: userProfile };
    } catch (error) {
      // Token invalid, clear auth data
      clearAuthData();
      return { success: false, error: "Session expired" };
    }
  }

  return { success: false, error: "No stored session" };
};
// userActions.ts
import { apiService } from '../services/apiService';
import { API_ENDPOINTS } from './apiConfig';
import { Storage, StorageKeys } from '../utils/storage';
import { toast } from 'react-toastify'; // Or use your preferred notification library

// Types
export interface UserProfile {
  id: string | number;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
  preferences?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface PredictionHistoryItem {
  id: string | number;
  userId: string | number;
  input: Record<string, any>;
  output: Record<string, any>;
  model?: string;
  confidence?: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

// Action Types
export const USER_ACTION_TYPES = {
  // Profile actions
  USER_PROFILE_REQUEST: 'USER_PROFILE_REQUEST',
  USER_PROFILE_SUCCESS: 'USER_PROFILE_SUCCESS',
  USER_PROFILE_FAIL: 'USER_PROFILE_FAIL',
  USER_PROFILE_UPDATE: 'USER_PROFILE_UPDATE',
  USER_PROFILE_CLEAR: 'USER_PROFILE_CLEAR',
  
  // Prediction history actions
  PREDICTION_HISTORY_REQUEST: 'PREDICTION_HISTORY_REQUEST',
  PREDICTION_HISTORY_SUCCESS: 'PREDICTION_HISTORY_SUCCESS',
  PREDICTION_HISTORY_FAIL: 'PREDICTION_HISTORY_FAIL',
  PREDICTION_HISTORY_CLEAR: 'PREDICTION_HISTORY_CLEAR',
  PREDICTION_HISTORY_ADD: 'PREDICTION_HISTORY_ADD',
  PREDICTION_HISTORY_UPDATE: 'PREDICTION_HISTORY_UPDATE',
  PREDICTION_HISTORY_DELETE: 'PREDICTION_HISTORY_DELETE',
  
  // Settings actions
  USER_SETTINGS_UPDATE: 'USER_SETTINGS_UPDATE',
  USER_PREFERENCES_UPDATE: 'USER_PREFERENCES_UPDATE',
} as const;

// Action creators
export const userProfileRequest = () => ({
  type: USER_ACTION_TYPES.USER_PROFILE_REQUEST as const,
});

export const userProfileSuccess = (profile: UserProfile) => ({
  type: USER_ACTION_TYPES.USER_PROFILE_SUCCESS as const,
  payload: profile,
});

export const userProfileFail = (error: string) => ({
  type: USER_ACTION_TYPES.USER_PROFILE_FAIL as const,
  payload: error,
});

export const predictionHistoryRequest = () => ({
  type: USER_ACTION_TYPES.PREDICTION_HISTORY_REQUEST as const,
});

export const predictionHistorySuccess = (history: PredictionHistoryItem[]) => ({
  type: USER_ACTION_TYPES.PREDICTION_HISTORY_SUCCESS as const,
  payload: history,
});

export const predictionHistoryFail = (error: string) => ({
  type: USER_ACTION_TYPES.PREDICTION_HISTORY_FAIL as const,
  payload: error,
});

// Thunk action creators
export const getUserProfile = () => {
  return async (dispatch: any) => {
    try {
      dispatch(userProfileRequest());
      
      // Get token from storage
      const token = Storage.getItem(StorageKeys.AUTH_TOKEN);
      
      if (!token) {
        throw new Error('Authentication required. Please login.');
      }
      
      const response = await apiService.get<UserProfile>(
        API_ENDPOINTS.USERS.PROFILE,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      dispatch(userProfileSuccess(response.data));
      
      // Store user data in localStorage for persistence
      Storage.setItem(StorageKeys.USER, response.data);
      
      return {
        success: true,
        data: response.data,
      };
      
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      
      const errorMessage = error.message || 'Failed to fetch user profile';
      dispatch(userProfileFail(errorMessage));
      
      // Handle authentication errors
      if (error.status === 401 || error.status === 403) {
        // Clear invalid credentials
        Storage.removeItem(StorageKeys.AUTH_TOKEN);
        Storage.removeItem(StorageKeys.USER);
        
        // Show notification
        toast.error('Session expired. Please login again.', {
          position: 'top-right',
          autoClose: 5000,
        });
        
        // Dispatch logout action if you have one
        // dispatch(logoutUser());
        
        // Return to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
          // Or use your router: navigate('/login');
        }
      } else {
        // Show error notification
        toast.error(`Failed to load profile: ${errorMessage}`, {
          position: 'top-right',
          autoClose: 5000,
        });
      }
      
      return {
        success: false,
        error: errorMessage,
        statusCode: error.status,
      };
    }
  };
};

export const getPredictionHistory = (options: {
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
} = {}) => {
  return async (dispatch: any, getState: any) => {
    try {
      dispatch(predictionHistoryRequest());
      
      const token = Storage.getItem(StorageKeys.AUTH_TOKEN);
      const user = getState().auth.user; // Assuming you have auth state
      
      if (!token || !user?.id) {
        throw new Error('Authentication required');
      }
      
      const { limit = 10, page = 1, sortBy = 'createdAt', sortOrder = 'desc', status } = options;
      
      // Build query parameters
      const queryParams: Record<string, any> = {
        limit,
        page,
        sortBy,
        sortOrder,
      };
      
      if (status) {
        queryParams.status = status;
      }
      
      const response = await apiService.get<{
        predictions: PredictionHistoryItem[];
        total: number;
        page: number;
        totalPages: number;
        limit: number;
      }>(
        API_ENDPOINTS.PREDICTIONS.USER_PREDICTIONS(user.id),
        {
          params: queryParams,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      dispatch(predictionHistorySuccess(response.data.predictions));
      
      return {
        success: true,
        data: response.data,
      };
      
    } catch (error: any) {
      console.error('Error fetching prediction history:', error);
      
      const errorMessage = error.message || 'Failed to fetch prediction history';
      dispatch(predictionHistoryFail(errorMessage));
      
      // Handle authentication errors
      if (error.status === 401 || error.status === 403) {
        toast.error('Authentication required. Please login again.', {
          position: 'top-right',
          autoClose: 5000,
        });
      } else {
        toast.error(`Failed to load prediction history: ${errorMessage}`, {
          position: 'top-right',
          autoClose: 5000,
        });
      }
      
      return {
        success: false,
        error: errorMessage,
        statusCode: error.status,
      };
    }
  };
};

export const updateUserProfile = (profileData: Partial<UserProfile>) => {
  return async (dispatch: any) => {
    try {
      dispatch(userProfileRequest());
      
      const token = Storage.getItem(StorageKeys.AUTH_TOKEN);
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await apiService.put<UserProfile>(
        API_ENDPOINTS.USERS.UPDATE_PROFILE,
        profileData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      dispatch(userProfileSuccess(response.data));
      Storage.setItem(StorageKeys.USER, response.data);
      
      toast.success('Profile updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      
      return {
        success: true,
        data: response.data,
      };
      
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      
      const errorMessage = error.message || 'Failed to update profile';
      
      toast.error(`Update failed: ${errorMessage}`, {
        position: 'top-right',
        autoClose: 5000,
      });
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };
};

export const uploadProfileAvatar = (file: File) => {
  return async (dispatch: any) => {
    try {
      const token = Storage.getItem(StorageKeys.AUTH_TOKEN);
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await apiService.uploadFile<{ avatarUrl: string }>(
        API_ENDPOINTS.UPLOAD.AVATAR,
        file,
        'avatar'
      );
      
      // Update local user profile with new avatar
      const currentUser = Storage.getItem(StorageKeys.USER) as UserProfile;
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          avatar: response.data.avatarUrl,
        };
        
        Storage.setItem(StorageKeys.USER, updatedUser);
        dispatch(userProfileSuccess(updatedUser));
      }
      
      toast.success('Profile picture updated!', {
        position: 'top-right',
        autoClose: 3000,
      });
      
      return {
        success: true,
        data: response.data,
      };
      
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      
      const errorMessage = error.message || 'Failed to upload profile picture';
      
      toast.error(`Upload failed: ${errorMessage}`, {
        position: 'top-right',
        autoClose: 5000,
      });
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };
};

export const deletePrediction = (predictionId: string | number) => {
  return async (dispatch: any, getState: any) => {
    try {
      const token = Storage.getItem(StorageKeys.AUTH_TOKEN);
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      await apiService.delete(
        API_ENDPOINTS.PREDICTIONS.DELETE(predictionId),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      // Remove from local state
      const currentHistory = getState().user?.predictionHistory || [];
      const updatedHistory = currentHistory.filter(
        (item: PredictionHistoryItem) => item.id !== predictionId
      );
      
      dispatch(predictionHistorySuccess(updatedHistory));
      
      toast.success('Prediction deleted successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      
      return { success: true };
      
    } catch (error: any) {
      console.error('Error deleting prediction:', error);
      
      const errorMessage = error.message || 'Failed to delete prediction';
      
      toast.error(`Deletion failed: ${errorMessage}`, {
        position: 'top-right',
        autoClose: 5000,
      });
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };
};

export const createPrediction = (predictionData: {
  input: Record<string, any>;
  model?: string;
  options?: Record<string, any>;
}) => {
  return async (dispatch: any) => {
    try {
      const token = Storage.getItem(StorageKeys.AUTH_TOKEN);
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await apiService.post<PredictionHistoryItem>(
        API_ENDPOINTS.PREDICTIONS.CREATE,
        predictionData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      // Add to local state
      dispatch({
        type: USER_ACTION_TYPES.PREDICTION_HISTORY_ADD,
        payload: response.data,
      });
      
      toast.success('Prediction created successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      
      return {
        success: true,
        data: response.data,
      };
      
    } catch (error: any) {
      console.error('Error creating prediction:', error);
      
      const errorMessage = error.message || 'Failed to create prediction';
      
      toast.error(`Creation failed: ${errorMessage}`, {
        position: 'top-right',
        autoClose: 5000,
      });
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };
};

export const getUserPreferences = () => {
  return async (dispatch: any) => {
    try {
      const token = Storage.getItem(StorageKeys.AUTH_TOKEN);
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await apiService.get<Record<string, any>>(
        API_ENDPOINTS.USERS.PREFERENCES,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      return {
        success: true,
        data: response.data,
      };
      
    } catch (error: any) {
      console.error('Error fetching user preferences:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  };
};

export const updateUserPreferences = (preferences: Record<string, any>) => {
  return async (dispatch: any) => {
    try {
      const token = Storage.getItem(StorageKeys.AUTH_TOKEN);
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await apiService.put<Record<string, any>>(
        API_ENDPOINTS.USERS.PREFERENCES,
        preferences,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      // Update local user preferences
      const currentUser = Storage.getItem(StorageKeys.USER) as UserProfile;
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          preferences: response.data,
        };
        
        Storage.setItem(StorageKeys.USER, updatedUser);
        dispatch(userProfileSuccess(updatedUser));
      }
      
      toast.success('Preferences updated!', {
        position: 'top-right',
        autoClose: 3000,
      });
      
      return {
        success: true,
        data: response.data,
      };
      
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      
      toast.error(`Failed to update preferences: ${error.message}`, {
        position: 'top-right',
        autoClose: 5000,
      });
      
      return {
        success: false,
        error: error.message,
      };
    }
  };
};

export const clearUserData = () => ({
  type: USER_ACTION_TYPES.USER_PROFILE_CLEAR as const,
});

export const clearPredictionHistory = () => ({
  type: USER_ACTION_TYPES.PREDICTION_HISTORY_CLEAR as const,
});

// Hook for using user actions in React components
export const useUserActions = () => {
  const dispatch = useDispatch(); // From react-redux
  
  return {
    getUserProfile: () => dispatch(getUserProfile()),
    getPredictionHistory: (options?: any) => dispatch(getPredictionHistory(options)),
    updateUserProfile: (data: Partial<UserProfile>) => dispatch(updateUserProfile(data)),
    uploadProfileAvatar: (file: File) => dispatch(uploadProfileAvatar(file)),
    deletePrediction: (id: string | number) => dispatch(deletePrediction(id)),
    createPrediction: (data: any) => dispatch(createPrediction(data)),
    getUserPreferences: () => dispatch(getUserPreferences()),
    updateUserPreferences: (preferences: Record<string, any>) => 
      dispatch(updateUserPreferences(preferences)),
    clearUserData: () => dispatch(clearUserData()),
    clearPredictionHistory: () => dispatch(clearPredictionHistory()),
  };
};
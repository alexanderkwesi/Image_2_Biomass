// actions/imageActions.ts
export const ImageActionTypes = {
  // Upload
  UPLOAD_REQUEST: "IMAGE/UPLOAD_REQUEST",
  UPLOAD_PROGRESS: "IMAGE/UPLOAD_PROGRESS",
  UPLOAD_SUCCESS: "IMAGE/UPLOAD_SUCCESS",
  UPLOAD_FAILURE: "IMAGE/UPLOAD_FAILURE",

  // Validation
  VALIDATE_REQUEST: "IMAGE/VALIDATE_REQUEST",
  VALIDATE_SUCCESS: "IMAGE/VALIDATE_SUCCESS",
  VALIDATE_FAILURE: "IMAGE/VALIDATE_FAILURE",

  // Prediction
  PREDICTION_REQUEST: "IMAGE/PREDICTION_REQUEST",
  PREDICTION_SUCCESS: "IMAGE/PREDICTION_SUCCESS",
  PREDICTION_FAILURE: "IMAGE/PREDICTION_FAILURE",

  // Processing
  PROCESSING_REQUEST: "IMAGE/PROCESSING_REQUEST",
  PROCESSING_SUCCESS: "IMAGE/PROCESSING_SUCCESS",
  PROCESSING_FAILURE: "IMAGE/PROCESSING_FAILURE",

  // Batch processing
  BATCH_PROCESSING_REQUEST: "IMAGE/BATCH_PROCESSING_REQUEST",
  BATCH_PROCESSING_PROGRESS: "IMAGE/BATCH_PROCESSING_PROGRESS",
  BATCH_PROCESSING_SUCCESS: "IMAGE/BATCH_PROCESSING_SUCCESS",
  BATCH_PROCESSING_FAILURE: "IMAGE/BATCH_PROCESSING_FAILURE",

  // Configuration
  SET_PROCESSING_OPTIONS: "IMAGE/SET_PROCESSING_OPTIONS",
  SET_SELECTED_MODEL: "IMAGE/SET_SELECTED_MODEL",
  UPDATE_MODELS: "IMAGE/UPDATE_MODELS",
  SET_ALLOWED_FORMATS: "IMAGE/SET_ALLOWED_FORMATS",
  SET_MAX_FILE_SIZE: "IMAGE/SET_MAX_FILE_SIZE",

  // UI state
  TOGGLE_ADVANCED_OPTIONS: "IMAGE/TOGGLE_ADVANCED_OPTIONS",

  // Clear and reset
  CLEAR_PREDICTION: "IMAGE/CLEAR_PREDICTION",
  CLEAR_IMAGE: "IMAGE/CLEAR_IMAGE",
  CLEAR_HISTORY: "IMAGE/CLEAR_HISTORY",
  CLEAR_BATCH_RESULT: "IMAGE/CLEAR_BATCH_RESULT",
  CLEAR_ERROR: "IMAGE/CLEAR_ERROR",
  RESET_IMAGE_STATE: "IMAGE/RESET_IMAGE_STATE",

  // Image manipulation
  ROTATE_IMAGE: "IMAGE/ROTATE_IMAGE",
  CROP_IMAGE: "IMAGE/CROP_IMAGE",
  ADJUST_IMAGE: "IMAGE/ADJUST_IMAGE",

  // Save and export
  SAVE_PROCESSED_IMAGE_REQUEST: "IMAGE/SAVE_PROCESSED_IMAGE_REQUEST",
  SAVE_PROCESSED_IMAGE_SUCCESS: "IMAGE/SAVE_PROCESSED_IMAGE_SUCCESS",
  SAVE_PROCESSED_IMAGE_FAILURE: "IMAGE/SAVE_PROCESSED_IMAGE_FAILURE",

  // Compare predictions
  COMPARE_PREDICTIONS_REQUEST: "IMAGE/COMPARE_PREDICTIONS_REQUEST",
  COMPARE_PREDICTIONS_SUCCESS: "IMAGE/COMPARE_PREDICTIONS_SUCCESS",
  COMPARE_PREDICTIONS_FAILURE: "IMAGE/COMPARE_PREDICTIONS_FAILURE",
} as const;

export type ImageAction =
  | { type: typeof ImageActionTypes.UPLOAD_REQUEST }
  | { type: typeof ImageActionTypes.UPLOAD_PROGRESS; payload: number }
  | { type: typeof ImageActionTypes.UPLOAD_SUCCESS; payload: ImageData }
  | { type: typeof ImageActionTypes.UPLOAD_FAILURE; payload: string }
  | { type: typeof ImageActionTypes.VALIDATE_REQUEST }
  | {
      type: typeof ImageActionTypes.VALIDATE_SUCCESS;
      payload: ValidationResult;
    }
  | { type: typeof ImageActionTypes.VALIDATE_FAILURE; payload: string }
  | { type: typeof ImageActionTypes.PREDICTION_REQUEST }
  | {
      type: typeof ImageActionTypes.PREDICTION_SUCCESS;
      payload: PredictionResult;
    }
  | { type: typeof ImageActionTypes.PREDICTION_FAILURE; payload: string }
  | { type: typeof ImageActionTypes.PROCESSING_REQUEST }
  | { type: typeof ImageActionTypes.PROCESSING_SUCCESS; payload: ImageData }
  | { type: typeof ImageActionTypes.PROCESSING_FAILURE; payload: string }
  | {
      type: typeof ImageActionTypes.BATCH_PROCESSING_REQUEST;
      payload: { batchId: string; imageIds: (string | number)[] };
    }
  | {
      type: typeof ImageActionTypes.BATCH_PROCESSING_PROGRESS;
      payload: { completed: number; failed: number; results?: any[] };
    }
  | { type: typeof ImageActionTypes.BATCH_PROCESSING_SUCCESS; payload: any[] }
  | { type: typeof ImageActionTypes.BATCH_PROCESSING_FAILURE; payload: string }
  | {
      type: typeof ImageActionTypes.SET_PROCESSING_OPTIONS;
      payload: Partial<ImageProcessingOptions>;
    }
  | { type: typeof ImageActionTypes.SET_SELECTED_MODEL; payload: string }
  | { type: typeof ImageActionTypes.UPDATE_MODELS; payload: Array<any> }
  | { type: typeof ImageActionTypes.SET_ALLOWED_FORMATS; payload: string[] }
  | { type: typeof ImageActionTypes.SET_MAX_FILE_SIZE; payload: number }
  | { type: typeof ImageActionTypes.TOGGLE_ADVANCED_OPTIONS }
  | { type: typeof ImageActionTypes.CLEAR_PREDICTION }
  | { type: typeof ImageActionTypes.CLEAR_IMAGE }
  | { type: typeof ImageActionTypes.CLEAR_HISTORY }
  | { type: typeof ImageActionTypes.CLEAR_BATCH_RESULT }
  | { type: typeof ImageActionTypes.CLEAR_ERROR }
  | { type: typeof ImageActionTypes.RESET_IMAGE_STATE }
  | { type: typeof ImageActionTypes.ROTATE_IMAGE; payload?: number } // degrees
  | { type: typeof ImageActionTypes.CROP_IMAGE; payload?: any }
  | { type: typeof ImageActionTypes.ADJUST_IMAGE; payload: any }
  | { type: typeof ImageActionTypes.SAVE_PROCESSED_IMAGE_REQUEST }
  | {
      type: typeof ImageActionTypes.SAVE_PROCESSED_IMAGE_SUCCESS;
      payload: ImageData;
    }
  | {
      type: typeof ImageActionTypes.SAVE_PROCESSED_IMAGE_FAILURE;
      payload: string;
    }
  | { type: typeof ImageActionTypes.COMPARE_PREDICTIONS_REQUEST }
  | { type: typeof ImageActionTypes.COMPARE_PREDICTIONS_SUCCESS; payload: any }
  | {
      type: typeof ImageActionTypes.COMPARE_PREDICTIONS_FAILURE;
      payload: string;
    };

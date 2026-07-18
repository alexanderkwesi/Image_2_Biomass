// actions/farmActions.ts
export const FarmActionTypes = {
  // Get farms
  GET_FARMS_REQUEST: "FARMS/GET_FARMS_REQUEST",
  GET_FARMS_SUCCESS: "FARMS/GET_FARMS_SUCCESS",
  GET_FARMS_FAILURE: "FARMS/GET_FARMS_FAILURE",

  // Get farm details
  GET_FARM_DETAILS_REQUEST: "FARMS/GET_FARM_DETAILS_REQUEST",
  GET_FARM_DETAILS_SUCCESS: "FARMS/GET_FARM_DETAILS_SUCCESS",
  GET_FARM_DETAILS_FAILURE: "FARMS/GET_FARM_DETAILS_FAILURE",

  // Create farm
  CREATE_FARM_REQUEST: "FARMS/CREATE_FARM_REQUEST",
  CREATE_FARM_SUCCESS: "FARMS/CREATE_FARM_SUCCESS",
  CREATE_FARM_FAILURE: "FARMS/CREATE_FARM_FAILURE",

  // Update farm
  UPDATE_FARM_REQUEST: "FARMS/UPDATE_FARM_REQUEST",
  UPDATE_FARM_SUCCESS: "FARMS/UPDATE_FARM_SUCCESS",
  UPDATE_FARM_FAILURE: "FARMS/UPDATE_FARM_FAILURE",

  // Delete farm
  DELETE_FARM_REQUEST: "FARMS/DELETE_FARM_REQUEST",
  DELETE_FARM_SUCCESS: "FARMS/DELETE_FARM_SUCCESS",
  DELETE_FARM_FAILURE: "FARMS/DELETE_FARM_FAILURE",

  // Predictions
  GET_FARM_PREDICTIONS_REQUEST: "FARMS/GET_FARM_PREDICTIONS_REQUEST",
  GET_FARM_PREDICTIONS_SUCCESS: "FARMS/GET_FARM_PREDICTIONS_SUCCESS",
  GET_FARM_PREDICTIONS_FAILURE: "FARMS/GET_FARM_PREDICTIONS_FAILURE",

  // Stats
  GET_FARM_STATS_REQUEST: "FARMS/GET_FARM_STATS_REQUEST",
  GET_FARM_STATS_SUCCESS: "FARMS/GET_FARM_STATS_SUCCESS",
  GET_FARM_STATS_FAILURE: "FARMS/GET_FARM_STATS_FAILURE",

  // Sensors
  GET_FARM_SENSORS_REQUEST: "FARMS/GET_FARM_SENSORS_REQUEST",
  GET_FARM_SENSORS_SUCCESS: "FARMS/GET_FARM_SENSORS_SUCCESS",
  GET_FARM_SENSORS_FAILURE: "FARMS/GET_FARM_SENSORS_FAILURE",

  // Filters and pagination
  SET_FARM_FILTERS: "FARMS/SET_FARM_FILTERS",
  CLEAR_FARM_FILTERS: "FARMS/CLEAR_FARM_FILTERS",
  SET_PAGINATION: "FARMS/SET_PAGINATION",

  // Map view
  SET_MAP_VIEW: "FARMS/SET_MAP_VIEW",
  SELECT_FARM_ON_MAP: "FARMS/SELECT_FARM_ON_MAP",

  // Bulk operations
  BULK_UPDATE_FARMS_REQUEST: "FARMS/BULK_UPDATE_FARMS_REQUEST",
  BULK_UPDATE_FARMS_SUCCESS: "FARMS/BULK_UPDATE_FARMS_SUCCESS",
  BULK_UPDATE_FARMS_FAILURE: "FARMS/BULK_UPDATE_FARMS_FAILURE",

  // Clear data
  CLEAR_FARM_DATA: "FARMS/CLEAR_FARM_DATA",
  CLEAR_SELECTED_FARM: "FARMS/CLEAR_SELECTED_FARM",
  CLEAR_ERROR: "FARMS/CLEAR_ERROR",
} as const;

export type FarmAction =
  | { type: typeof FarmActionTypes.GET_FARMS_REQUEST }
  | {
      type: typeof FarmActionTypes.GET_FARMS_SUCCESS;
      payload: { farms: Farm[]; total?: number; filters?: FarmFilters };
    }
  | { type: typeof FarmActionTypes.GET_FARMS_FAILURE; payload: string }
  | { type: typeof FarmActionTypes.GET_FARM_DETAILS_REQUEST }
  | { type: typeof FarmActionTypes.GET_FARM_DETAILS_SUCCESS; payload: Farm }
  | { type: typeof FarmActionTypes.GET_FARM_DETAILS_FAILURE; payload: string }
  | { type: typeof FarmActionTypes.CREATE_FARM_REQUEST }
  | { type: typeof FarmActionTypes.CREATE_FARM_SUCCESS; payload: Farm }
  | { type: typeof FarmActionTypes.CREATE_FARM_FAILURE; payload: string }
  | { type: typeof FarmActionTypes.UPDATE_FARM_REQUEST }
  | { type: typeof FarmActionTypes.UPDATE_FARM_SUCCESS; payload: Farm }
  | { type: typeof FarmActionTypes.UPDATE_FARM_FAILURE; payload: string }
  | { type: typeof FarmActionTypes.DELETE_FARM_REQUEST }
  | {
      type: typeof FarmActionTypes.DELETE_FARM_SUCCESS;
      payload: string | number;
    }
  | { type: typeof FarmActionTypes.DELETE_FARM_FAILURE; payload: string }
  | { type: typeof FarmActionTypes.GET_FARM_PREDICTIONS_REQUEST }
  | {
      type: typeof FarmActionTypes.GET_FARM_PREDICTIONS_SUCCESS;
      payload: { farmId: string | number; predictions: Prediction[] };
    }
  | {
      type: typeof FarmActionTypes.GET_FARM_PREDICTIONS_FAILURE;
      payload: string;
    }
  | { type: typeof FarmActionTypes.GET_FARM_STATS_REQUEST }
  | {
      type: typeof FarmActionTypes.GET_FARM_STATS_SUCCESS;
      payload: { farmId: string | number; stats: FarmStats };
    }
  | { type: typeof FarmActionTypes.GET_FARM_STATS_FAILURE; payload: string }
  | { type: typeof FarmActionTypes.GET_FARM_SENSORS_REQUEST }
  | { type: typeof FarmActionTypes.GET_FARM_SENSORS_SUCCESS; payload: Sensor[] }
  | { type: typeof FarmActionTypes.GET_FARM_SENSORS_FAILURE; payload: string }
  | {
      type: typeof FarmActionTypes.SET_FARM_FILTERS;
      payload: Partial<FarmFilters>;
    }
  | { type: typeof FarmActionTypes.CLEAR_FARM_FILTERS }
  | {
      type: typeof FarmActionTypes.SET_PAGINATION;
      payload: Partial<Pagination>;
    }
  | {
      type: typeof FarmActionTypes.SET_MAP_VIEW;
      payload: Partial<MapViewState>;
    }
  | {
      type: typeof FarmActionTypes.SELECT_FARM_ON_MAP;
      payload: string | number | undefined;
    }
  | { type: typeof FarmActionTypes.BULK_UPDATE_FARMS_REQUEST }
  | {
      type: typeof FarmActionTypes.BULK_UPDATE_FARMS_SUCCESS;
      payload: { updates: Partial<Farm>[] };
    }
  | { type: typeof FarmActionTypes.BULK_UPDATE_FARMS_FAILURE; payload: string }
  | { type: typeof FarmActionTypes.CLEAR_FARM_DATA }
  | { type: typeof FarmActionTypes.CLEAR_SELECTED_FARM }
  | { type: typeof FarmActionTypes.CLEAR_ERROR };

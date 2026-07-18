// settings-context.tsx
import React, { createContext, useContext, useReducer } from 'react';
import { AppSettings, DEFAULT_SETTINGS, SettingsState } from './settings';

interface SettingsContextType {
  state: SettingsState;
  updateSetting: (key: keyof AppSettings, value: any) => void;
  resetToDefaults: () => void;
  applyPreset: (presetId: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, {
    currentSettings: DEFAULT_SETTINGS,
    defaultSettings: DEFAULT_SETTINGS,
    isDirty: false,
    isLoading: false,
    isSaving: false,
    categories: SETTINGS_CATEGORIES,
    groups: [],
    validationErrors: {}
  });

  // ... reducer logic and actions

  return (
    <SettingsContext.Provider value={{
      state,
      updateSetting,
      resetToDefaults,
      applyPreset
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialSplash, setInitialSplash] = useState(true);

  const fetchGlobalData = async () => {
    const startTime = Date.now();
    try {
      setLoading(true);
      const [settingsRes, doctorRes, treatmentsRes] = await Promise.all([
        apiClient.get('/settings'),
        apiClient.get('/doctor'),
        apiClient.get('/treatments'),
      ]);

      if (settingsRes.data.success) {
        setSettings(settingsRes.data.data);
      }
      if (doctorRes.data.success) {
        setDoctor(doctorRes.data.data);
      }
      if (treatmentsRes.data.success) {
        setTreatments(treatmentsRes.data.data);
      }
    } catch (error) {
      console.error('Error loading clinic settings:', error);
    } finally {
      setLoading(false);
      // Ensure initial splash screen plays for at least 1400ms on first load
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 1400 - elapsed);
      setTimeout(() => {
        setInitialSplash(false);
      }, remainingTime);
    }
  };

  useEffect(() => {
    fetchGlobalData();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        doctor,
        treatments,
        loading,
        initialSplash,
        refreshSettings: fetchGlobalData,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

import React, { createContext, useState, useContext } from 'react';

// Create the Settings Context
const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext); // Custom hook to use the settings context

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    themeIndex: 0, // Default theme
    font: 'Amiri', // Default font
    fontSize: 18, // Default font size
    readingStyle: 'Normal', // Default reading style
  });

  // Function to apply the new settings
  const applySettings = (newSettings) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, applySettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

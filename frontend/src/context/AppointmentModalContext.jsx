import React, { createContext, useContext, useState } from 'react';

const AppointmentModalContext = createContext();

export const AppointmentModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialTreatment, setInitialTreatment] = useState('');

  const openModal = (treatmentName = '') => {
    setInitialTreatment(treatmentName);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setInitialTreatment('');
  };

  return (
    <AppointmentModalContext.Provider
      value={{
        isOpen,
        initialTreatment,
        openModal,
        closeModal,
      }}
    >
      {children}
    </AppointmentModalContext.Provider>
  );
};

export const useAppointmentModal = () => {
  const context = useContext(AppointmentModalContext);
  if (!context) {
    throw new Error('useAppointmentModal must be used within an AppointmentModalProvider');
  }
  return context;
};

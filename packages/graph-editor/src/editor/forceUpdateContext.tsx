import React from 'react';

const ForceUpdateCtx = React.createContext(0);

export const ForceUpdateProvider = ({ children, value }) => {
  return (
    <ForceUpdateCtx.Provider value={value}>{children}</ForceUpdateCtx.Provider>
  );
};

export const useInvalidator = () => {
  return React.useContext(ForceUpdateCtx);
};

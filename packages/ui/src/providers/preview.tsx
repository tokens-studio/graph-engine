import { createContext, useContext } from 'react';

export type IPreviewContext = {
  setCode: (code: string) => void;
};

export const PreviewContext = createContext<IPreviewContext | undefined>(
  undefined,
);

export const PreviewContextProvider = ({
  children,
  setCode,
}: {
  children: React.ReactNode;
  setCode: (code: string) => void;
}) => {
  return (
    <PreviewContext.Provider value={{ setCode }}>
      {children}
    </PreviewContext.Provider>
  );
};

export const usePreviewContext = () => {
  const context = useContext(PreviewContext);

  if (context === undefined) {
    throw new Error(
      'usePreviewContext must be used within a PreviewContextProvider',
    );
  }
  return context;
};

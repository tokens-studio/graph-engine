import { createContext, useContext } from 'react';

export type IPreviewContext = {
  code: string;
  setCode: (code: string) => void;
};

export const PreviewContext = createContext<IPreviewContext | undefined>(
  undefined,
);

export const PreviewContextProvider = ({
  children,
  code,
  setCode,
}: {
  children: React.ReactNode;
  code: string;
  setCode: (code: string) => void;
}) => {
  return (
    <PreviewContext.Provider value={{ setCode, code }}>
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

import React, { MutableRefObject } from 'react';
import { code } from '#/components/preview/scope.tsx';

type ICode = {
  code: string;
  ref?: MutableRefObject<HTMLDivElement>;
  setCode: (code: string) => void;
};

const Code = React.createContext<ICode>({ code, setCode: () => {} });

export const CodeProvider = ({ children, value }) => {
  return <Code.Provider value={value}>{children}</Code.Provider>;
};

export const useCode = () => {
  return React.useContext(Code);
};

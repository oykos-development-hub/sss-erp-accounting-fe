import React, {createContext} from 'react';
import {MicroserviceProps} from '../types/micro-service-props';

export const appContext = createContext<MicroserviceProps>({});

type AppContextProviderProps = {
  children: React.ReactNode;
  microserviceProps: Readonly<MicroserviceProps>;
};

const AppContextProvider = ({children, microserviceProps}: AppContextProviderProps) => {
  return <appContext.Provider value={microserviceProps}>{children}</appContext.Provider>;
};

export default AppContextProvider;

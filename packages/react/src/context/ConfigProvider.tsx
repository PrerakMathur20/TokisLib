import React, { createContext, useContext, ReactNode } from 'react';
import { lightTheme } from '@synu/tokens';

export type Config = {
  tokens: typeof lightTheme;
};

export interface ConfigProviderProps {
  children: ReactNode;
  config?: Partial<Config>;
}

const defaultConfig: Config = {
  tokens: lightTheme,
};

const ConfigContext = createContext<Config>(defaultConfig);

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children, config }) => {
  const resolved: Config = {
    ...defaultConfig,
    ...config,
  };
  return <ConfigContext.Provider value={resolved}>{children}</ConfigContext.Provider>;
};

export function useConfig(): Config {
  return useContext(ConfigContext);
}

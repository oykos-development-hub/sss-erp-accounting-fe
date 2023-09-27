import React, {useContext} from 'react';
import {appContext} from './accountingModuleContext';

const useAppContext = () => {
  return useContext(appContext);
};

export default useAppContext;

import React from 'react';
import {NotFound404} from './screens/404';
import {MicroserviceProps} from './types/micro-service-props';
import {AccountingOrdersMainPage} from './screens/accounting/accountingOrders';
import {FormOrderDetails} from './screens/formOrder/formOrderDetails';
import {FormOrderDetailsPreview} from './screens/formOrder/formOrderDetailsPreview';
import ACCOUNTING from './screens/landing';
import {ContractsMainPage} from './screens/contracts/contractsOverview';
import useAppContext from './context/useAppContext';
import {ContractDetailsSigned} from './screens/contracts/contractDetails';

const FormOrderDetailsPreviewRegex = /^\/accounting\/[^/]+\/order-form\/[^/]+\/order-details/;
const FormOrderDetailsRegex = /^\/accounting\/[^/]+\/order-form\/[^/]+/;
const ContractDetailsRegex = /^\/accounting\/contracts\/\d+\/contract-details$/;
export const Router: React.FC<MicroserviceProps> = () => {
  const {
    navigation: {
      location: {pathname},
    },
  } = useAppContext();

  const renderScreen = () => {
    if (pathname === '/accounting') return <ACCOUNTING />;
    if (pathname === '/accounting/order-form') return <AccountingOrdersMainPage />;
    if (pathname === '/accounting/contracts') return <ContractsMainPage />;
    if (FormOrderDetailsPreviewRegex.test(pathname)) return <FormOrderDetailsPreview />;
    if (FormOrderDetailsRegex.test(pathname)) return <FormOrderDetails />;
    if (ContractDetailsRegex.test(pathname)) return <ContractDetailsSigned />;

    return <NotFound404 />;
  };

  return renderScreen();
};

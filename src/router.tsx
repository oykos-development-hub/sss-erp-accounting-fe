import React from 'react';
import {NotFound404} from './screens/404';
import {AccountingOrdersMainPage} from './screens/accounting/accountingOrders';
import {FormOrderDetails} from './screens/formOrder/formOrderDetails';
import {FormOrderDetailsPreview} from './screens/formOrder/formOrderDetailsPreview';
import {ContractsMainPage} from './screens/contracts/contractsOverview';
import useAppContext from './context/useAppContext';
import {ContractDetailsSigned} from './screens/contracts/contractDetails';
import {MicroserviceProps} from './types/micro-service-props';
import {StockScreen} from './screens/stockOverview/stockOverview';
import MovementDetails from './screens/stockOverview/movementDetails';
import {Exceptions} from './screens/exceptions/exceptions';
import {LandingPage} from './screens/landingPage/landingPage';
import AccountingReports from './screens/reports/reports';

const FormOrderDetailsPreviewRegex = /^\/accounting\/[^/]+\/order-form\/[^/]+\/order-details/;
const FormOrderDetailsRegex = /^\/accounting\/order-form\/(\d+)$/;
const ContractDetailsRegex = /^\/accounting\/contracts\/\d+\/contract-details$/;
const MovementDetailsRegex = /^\/accounting\/stock\/\d+\/movement$/;
const ExceptionsRegex = /^\/accounting\/order-form\/exceptions\/(\d+)$/;

export const Router: React.FC<MicroserviceProps> = () => {
  const {
    navigation: {
      location: {pathname},
    },
  } = useAppContext();

  const renderScreen = () => {
    if (pathname === '/accounting') return <LandingPage />;
    if (pathname === '/accounting/order-form') return <AccountingOrdersMainPage />;
    if (pathname === '/accounting/contracts') return <ContractsMainPage />;
    if (FormOrderDetailsPreviewRegex.test(pathname)) return <FormOrderDetailsPreview />;
    if (FormOrderDetailsRegex.test(pathname)) return <FormOrderDetails />;
    if (ContractDetailsRegex.test(pathname)) return <ContractDetailsSigned />;
    if (pathname === '/accounting/stock') return <StockScreen />;
    if (MovementDetailsRegex.test(pathname)) return <MovementDetails />;
    if (ExceptionsRegex.test(pathname)) return <Exceptions />;
    if (pathname === '/accounting/reports') return <AccountingReports />;

    return <NotFound404 />;
  };

  return renderScreen();
};

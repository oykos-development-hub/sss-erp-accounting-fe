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
import {checkRoutePermissions} from './services/checkRoutePermissions.ts';

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
    contextMain,
  } = useAppContext();
  const allowedRoutes = checkRoutePermissions(contextMain?.permissions);

  const renderScreen = () => {
    if (pathname === '/accounting' && allowedRoutes.includes('/accounting')) return <LandingPage />;
    if (pathname === '/accounting/order-form' && allowedRoutes.includes('/accounting/order-form'))
      return <AccountingOrdersMainPage />;
    if (pathname === '/accounting/contracts' && allowedRoutes.includes('/accounting/contracts'))
      return <ContractsMainPage />;
    if (FormOrderDetailsPreviewRegex.test(pathname) && allowedRoutes.includes('/accounting/order-form'))
      return <FormOrderDetailsPreview />;
    if (FormOrderDetailsRegex.test(pathname) && allowedRoutes.includes('/accounting/order-form'))
      return <FormOrderDetails />;
    if (ContractDetailsRegex.test(pathname) && allowedRoutes.includes('/accounting/contracts'))
      return <ContractDetailsSigned />;
    if (pathname === '/accounting/stock' && allowedRoutes.includes('/accounting/stock')) return <StockScreen />;
    if (pathname === '/accounting/movement' && allowedRoutes.includes('/accounting/stock')) return <StockScreen />;
    if (MovementDetailsRegex.test(pathname) && allowedRoutes.includes('/accounting/stock')) return <MovementDetails />;
    if (ExceptionsRegex.test(pathname) && allowedRoutes.includes('/accounting/order-form')) return <Exceptions />;
    if (pathname === '/accounting/reports' && allowedRoutes.includes('/accounting/reports'))
      return <AccountingReports />;

    return <NotFound404 />;
  };

  return renderScreen();
};

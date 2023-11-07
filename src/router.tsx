import React from 'react';
import {NotFound404} from './screens/404';
import {MicroserviceProps} from './types/micro-service-props';
import {AccountingOrdersMainPage} from './screens/accounting/accountingOrders';
import {FormOrderDetails} from './screens/formOrder/formOrderDetails';
import {FormOrderDetailsPreview} from './screens/formOrder/formOrderDetailsPreview';
import ACCOUNTING from './screens/landing';

const FormOrderDetailsPreviewRegex = /^\/accounting\/[^/]+\/order-form\/[^/]+\/order-details/;
const FormOrderDetailsRegex = /^\/accounting\/[^/]+\/order-form\/[^/]+/;

export const Router: React.FC<MicroserviceProps> = props => {
  const pathname = props?.navigation?.location?.pathname;
  const context = Object.freeze({
    ...props,
  });

  const renderScreen = () => {
    if (pathname === '/accounting') return <ACCOUNTING />;
    if (pathname === '/accounting/order-form') return <AccountingOrdersMainPage context={context} />;
    if (FormOrderDetailsPreviewRegex.test(pathname)) return <FormOrderDetailsPreview context={context} />;
    if (FormOrderDetailsRegex.test(pathname)) return <FormOrderDetails context={context} />;

    return <NotFound404 context={context} />;
  };

  return renderScreen();
};

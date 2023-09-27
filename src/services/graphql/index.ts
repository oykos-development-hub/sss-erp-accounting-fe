import {BFF_URL} from '../constants';
import {getEnvironment} from '../get-environment';
import getSuppliers from './suppliers/queries/getSuppliers';
import getPlans from './plans/queries/getPlans';
import orderListMovement from './orders/mutations/orderListMovement';
import orderListInsert from './orders/mutations/orderListInsert';
import orderListReceive from './orders/mutations/orderListReceive';
import getOrderList from './orders/queries/getOrderList';
import getOrderProcurementAvailableArticles from './orders/queries/getOrderProcurementAvailableArticles';
import deleteOrderList from './orders/mutations/orderListDelete';
import getOfficesOfOrganizationUnits from './officesOfOrganisationUnit/queries/getOfficesOfOrganizationUnitsOverview';
import OrderListAssetMovementMutation from './movement/mutations/orderListMovement';
import getRecipientUsersOverview from './recipientUsersOverview/queries/getRecipientUsersOverview';
import deleteOrderListAssetMovement from './movement/mutations/orderListMovementDelete';
import deleteOrderListReceive from './orders/mutations/orderListReceiveDelete';

export const GraphQL = {
  fetch: (query: string, variables?: any): Promise<any> => {
    return fetch(BFF_URL[getEnvironment()], {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query, variables}),
    })
      .then(response => response.json())
      .catch(error => console.error(error));
  },
  // getAccountingOverview: getAccountingOverview,
  getPlans: getPlans,
  getSuppliers: getSuppliers,
  getOrderList: getOrderList,
  getOrderProcurementAvailableArticles: getOrderProcurementAvailableArticles,
  orderListMovement: orderListMovement,
  orderListInsert: orderListInsert,
  orderListReceive: orderListReceive,
  deleteOrderList: deleteOrderList,
  getOfficesOfOrganizationUnits: getOfficesOfOrganizationUnits,
  OrderListAssetMovementMutation: OrderListAssetMovementMutation,
  getRecipientUsersOverview: getRecipientUsersOverview,
  deleteOrderListAssetMovement: deleteOrderListAssetMovement,
  deleteOrderListReceive: deleteOrderListReceive,
};

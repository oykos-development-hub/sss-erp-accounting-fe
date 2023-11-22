import deleteMovement from './movement/mutations/deleteMovement';
import insertMovement from './movement/mutations/insertMovement';
import movementDetails from './movement/query/getMovementDetails';
import movementOverview from './movement/query/getMovementOverview';
import deleteOrderList from './orders/mutations/deleteOrderList';
import deleteOrderListReceive from './orders/mutations/deleteOrderListReceive';
import insertOrderList from './orders/mutations/insertOrderList';
import orderListMovement from './orders/mutations/orderListMovement';
import receiveOrderList from './orders/mutations/receiveOrderList';
import getOrderList from './orders/queries/getOrderList';
import getOrderProcurementAvailableArticles from './orders/queries/getOrderProcurementAvailableArticles';
import getPlans from './plans/queries/getPlans';
import getRecipientUsers from './recipientUsersOverview/queries/getRecipientUsers';
import getStockOverview from './stock/query/getStockOverview';

export const GraphQL = {
  // getAccountingOverview: getAccountingOverview,
  getPlans: getPlans,
  getOrderList: getOrderList,
  getOrderProcurementAvailableArticles: getOrderProcurementAvailableArticles,
  orderListMovement: orderListMovement,
  insertOrderList: insertOrderList,
  receiveOrderList: receiveOrderList,
  deleteOrderList: deleteOrderList,
  insertMovement: insertMovement,
  movementOverview: movementOverview,
  movementDetails: movementDetails,
  getRecipientUsers: getRecipientUsers,
  deleteMovement: deleteMovement,
  deleteOrderListReceive: deleteOrderListReceive,
  getStockOverview: getStockOverview,
};

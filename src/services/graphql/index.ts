import getPlans from './plans/queries/getPlans';
import orderListMovement from './orders/mutations/orderListMovement';
import insertOrderList from './orders/mutations/insertOrderList';
import receiveOrderList from './orders/mutations/receiveOrderList';
import getOrderList from './orders/queries/getOrderList';
import getOrderProcurementAvailableArticles from './orders/queries/getOrderProcurementAvailableArticles';
import deleteOrderList from './orders/mutations/deleteOrderList';
import OrderListAssetMovementMutation from './movement/mutations/orderListMovement';
import getRecipientUsers from './recipientUsersOverview/queries/getRecipientUsers';
import deleteOrderListAssetMovement from './movement/mutations/deleteOrderListMovement';
import deleteOrderListReceive from './orders/mutations/deleteOrderListReceive';

export const GraphQL = {
  // getAccountingOverview: getAccountingOverview,
  getPlans: getPlans,
  getOrderList: getOrderList,
  getOrderProcurementAvailableArticles: getOrderProcurementAvailableArticles,
  orderListMovement: orderListMovement,
  insertOrderList: insertOrderList,
  receiveOrderList: receiveOrderList,
  deleteOrderList: deleteOrderList,
  OrderListAssetMovementMutation: OrderListAssetMovementMutation,
  getRecipientUsers: getRecipientUsers,
  deleteOrderListAssetMovement: deleteOrderListAssetMovement,
  deleteOrderListReceive: deleteOrderListReceive,
};

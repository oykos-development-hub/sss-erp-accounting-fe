import getPlans from './plans/queries/getPlans';
import orderListMovement from './orders/mutations/orderListMovement';
import orderListInsert from './orders/mutations/orderListInsert';
import orderListReceive from './orders/mutations/orderListReceive';
import getOrderList from './orders/queries/getOrderList';
import getOrderProcurementAvailableArticles from './orders/queries/getOrderProcurementAvailableArticles';
import deleteOrderList from './orders/mutations/orderListDelete';
import OrderListAssetMovementMutation from './movement/mutations/orderListMovement';
import getRecipientUsersOverview from './recipientUsersOverview/queries/getRecipientUsersOverview';
import deleteOrderListAssetMovement from './movement/mutations/orderListMovementDelete';
import deleteOrderListReceive from './orders/mutations/orderListReveiveDelete';
import useAppContext from '../../context/useAppContext';

export const GraphQL = {
  // getAccountingOverview: getAccountingOverview,
  getPlans: getPlans,
  getOrderList: getOrderList,
  getOrderProcurementAvailableArticles: getOrderProcurementAvailableArticles,
  orderListMovement: orderListMovement,
  orderListInsert: orderListInsert,
  orderListReceive: orderListReceive,
  deleteOrderList: deleteOrderList,
  OrderListAssetMovementMutation: OrderListAssetMovementMutation,
  getRecipientUsersOverview: getRecipientUsersOverview,
  deleteOrderListAssetMovement: deleteOrderListAssetMovement,
  deleteOrderListReceive: deleteOrderListReceive,
};

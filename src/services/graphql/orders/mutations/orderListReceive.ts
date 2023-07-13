import {GraphQL} from '../..';
import {OrderListReceiveParams, OrderListReceiveResponse} from '../../../../types/graphql/orderListTypes';

const orderListReceive = async (
  data: OrderListReceiveParams,
): Promise<OrderListReceiveResponse['data']['orderList_Receive']> => {
  const response = await GraphQL.fetch(`mutation {
    orderList_Receive(data: {
        order_id: ${data.order_id},
        date_system: "${data.date_system}",
        invoice_date: "${data.invoice_date}",
        invoice_number: "${data.invoice_number}",
        description_receive: "${data.description_receive}",
      }
      ) {
        message
        status
      }
    }`);
  return response?.data?.orderList_Receive || {};
};

export default orderListReceive;

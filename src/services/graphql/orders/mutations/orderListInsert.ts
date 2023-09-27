import {GraphQL} from '../..';
import {OrderListInsertParams, OrderListInsertResponse} from '../../../../types/graphql/orderListTypes';

const orderListInsert = async (
  data: OrderListInsertParams,
): Promise<OrderListInsertResponse['data']['orderList_Insert']> => {
  const mutation = `mutation($data: OrderListInsertMutation!) {
    orderList_Insert(data: $data) {
        status 
        message
        data
        item {
            id
            date_order
            total_price
            public_procurement {
                id
                title
            }
            supplier {
                id
                title
            }
            status
            articles {
                id
                title
                description
                manufacturer
                unit
                available
                amount
                total_price
            }
        }
    }
}`;
  const response = await GraphQL.fetch(mutation, {data});
  return response?.data?.orderList_Insert || {};
};

export default orderListInsert;

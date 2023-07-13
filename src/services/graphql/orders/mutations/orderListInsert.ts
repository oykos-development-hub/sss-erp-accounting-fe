import {GraphQL} from '../..';
import {OrderListInsertParams, OrderListInsertResponse} from '../../../../types/graphql/orderListTypes';

const orderListInsert = async (
  data: OrderListInsertParams,
): Promise<OrderListInsertResponse['data']['orderList_Insert']> => {
  const arr = data.articles.map(
    item => `{
      id: ${item.id},
      amount: ${item.amount}
    }`,
  );
  const response = await GraphQL.fetch(`mutation {
    orderList_Insert(data: {
        id: ${data.id},
        date_order: "${data.date_order}",
        public_procurement_id: ${data.public_procurement_id},
        articles: [${arr}]
      }
      ) {
        status 
        message 
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
    }`);
  return response?.data?.orderList_Insert || {};
};

export default orderListInsert;

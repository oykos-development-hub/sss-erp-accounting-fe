import {GraphQL} from '../..';
import {OrderListResponse} from '../../../../types/graphql/orderListTypes';

const getOrderList = async (
  page: number,
  size: number,
  id: number,
  supplier_id: number,
  status: string,
  search: string,
): Promise<OrderListResponse['data']['orderList_Overview']> => {
  const response = await GraphQL.fetch(`query {
    orderList_Overview(page: ${page},size: ${size},id: ${id},supplier_id: ${supplier_id},status: "${status}",search: "${search}") {
      status 
      message
      total 
      items {
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
          amount
          total_price
        }
        invoice_date
        invoice_number
        date_system
        description_receive
        recipient_user{
          id
          title
        }
        office {
          id
          title
        }
      }
    }
}`);

  return response?.data?.orderList_Overview || {};
};

export default getOrderList;

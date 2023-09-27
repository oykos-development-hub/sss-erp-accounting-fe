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
  const query = `query OrderListOverview($page: Int, $size: Int, $id: Int, $supplier_id: Int, $status: String, $search: String) {
    orderList_Overview(page: $page, size: $size, id: $id, supplier_id: $supplier_id, status: $status, search: $search) {
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
}`;
  const response = await GraphQL.fetch(query, {page, size, id, supplier_id, status, search});
  return response?.data?.orderList_Overview || {};
};

export default getOrderList;

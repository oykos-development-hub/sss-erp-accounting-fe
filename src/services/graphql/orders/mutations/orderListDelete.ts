import {GraphQL} from '../..';
import {OrderListDeleteResponse} from '../../../../types/graphql/orderListTypes';

const deleteOrderList = async (id: number): Promise<OrderListDeleteResponse['data']['orderList_Delete']> => {
  const response = await GraphQL.fetch(`mutation {
    orderList_Delete(id: ${id}) {
        message
        status
    }
}`);

  return response?.data?.orderList_Delete || {};
};

export default deleteOrderList;

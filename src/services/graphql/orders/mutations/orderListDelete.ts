import {GraphQL} from '../..';
import {OrderListDeleteResponse} from '../../../../types/graphql/orderListTypes';

const deleteOrderList = async (id: number): Promise<OrderListDeleteResponse['data']['orderList_Delete']> => {
  const mutation = `mutation($id: Int!) {
    orderList_Delete(id: $id) {
        message
        status
    }
}`;

  const response = await GraphQL.fetch(mutation, {id});

  return response?.data?.orderList_Delete || {};
};

export default deleteOrderList;

import {GraphQL} from '../..';
import {OrderProcurementAvailableArticlesResponse} from '../../../../types/graphql/orderListTypes';

const getOrderProcurementAvailableArticles = async (
  public_procurement_id: number,
): Promise<OrderProcurementAvailableArticlesResponse['data']['orderProcurementAvailableList_Overview']> => {
  const response = await GraphQL.fetch(`query {
    orderProcurementAvailableList_Overview(public_procurement_id: ${public_procurement_id}) {
      status 
      message
      total 
      items {        
        id
        title
        description
        manufacturer
        unit
        available
        total_price
      }
    }
}`);

  return response?.data?.orderProcurementAvailableList_Overview || {};
};

export default getOrderProcurementAvailableArticles;

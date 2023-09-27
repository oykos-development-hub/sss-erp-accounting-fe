import {GraphQL} from '../..';
import {OrderProcurementAvailableArticlesResponse} from '../../../../types/graphql/orderListTypes';

const getOrderProcurementAvailableArticles = async (
  public_procurement_id: number,
): Promise<OrderProcurementAvailableArticlesResponse['data']['orderProcurementAvailableList_Overview']> => {
  const query = `query OrderProcurementAvailableListOverview($public_procurement_id: Int) {
    orderProcurementAvailableList_Overview(public_procurement_id: $public_procurement_id) {
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
}`;
  const response = await GraphQL.fetch(query, {public_procurement_id});

  return response?.data?.orderProcurementAvailableList_Overview || {};
};

export default getOrderProcurementAvailableArticles;

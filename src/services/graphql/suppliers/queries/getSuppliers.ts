import {GraphQL} from '../../';
import {SuppliersOverviewResponse} from '../../../../types/graphql/supplierTypes';

const getSuppliers = async (
  id: number,
  search?: string,
): Promise<SuppliersOverviewResponse['data']['suppliers_Overview']> => {
  const response = await GraphQL.fetch(`
    query {
      suppliers_Overview(id: ${id}, search: "${search}") {
        message
        status
        total
        items {
          id
          title
          abbreviation
          official_id
          address
          description
          folder_id
        }
      }
    }
  `);
  return response?.data?.suppliers_Overview || {};
};

export default getSuppliers;

import {GraphQL} from '../../';
import {SuppliersOverviewParams, SuppliersOverviewResponse} from '../../../../types/graphql/supplierTypes';

const getSuppliers = async ({
  id,
  search,
  page,
  size,
}: SuppliersOverviewParams): Promise<SuppliersOverviewResponse['data']['suppliers_Overview']> => {
  const query = `query Suppliers($id: Int, $search: String, $page: Int, $size: Int) {
    suppliers_Overview(id: $id, search: $search, page: $page, size: $size) {
        status 
        message
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
}`;
  const response = await GraphQL.fetch(query, {id, search, page, size});
  return response?.data?.suppliers_Overview || {};
};

export default getSuppliers;

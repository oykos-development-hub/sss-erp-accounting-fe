import {GraphQL} from '../../';
import {OfficesOfOrganizationUnitsOverviewResponse} from '../../../../types/graphql/officesOfOrganizationUnitsOverviewTypes';

const getOfficesOfOrganizationUnits = async (
  id: number,
  organization_unit_id: number,
  search: string,
): Promise<OfficesOfOrganizationUnitsOverviewResponse['data']['officesOfOrganizationUnits_Overview']> => {
  const query = `query OfficesOfOrganizationUnitsOverview( $id: Int, $organization_unit_id: Int, $search: String) {
    officesOfOrganizationUnits_Overview( id: $id, organization_unit_id: $organization_unit_id, search: $search) {
        status 
        message
        total 
        items {
            id
            title
            organization_unit {
                id
                title
            }
            abbreviation
            description
            color
            icon
        }
    }
}`;

  const response = await GraphQL.fetch(query, {id, organization_unit_id, search});
  return response?.data?.officesOfOrganizationUnits_Overview || {};
};

export default getOfficesOfOrganizationUnits;

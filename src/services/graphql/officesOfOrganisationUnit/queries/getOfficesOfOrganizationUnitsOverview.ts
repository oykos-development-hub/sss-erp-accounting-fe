import {GraphQL} from '../../';
import {OfficesOfOrganizationUnitsOverviewResponse} from '../../../../types/graphql/officesOfOrganizationUnitsOverviewTypes';

const getOfficesOfOrganizationUnits = async (
  id: number,
  organization_unit_id: number,
  search: string,
): Promise<OfficesOfOrganizationUnitsOverviewResponse['data']['officesOfOrganizationUnits_Overview']> => {
  const response = await GraphQL.fetch(`
    query {
      officesOfOrganizationUnits_Overview(id: ${id}, organization_unit_id: ${organization_unit_id}, search: "${search}") {
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
    }
  `);
  return response?.data?.officesOfOrganizationUnits_Overview || {};
};

export default getOfficesOfOrganizationUnits;

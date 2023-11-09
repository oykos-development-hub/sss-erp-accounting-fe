import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {
  OfficesOfOrganizationUnits,
  OfficesOfOrganizationUnitsTypeResponse,
} from '../../../../types/graphql/officesOfOrganizationUnitsOverviewTypes';
import useAppContext from '../../../../context/useAppContext';

const useGetOfficesOfOrganizationUnits = (id: number, organization_unit_id: number, search: string) => {
  const [officesOfOrganizationUnits, setOfficesOfOrganizationUnits] = useState<OfficesOfOrganizationUnits[]>();
  const [loading, setLoading] = useState(true);
  const {fetch, graphQl} = useAppContext();

  const fetchOfficesOfOrganizationUnits = async (id: number, organization_unit_id: number, search: string) => {
    const response: OfficesOfOrganizationUnitsTypeResponse['get'] = await fetch(graphQl.getOffices, {
      id,
      organization_unit_id,
      search,
    });
    if (response) {
      const items = response.officesOfOrganizationUnits_Overview.items;
      setOfficesOfOrganizationUnits(items);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOfficesOfOrganizationUnits(id, organization_unit_id, search);
  }, [id, organization_unit_id, search]);

  return {officesOfOrganizationUnits, loading, fetch: fetchOfficesOfOrganizationUnits};
};

export default useGetOfficesOfOrganizationUnits;

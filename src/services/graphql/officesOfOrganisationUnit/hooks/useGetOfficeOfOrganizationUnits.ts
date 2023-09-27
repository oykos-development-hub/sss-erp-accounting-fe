import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {OfficesOfOrganizationUnits} from '../../../../types/graphql/officesOfOrganizationUnitsOverviewTypes';

const useGetOfficesOfOrganizationUnits = () => {
  const [officesOfOrganizationUnits, setOfficesOfOrganizationUnits] = useState<OfficesOfOrganizationUnits[]>();
  const [loading, setLoading] = useState(false);

  const fetchOfficesOfOrganizationUnits = async (id: number, organization_unit_id: number, search: string) => {
    setLoading(true);

    const response = await GraphQL.getOfficesOfOrganizationUnits(id, organization_unit_id, search);
    if (response) {
      const items = response.items;
      setOfficesOfOrganizationUnits(items);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOfficesOfOrganizationUnits(0, 0, '');
  }, []);

  return {officesOfOrganizationUnits, loading, fetch: fetchOfficesOfOrganizationUnits};
};

export default useGetOfficesOfOrganizationUnits;

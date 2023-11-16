import {useEffect, useState} from 'react';
import useAppContext from '../../../../context/useAppContext';
import {OrganizationUnit, OrganizationUnitsResponse} from '../../../../types/graphql/organizationUnitsTypes';

const useGetOrganizationUnits = (data?: any) => {
  const [items, setItems] = useState<OrganizationUnit[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    fetch,
    graphQl: {getOrganizationUnits},
  } = useAppContext();

  const fetchOrganizationUnits = async () => {
    setLoading(true);

    const response: OrganizationUnitsResponse = await fetch(getOrganizationUnits, data);

    if (response.organizationUnits) {
      setItems(response.organizationUnits.items);
      setTotal(response.organizationUnits.total ?? 0);
    }

    setLoading(false);
  };

  const organizationUnits = items.filter(unit => !unit.parent_id);

  useEffect(() => {
    fetchOrganizationUnits();
  }, [data]);

  return {
    organizationUnits: organizationUnits,
    refetch: fetchOrganizationUnits,
    total,
    loading,
  };
};

export default useGetOrganizationUnits;

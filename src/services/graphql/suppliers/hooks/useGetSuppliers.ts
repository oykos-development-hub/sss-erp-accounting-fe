import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {Supplier, SuppliersOverviewParams} from '../../../../types/graphql/supplierTypes';

const useGetSuppliers = ({id, search, page, size}: SuppliersOverviewParams) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuppliers = async () => {
    setLoading(true);

    const response = await GraphQL.getSuppliers({id, search, page, size});
    setSuppliers(response.items as Supplier[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, [search]);

  return {data: suppliers, loading, refetch: fetchSuppliers};
};

export default useGetSuppliers;

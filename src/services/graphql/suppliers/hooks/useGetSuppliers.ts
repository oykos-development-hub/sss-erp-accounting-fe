import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {GetSupplier, Supplier} from '../../../../types/graphql/supplierTypes';

const useGetSuppliers = ({id, search}: GetSupplier) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = async () => {
    const response = await GraphQL.getSuppliers(id, search);
    setSuppliers(response.items as Supplier[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, [search]);

  return {data: suppliers, loading, refetch: fetchSuppliers};
};

export default useGetSuppliers;

import {useEffect, useState} from 'react';
import {GetSupplier, Supplier, SuppliersType} from '../../../../types/graphql/supplierTypes';
import useAppContext from '../../../../context/useAppContext';

const useGetSuppliers = ({id, search}: GetSupplier) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch, graphQl} = useAppContext();
  const fetchSuppliers = async () => {
    const response: SuppliersType['get'] = await fetch(graphQl.getSuppliersOverview, {id, search});
    setSuppliers(response.suppliers_Overview.items as Supplier[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, [search]);

  return {data: suppliers, loading, refetch: fetchSuppliers};
};

export default useGetSuppliers;

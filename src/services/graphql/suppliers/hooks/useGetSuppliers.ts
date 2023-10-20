import {useEffect, useState} from 'react';
import {GetSupplierParams, Supplier, SuppliersResponse} from '../../../../types/graphql/supplierTypes';
import useAppContext from '../../../../context/useAppContext';

const useGetSuppliers = ({id, search, page, size}: GetSupplierParams) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const {fetch, graphQl} = useAppContext();
  const fetchSuppliers = async () => {
    const response: SuppliersResponse['get'] = await fetch(graphQl.getSuppliersOverview, {id, search, page, size});
    setSuppliers(response?.suppliers_Overview?.items);
    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, [id, search, page, size]);

  return {suppliers, loading, refetch: fetchSuppliers};
};

export default useGetSuppliers;

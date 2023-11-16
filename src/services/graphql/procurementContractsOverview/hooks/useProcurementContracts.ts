import {useEffect, useState} from 'react';
import {
  GetProcurementContractParams,
  ProcurementContract,
  ProcurementContractsGetResponse,
} from '../../../../types/graphql/procurementContractsTypes';
import query from '../queries/getProcurementContracts';
import useAppContext from '../../../../context/useAppContext';
import {REQUEST_STATUSES} from '../../../constants';

const useProcurementContracts = ({id, procurement_id, supplier_id}: GetProcurementContractParams) => {
  const [procurementContracts, setProcurementContracts] = useState<ProcurementContract[]>();
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchProcurementContracts = async () => {
    const response: ProcurementContractsGetResponse = await fetch(query, {
      id,
      procurement_id,
      supplier_id,
    });

    if (response.publicProcurementContracts_Overview.status === REQUEST_STATUSES.success) {
      setProcurementContracts(response?.publicProcurementContracts_Overview.items);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcurementContracts();
  }, [id, procurement_id, supplier_id]);

  return {data: procurementContracts, loading, refetchData: fetchProcurementContracts};
};

export default useProcurementContracts;

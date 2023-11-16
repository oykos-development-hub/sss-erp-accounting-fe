import {useState} from 'react';
import {REQUEST_STATUSES} from '../../../constants';
import {
  ProcurementContractInsert,
  ProcurementContractsInsertResponse,
} from '../../../../types/graphql/procurementContractsTypes';
import useAppContext from '../../../../context/useAppContext';
import mutation from '../mutations/insertContract';

const useInsertProcurementContract = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertContract = async (
    data: ProcurementContractInsert,
    onSuccess?: (id: number) => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    const response: ProcurementContractsInsertResponse = await fetch(mutation, {data});

    if (response.publicProcurementContracts_Insert.status === REQUEST_STATUSES.success) {
      const contractID = response?.publicProcurementContracts_Insert.item?.id;
      onSuccess && onSuccess(contractID);
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertContract};
};

export default useInsertProcurementContract;

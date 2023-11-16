import {useState} from 'react';
import {REQUEST_STATUSES} from '../../../constants';
import useAppContext from '../../../../context/useAppContext';
import mutation from '../mutations/deletePublicProcurementPlanItem';
import {ProcurementPlanItemDetailsDeleteResponse} from '../../../../types/graphql/publicProcurementPlanItemDetailsTypes';

const useDeletePublicProcurementPlanItem = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deletePublicProcurementPlanItem = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: ProcurementPlanItemDetailsDeleteResponse = await fetch(mutation, {id});

    if (response.publicProcurementPlanItem_Delete.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deletePublicProcurementPlanItem};
};

export default useDeletePublicProcurementPlanItem;

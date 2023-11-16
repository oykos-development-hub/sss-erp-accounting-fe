import {useState} from 'react';
import {REQUEST_STATUSES} from '../../../constants';
import useAppContext from '../../../../context/useAppContext';
import {PublicProcurementContractArticleOverageDeleteResponse} from '../../../../types/graphql/publicProcurementContractArticleOverageTypes';
import publicProcurementContractArticleOverage_Delete from '../mutations/deletePublicProcurementContractArticleOverage';

const useDeletePublicProcurementContractArticleOverage = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deletePublicProcurementContractArticleOverage = async (
    id: number,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    const response: PublicProcurementContractArticleOverageDeleteResponse = await fetch(
      publicProcurementContractArticleOverage_Delete,
      {id},
    );

    if (response.publicProcurementContractArticleOverage_Delete.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deletePublicProcurementContractArticleOverage};
};

export default useDeletePublicProcurementContractArticleOverage;

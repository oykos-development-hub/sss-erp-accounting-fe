import {useState} from 'react';
import useAppContext from '../../../../context/useAppContext';
import {
  PublicProcurementContractArticleOverageInsert,
  PublicProcurementContractArticleOverageInsertResponse,
} from '../../../../types/graphql/publicProcurementContractArticleOverageTypes';
import {REQUEST_STATUSES} from '../../../constants';
import PublicProcurementContractArticleOverageInsertMutation from '../mutations/insertPublicProcurementContractArticleOverage';

const useInsertPublicProcurementContractArticleOverage = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertPublicProcurementContractArticleOverage = async (
    data: PublicProcurementContractArticleOverageInsert,
    onSuccess?: (item: PublicProcurementContractArticleOverageInsert) => void,
    onError?: (message: string) => void,
  ) => {
    setLoading(true);
    const response: PublicProcurementContractArticleOverageInsertResponse = await fetch(
      PublicProcurementContractArticleOverageInsertMutation,
      {data},
    );
    if (response.publicProcurementContractArticleOverage_Insert.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess(response.publicProcurementContractArticleOverage_Insert.item);
    } else {
      onError && onError(response.publicProcurementContractArticleOverage_Insert.message);
    }
    setLoading(false);
  };

  return {loading, mutate: insertPublicProcurementContractArticleOverage};
};

export default useInsertPublicProcurementContractArticleOverage;

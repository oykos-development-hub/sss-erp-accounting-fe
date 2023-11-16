import {useState} from 'react';
import {REQUEST_STATUSES} from '../../../constants';
import {ContractArticleInsert, ContractArticlesInsertResponse} from '../../../../types/graphql/contractsArticlesTypes';
import useAppContext from '../../../../context/useAppContext';
import insertContractArticleMutation from '../mutations/insertContractArticle';

const useInsertContractArticle = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertContractArticle = async (data: ContractArticleInsert, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: ContractArticlesInsertResponse = await fetch(insertContractArticleMutation, {data});

    if (response.publicProcurementContractArticle_Insert.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertContractArticle};
};

export default useInsertContractArticle;

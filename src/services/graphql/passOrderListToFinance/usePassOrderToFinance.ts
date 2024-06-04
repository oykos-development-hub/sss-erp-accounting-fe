import {useState} from 'react';
import {REQUEST_STATUSES} from '../../constants';
import useAppContext from '../../../context/useAppContext';
import {GraphQL} from '..';

const usePassOrderToFinance = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const passOrderToFinance = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await fetch(GraphQL.passOrderListToFinance, {id});

    if (response.passOrderListToFinance?.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, passOrderToFinance};
};

export default usePassOrderToFinance;

import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import {MovementParams, MovementTypeResponse} from '../../../../types/graphql/movementTypes';
import useAppContext from '../../../../context/useAppContext';

const useInsertMovement = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const InsertMonvement = async (data: MovementParams, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: MovementTypeResponse['insert'] = await fetch(GraphQL.insertMovement, {
      data,
    });
    if (response?.movement_Insert.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: InsertMonvement};
};

export default useInsertMovement;

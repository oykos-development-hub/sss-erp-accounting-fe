import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import useAppContext from '../../../../context/useAppContext';
import {MovementTypeResponse} from '../../../../types/graphql/movementTypes';

const useDeleteMovement = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteMovement = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: MovementTypeResponse['delete'] = await fetch(GraphQL.deleteMovement, {
      id,
    });

    if (response.movement_Delete.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteMovement};
};

export default useDeleteMovement;

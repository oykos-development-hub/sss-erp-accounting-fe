import {useEffect, useState} from 'react';
import {MovementDetailsItems, MovementTypeResponse} from '../../../../types/graphql/movementTypes';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {REQUEST_STATUSES} from '../../../constants';

const useGetMovementDetails = (id: number) => {
  const [movementDetailsItems, setMovementDetailsItems] = useState<MovementDetailsItems>();
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchMovementDetails = async () => {
    const response: MovementTypeResponse['get_details'] = await fetch(GraphQL.movementDetails, {id});
    if (response.movement_Details.status === REQUEST_STATUSES.success) {
      const items = response.movement_Details.items;
      setMovementDetailsItems(items);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovementDetails();
  }, []);

  return {movementDetailsItems, loading, fetch: fetchMovementDetails};
};

export default useGetMovementDetails;

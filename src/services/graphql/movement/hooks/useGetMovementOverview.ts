import {useEffect, useState} from 'react';
import useAppContext from '../../../../context/useAppContext';
import {GraphQL} from '../..';
import {MovementItems, MovementTypeResponse} from '../../../../types/graphql/movementTypes';

const useGetMovementOverview = (office_id: number | null, recipient_user_id: number | null) => {
  const [movementItems, setMovementItems] = useState<MovementItems[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchMovement = async () => {
    const response: MovementTypeResponse['get'] = await fetch(GraphQL.movementOverview, {office_id, recipient_user_id});
    if (response) {
      const items = response.movement_Overview.items;
      setMovementItems(items);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovement();
  }, [office_id, recipient_user_id]);

  return {movementItems, loading, fetch: fetchMovement};
};

export default useGetMovementOverview;

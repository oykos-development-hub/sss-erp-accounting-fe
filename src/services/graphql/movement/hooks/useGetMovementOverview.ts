import {useEffect, useState} from 'react';
import useAppContext from '../../../../context/useAppContext';
import {GraphQL} from '../..';
import {GetMovementOverviewParams, MovementItems, MovementTypeResponse} from '../../../../types/graphql/movementTypes';

const useGetMovementOverview = ({
  page,
  size,
  office_id,
  recipient_user_id,
  sort_by_date_order,
}: GetMovementOverviewParams) => {
  const [movementItems, setMovementItems] = useState<MovementItems[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchMovement = async () => {
    const response: MovementTypeResponse['get'] = await fetch(GraphQL.movementOverview, {
      page,
      size,
      office_id,
      recipient_user_id,
      sort_by_date_order,
    });
    if (response) {
      const items = response.movement_Overview.items;
      setMovementItems(items);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovement();
  }, [page, size, office_id, recipient_user_id]);

  return {movementItems, loading, fetch: fetchMovement};
};

export default useGetMovementOverview;

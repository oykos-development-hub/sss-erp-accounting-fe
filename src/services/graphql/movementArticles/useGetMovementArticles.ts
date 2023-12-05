import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {OrderListType} from '../../../types/graphql/orderListTypes';
import {MovementArticlesResponse} from '../../../types/graphql/movementArticles';

const useGetMovementArticles = (title: string, skip?: boolean) => {
  const [articles, setArticles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchArticles = async () => {
    const response: MovementArticlesResponse = await fetch(GraphQL.getMovementArticles, {
      title,
    });

    const items = response?.movementArticles_Overview?.items;

    setArticles(items || []);
    setLoading(false);
  };

  useEffect(() => {
    if (skip) return;

    fetchArticles();
  }, [title, skip]);

  return {articles, loading, fetch: fetchArticles};
};

export default useGetMovementArticles;

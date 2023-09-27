import {useEffect, useState} from 'react';
import {GraphQL} from '../..';

const useGetRecipientUsersOverview = () => {
  const [recipientUsers, setRecipientUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipientUsersOverview = async () => {
    setLoading(true);

    const response = await GraphQL.getRecipientUsersOverview();
    if (response) {
      const items = response.items;
      setRecipientUsers(items);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipientUsersOverview();
  }, []);

  return {recipientUsers, loading, fetch: fetchRecipientUsersOverview};
};

export default useGetRecipientUsersOverview;

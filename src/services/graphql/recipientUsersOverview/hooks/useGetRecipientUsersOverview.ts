import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {RecipientUsersType} from '../../../../types/graphql/orderListTypes';
import {DropdownDataNumber} from '../../../../types/dropdownData';

const useGetRecipientUsersOverview = () => {
  const [recipientUsers, setRecipientUsers] = useState<DropdownDataNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();
  const fetchRecipientUsersOverview = async () => {
    const response: RecipientUsersType['get'] = await fetch(GraphQL.getRecipientUsersOverview);
    if (response) {
      const items = response.recipientUsers_Overview.items;
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

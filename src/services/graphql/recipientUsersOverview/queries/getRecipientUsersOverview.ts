import {GraphQL} from '../../';

const getRecipientUsersOverview = async (): Promise<any['data']['recipientUsers_Overview']> => {
  const query = `query RecipientUsersOverview {
  recipientUsers_Overview {
      status 
      message
      total 
      items {
          id
          title
      }
  }
}`;

  const response = await GraphQL.fetch(query, {});
  return response?.data?.recipientUsers_Overview || {};
};

export default getRecipientUsersOverview;

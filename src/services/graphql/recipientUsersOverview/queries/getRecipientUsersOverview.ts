import {GraphQL} from '../../';

const getRecipientUsersOverview = async (): Promise<any['data']['recipientUsers_Overview']> => {
  const response = await GraphQL.fetch(`
    query {
        recipientUsers_Overview {
            status 
            message
            total 
            items {
                id
                title
            }
        }
    }
  `);
  return response?.data?.recipientUsers_Overview || {};
};

export default getRecipientUsersOverview;

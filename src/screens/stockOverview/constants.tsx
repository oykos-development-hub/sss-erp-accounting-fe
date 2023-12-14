import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../utils/dateUtils';

export const tableHeadsStockReview: TableHead[] = [
  {
    title: 'Godina',
    accessor: 'year',
    sortable: true,
    type: 'text',
  },
  {
    title: 'Naziv',
    accessor: 'title',
    type: 'text',
  },
  {
    title: 'Bitne karakteristike',
    accessor: 'description',
    type: 'text',
  },
  {
    title: 'Dostupne količine',
    accessor: 'amount',
    sortable: true,
    type: 'text',
  },
  {
    title: 'Jedinična cijena',
    accessor: 'net_price',
    type: 'custom',
    renderContents: net_price => <Typography variant="bodyMedium" content={`${net_price} €` || ''} />,
  },
  {
    title: 'PDV',
    accessor: 'vat_percentage',
    type: 'custom',
    renderContents: vat_percentage => <Typography variant="bodyMedium" content={`${vat_percentage}%` || ''} />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const tableHeadsMovement: TableHead[] = [
  {
    title: ' Datum interne otpremnice',
    sortable: true,
    accessor: 'date_order',
    type: 'custom',
    renderContents: date_order => <Typography content={date_order ? parseDate(date_order) : ''} />,
  },
  {
    title: 'Primalac',
    accessor: 'recipient_user',
    type: 'custom',
    renderContents: recipient_user => <Typography content={recipient_user ? recipient_user.title : ''} />,
  },
  {
    title: 'Kancelarija',
    accessor: 'office',
    type: 'custom',
    renderContents: office => <Typography content={office ? office.title : ''} />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const tableHeadsStockArticleDetails: TableHead[] = [
  {
    title: 'Naziv',
    accessor: 'title',
    type: 'text',
  },
  {
    title: 'Bitne karakteristike',
    accessor: 'description',
    type: 'text',
  },
  {
    title: 'Količina',
    accessor: 'amount',
    type: 'text',
  },
  {
    title: 'Jedinična cijena',
    accessor: 'net_price',
    type: 'custom',
    renderContents: net_price => <Typography variant="bodyMedium" content={`${net_price} €` || ''} />,
  },
  {
    title: 'PDV',
    accessor: 'vat_percentage',
    type: 'custom',
    renderContents: vat_percentage => <Typography variant="bodyMedium" content={`${vat_percentage}%` || ''} />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export enum Tabs {
  Stock = 1,
  AssetMovement = 2,
}

export const stockTabs = [
  {id: Tabs.Stock, title: 'Pregled zaliha', routeName: 'stock'},
  {id: Tabs.AssetMovement, title: 'Lista svih otpremnica', routeName: 'movement'},
];

export const getCurrentTab = (pathname: string) => {
  const path = pathname.split('/');
  const name = path[path.length - 1];
  return stockTabs.find(tab => tab.routeName === name)?.id;
};

export const getRouteName = (tabName: string) => {
  const tabIndex = stockTabs.findIndex(tab => tab.title === tabName);
  return stockTabs[tabIndex].routeName;
};

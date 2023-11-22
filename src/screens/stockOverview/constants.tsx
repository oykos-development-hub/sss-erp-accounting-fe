import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../utils/dateUtils';

export const tableHeadsStockReview: TableHead[] = [
  {
    title: 'Godina',
    accessor: 'year',
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
    type: 'text',
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const tableHeadsMovement: TableHead[] = [
  {
    title: ' Datum interne otpremnice',
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
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

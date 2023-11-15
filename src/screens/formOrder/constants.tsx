import {TableHead, Typography} from 'client-library';

export const tableHeads: TableHead[] = [
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
    title: 'Jedinica mjere',
    accessor: 'unit',
    type: 'text',
  },
  {
    title: 'Količina',
    accessor: 'amount',
    type: 'custom',
    renderContents: (amount: number) => {
      return <Typography variant="bodyMedium" content={amount ? parseFloat(amount?.toFixed(2)) : 0} />;
    },
  },
];

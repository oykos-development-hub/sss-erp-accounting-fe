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
  {
    title: 'Jedinična cijena (sa PDV-OM):',
    accessor: 'price',
    type: 'custom',
    renderContents: (price: number) => {
      return <Typography variant="bodyMedium" content={price ? parseFloat(price?.toFixed(2)) : 0} />;
    },
  },
  {
    title: 'Ukupna vrijednost (sa PDV-OM):',
    accessor: 'total_price',
    type: 'custom',
    renderContents: (total_price: number) => {
      return <Typography variant="bodyMedium" content={total_price ? parseFloat(total_price?.toFixed(2)) : 0} />;
    },
  },
];

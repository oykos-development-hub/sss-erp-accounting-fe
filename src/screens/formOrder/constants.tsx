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
    title: 'Proizvođač',
    accessor: 'manufacturer',
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
    type: 'text',
  },

  {
    title: 'Narudžbenica',
    accessor: 'order_id',
    type: 'text',
  },
  {
    title: 'Ukupna vrijednost (sa PDV-OM):',
    accessor: 'total_price',
    type: 'custom',
    renderContents: (total_price: number) => {
      return <Typography variant="bodyMedium" content={total_price ? parseFloat(total_price?.toFixed(2)) : ''} />;
    },
  },
];

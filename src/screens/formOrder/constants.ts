import {TableHead} from 'client-library';

export const tableHeadsMovement: TableHead[] = [
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
    type: 'text',
  },
];

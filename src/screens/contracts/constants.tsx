import {DropdownDataNumber} from '../../types/dropdownData';
import {parseDate} from '../../utils/dateUtils';
import {TableHead, Typography} from 'client-library';

export const tableHeads: TableHead[] = [
  {
    title: 'Šifra ugovora',
    accessor: 'serial_number',
    type: 'custom',
    renderContents: serial_number => <Typography variant="bodySmall" content={serial_number} />,
  },
  {
    title: 'Datum zaključenja',
    accessor: 'date_of_signing',
    type: 'custom',
    renderContents: (date_of_signing: string) => {
      return <Typography variant="bodySmall" content={date_of_signing ? parseDate(date_of_signing) : ''} />;
    },
  },
  {
    title: 'Datum završetka',
    accessor: 'date_of_expiry',
    type: 'custom',
    renderContents: (date_of_expiry: string) => {
      return <Typography variant="bodySmall" content={date_of_expiry ? parseDate(date_of_expiry) : ''} />;
    },
  },
  {
    title: 'Dobavljač',
    accessor: 'supplier',
    type: 'custom',
    renderContents: (supplier: DropdownDataNumber) => {
      return <Typography variant="bodySmall" content={supplier.title} />;
    },
  },
  {
    title: 'Nabavka',
    accessor: 'public_procurement',
    type: 'custom',
    renderContents: (public_procurement: any) => {
      return <Typography variant="bodySmall" content={public_procurement.title} />;
    },
  },
  {
    title: 'Ukupno',
    accessor: 'gross_value',
    type: 'custom',
    renderContents: gross_value => {
      return <Typography variant="bodySmall" content={gross_value} />;
    },
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../utils/dateUtils';

export const tableHeads: TableHead[] = [
  {
    title: 'Datum narudžbenice',
    accessor: 'date_order',
    sortable: true,
    type: 'custom',
    renderContents: (date_order: string) => {
      return <Typography variant="bodyMedium" content={date_order ? parseDate(date_order) : ''} />;
    },
  },
  {
    title: 'Ukupna cijena',
    sortable: true,
    accessor: 'total_bruto',
    type: 'custom',
    renderContents: (total_bruto: number) => {
      return (
        <Typography
          variant="bodyMedium"
          content={
            total_bruto
              ? total_bruto?.toLocaleString('sr-RS', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : 0.0
          }
        />
      );
    },
  },
  {
    title: 'Nabavka',
    accessor: 'public_procurement',
    type: 'custom',
    renderContents: (public_procurement, row) => {
      return (
        <Typography
          variant="bodyMedium"
          content={
            row.is_pro_forma_invoice && row?.invoice_number !== ''
              ? 'Izuzeće - račun'
              : row.is_pro_forma_invoice
              ? 'Izuzeće - predračun'
              : public_procurement.title
              ? public_procurement.title
              : 'Izuzeće'
          }
        />
      );
    },
  },
  {
    title: 'Dobavljač',
    accessor: 'supplier',
    type: 'custom',
    renderContents: (supplier: any) => {
      return <Typography variant="bodyMedium" content={supplier.title} />;
    },
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const getYearList = () => {
  const currentYear = getCurrentYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i.toString());
  }
  return years;
};

export const YearList = getYearList()
  .map(year => ({id: year, title: year}))
  .reverse();

export const yearsForDropdown = () => {
  const maxOffset = 10;
  const thisYear = new Date().getFullYear();
  const allYears = [];
  allYears.push({id: 0, title: 'Sve'});
  for (let x = 0; x < maxOffset; x++) {
    allYears.push({id: Number(thisYear - x), title: (thisYear - x).toString()});
  }
  return allYears;
};

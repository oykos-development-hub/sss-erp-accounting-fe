export enum AccountingReportType {
  STOCK = 'Dostupne količine / Lager lista',
  TOTAL_SPENDING = 'Ukupna potrošnja',
  OFFICE_SPENDING = 'Potrošnja po kancelarijama',
  EXCEPTED_FROM_PLAN = 'Izuzeće od plana',
}

export const accountingReportTypeOptions = Object.values(AccountingReportType).map(value => ({
  id: value,
  title: value,
}));

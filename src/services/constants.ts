export const MICRO_SERVICE_SLUG = 'accounting';

export enum REQUEST_STATUSES {
  success = 'success',
  error = 'error',
}

export const BFF_URL = {
  local: 'http://localhost:8080',
  development: 'https://sss-erp-bff.oykos.me',
  staging: 'http://localhost:8080',
  production: 'http://localhost:8080',
};

export const getYear = new Date().getFullYear();

export const yearsForDropdown = () => {
  const maxOffset = 10;
  const thisYear = new Date().getFullYear();
  const allYears = [];
  for (let x = 0; x <= maxOffset; x++) {
    allYears.push(thisYear - x);
  }
  return allYears.map(year => ({id: year.toString(), title: year.toString()}));
};

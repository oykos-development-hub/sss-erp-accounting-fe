import {DropdownDataString} from '../types/dropdownData';

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

export const yearsForDropdown = (maxOffset = 10, isFilter = true, nextYears = 0): DropdownDataString[] => {
  const thisYear = new Date().getFullYear() + nextYears;
  const allYears: DropdownDataString[] = isFilter ? [{id: '', title: 'Sve'}] : [];
  allYears.push(
    ...Array.from({length: maxOffset}, (_, index) => {
      const yearValue = thisYear - index;
      return {id: yearValue.toString(), title: yearValue.toString()};
    }),
  );
  return allYears;
};

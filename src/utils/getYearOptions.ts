import {DropdownDataString} from '../types/dropdownData';

export const getYearOptions = (maxOffset = 10, isFilter = true, nextYears = 0): DropdownDataString[] => {
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

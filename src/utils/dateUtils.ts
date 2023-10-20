export const parseDate = (date: Date | string | null) => {
  if (!date) return '';
  const dateObj = new Date(date);
  const day = dateObj.toLocaleDateString('sr-latn-SR', {day: '2-digit'});
  const month = dateObj.toLocaleDateString('sr-latn-SR', {month: '2-digit'});
  const year = dateObj.toLocaleDateString('sr-latn-SR', {year: 'numeric'}).replace('.', '');

  return `${day}/${month}/${year}`;
};

export const calculateExperience = (startDate: Date | string, endDate: Date | string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInMonths = end.getMonth() - start.getMonth() + 12 * (end.getFullYear() - start.getFullYear());

  return diffInMonths;
};

export const parseDateForBackend = (date: Date | null) => {
  if (!date) return null;

  const pickedDate = new Date(date);
  pickedDate.setMinutes(pickedDate.getMinutes() - pickedDate.getTimezoneOffset());

  return pickedDate.toISOString();
};

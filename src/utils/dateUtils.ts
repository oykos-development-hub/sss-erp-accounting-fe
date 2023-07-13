export const parseDate = (date: Date | string, parseForBFF?: boolean) => {
  const datum = new Date(date);
  const dan = datum.toLocaleDateString('sr-latn-SR', {day: '2-digit'});
  const mjesec = datum.toLocaleDateString('sr-latn-SR', {month: '2-digit'});
  const godina = datum.toLocaleDateString('sr-latn-SR', {year: 'numeric'}).replace('.', '');

  return parseForBFF ? `${godina}-${mjesec}-${dan}` : `${dan}/${mjesec}/${godina}`;
};

export const calculateExperience = (startDate: Date | string, endDate: Date | string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInMonths = end.getMonth() - start.getMonth() + 12 * (end.getFullYear() - start.getFullYear());

  return diffInMonths;
};

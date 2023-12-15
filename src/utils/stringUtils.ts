export const convertToCurrency = (value: number) => {
  return `${value?.toLocaleString('sr-RS', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
};

export function formatMoney(value: number | string): string {
  let parsedValue: number;

  if (typeof value !== 'number') {
    parsedValue = Number(value);

    if (isNaN(parsedValue)) {
      return String(value);
    }
  } else {
    parsedValue = value;
  }

  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parsedValue);
}

export function parseDate(dateString: string): Date {
  // Handles YYYY-MM-DD format and avoids timezone issues
  // by creating the date in the local timezone.
  const datePart = dateString.split('T')[0];
  const [year, month, day] = datePart.split('-').map(Number);
  if (!day) {
    return new Date(year, month - 1); // If day is not provided, return the first day of the month
  }
  return new Date(year, month - 1, day);
}

export function stringifyDate(date: Date | string, granularity: string = 'day'): string {
  if (typeof date === 'string') {
    date = parseDate(date);
  }
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  return (granularity === 'day' ? `${day}/${month}` : `${month}/${year}`);
}

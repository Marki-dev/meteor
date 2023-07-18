export function getDurationSince(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const pluralize = (value: number, unit: string) =>
    // eslint-disable-next-line no-negated-condition
    `${value} ${unit}${value !== 1 ? 's' : ''}`;

  if (diffInSeconds < 60) {
    return pluralize(diffInSeconds, 'second');
  }

  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return pluralize(minutes, 'minute');
  }

  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return pluralize(hours, 'hour');
  }

  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return pluralize(days, 'day');
  }

  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return pluralize(months, 'month');
  }

  const years = Math.floor(diffInSeconds / 31536000);
  return pluralize(years, 'year');
}

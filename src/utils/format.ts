export function formatETB(amount: number): string {
  return `${amount.toLocaleString()} ETB`;
}

export function formatDate(timestamp: number | string | Date): string {
  const d = new Date(timestamp);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

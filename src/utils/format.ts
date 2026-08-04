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
export function formatTime(timestamp: number | string | Date): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
export function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

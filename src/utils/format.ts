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
export function monthLabel(month: number, year: number): string {
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}
export function hoursBetween(start: string, end: string): number {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return Math.max(0, Math.round((e - s) / (1000 * 60 * 60) * 10) / 10);
}

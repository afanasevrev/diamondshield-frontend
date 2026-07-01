import dayjs from 'dayjs';

export function formatDateTime(value?: string | null): string {
  if (!value) {
    return '—';
  }

  return dayjs(value).format('DD.MM.YYYY HH:mm:ss');
}

export function formatDate(value?: string | null): string {
  if (!value) {
    return '—';
  }

  return dayjs(value).format('DD.MM.YYYY');
}
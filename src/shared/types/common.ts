export type UUID = string;

export type EntityStatus =
  | 'active'
  | 'inactive'
  | 'online'
  | 'offline'
  | 'error'
  | 'warning'
  | 'unknown'
  | string;

export interface ApiListResponse<T> {
  items: T[];
  total: number;
}

export interface SelectOption {
  label: string;
  value: string;
}
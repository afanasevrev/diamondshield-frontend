import { apiClient } from '../../../shared/api/apiClient';

function normalizeArray<T>(response: unknown): T[] {
  if (Array.isArray(response)) {
    return response as T[];
  }

  if (response && typeof response === 'object') {
    const objectResponse = response as Record<string, unknown>;

    if (Array.isArray(objectResponse.items)) {
      return objectResponse.items as T[];
    }

    if (Array.isArray(objectResponse.content)) {
      return objectResponse.content as T[];
    }

    if (Array.isArray(objectResponse.data)) {
      return objectResponse.data as T[];
    }
  }

  return [];
}

export interface PersonImportResult {
  id?: string;
  importId?: string;
  status?: string;
  message?: string;
  totalRows?: number;
  successRows?: number;
  skippedRows?: number;
  errorRows?: number;
  createdAt?: string;
  finishedAt?: string;
  organizationId?: string;
  importHistoryId?: string;
}

export interface PersonImportHistoryItem {
  id: string;
  fileName?: string;
  status?: string;
  message?: string;
  totalRows?: number;
  successRows?: number;
  skippedRows?: number;
  errorRows?: number;
  createdAt?: string;
  finishedAt?: string;
}

export interface PersonImportError {
  id?: string;
  rowNumber?: number;
  columnName?: string;
  fieldName?: string;
  message?: string;
  rawValue?: string;
  createdAt?: string;
}

export async function uploadPersonsXlsx(
  organizationId: string,
  file: File,
): Promise<PersonImportResult> {
  const formData = new FormData();
  formData.append('file', file);

  return apiClient.post<PersonImportResult>(
    `/api/persons/import/xlsx?organizationId=${encodeURIComponent(
      organizationId,
    )}`,
    formData,
  );
}

export async function getPersonImportHistory(): Promise<
  PersonImportHistoryItem[]
> {
  const response = await apiClient.get<unknown>('/api/imports/persons');
  return normalizeArray<PersonImportHistoryItem>(response);
}

export async function getPersonImportErrors(
  importId: string,
): Promise<PersonImportError[]> {
  const response = await apiClient.get<unknown>(
    `/api/imports/persons/${importId}/errors`,
  );

  return normalizeArray<PersonImportError>(response);
}
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

export interface CreateGuestRequestRequest {
  organizationId?: string;
  objectId?: string;

  lastName: string;
  firstName: string;
  middleName?: string;

  phone?: string;
  email?: string;

  documentType?: string;
  documentSeries?: string;
  documentNumber?: string;

  visitDate: string;
  visitTimeFrom: string;
  visitTimeTo: string;

  hostPersonFullName?: string;
  hostPersonPhone?: string;

  purpose: string;
  personalDataConsent: boolean;
}

export interface GuestRequest {
  id: string;

  organizationId?: string | null;
  objectId?: string | null;

  lastName?: string | null;
  firstName?: string | null;
  middleName?: string | null;

  phone?: string | null;
  email?: string | null;

  documentType?: string | null;
  documentSeries?: string | null;
  documentNumber?: string | null;

  visitDate?: string | null;
  visitTimeFrom?: string | null;
  visitTimeTo?: string | null;

  hostPersonFullName?: string | null;
  hostPersonPhone?: string | null;

  purpose?: string | null;
  status?: string | null;

  rejectReason?: string | null;

  guestId?: string | null;
  qrValue?: string | null;

  createdAt?: string | null;
  updatedAt?: string | null;
  approvedAt?: string | null;
  rejectedAt?: string | null;
}

export interface Guest {
  id: string;

  guestRequestId?: string | null;
  organizationId?: string | null;
  objectId?: string | null;

  lastName?: string | null;
  firstName?: string | null;
  middleName?: string | null;

  phone?: string | null;
  email?: string | null;

  documentType?: string | null;
  documentSeries?: string | null;
  documentNumber?: string | null;

  visitDate?: string | null;
  visitTimeFrom?: string | null;
  visitTimeTo?: string | null;

  hostPersonFullName?: string | null;
  purpose?: string | null;

  status?: string | null;
  qrValue?: string | null;

  checkedInAt?: string | null;
  checkedOutAt?: string | null;

  createdAt?: string | null;
}

export interface GuestBlacklistItem {
  id: string;

  lastName?: string | null;
  firstName?: string | null;
  middleName?: string | null;

  documentType?: string | null;
  documentSeries?: string | null;
  documentNumber?: string | null;

  phone?: string | null;
  reason?: string | null;
  active?: boolean;

  createdAt?: string | null;
}

export interface CreateBlacklistItemRequest {
  lastName: string;
  firstName: string;
  middleName?: string;

  documentType?: string;
  documentSeries?: string;
  documentNumber?: string;

  phone?: string;
  reason: string;
}

export interface RejectGuestRequestRequest {
  reason: string;
}

export interface ApproveGuestRequestResponse {
  status?: string;
  message?: string;
  guestId?: string;
  qrValue?: string;
}

export interface GuestActionResponse {
  status?: string;
  message?: string;
}

export function createPublicGuestRequest(request: CreateGuestRequestRequest) {
  return apiClient.post<GuestRequest>('/api/public/guest-requests', request, {
    auth: false,
  });
}

export async function getGuestRequests(): Promise<GuestRequest[]> {
  const response = await apiClient.get<unknown>('/api/guest-requests');
  return normalizeArray<GuestRequest>(response);
}

export function getGuestRequest(id: string): Promise<GuestRequest> {
  return apiClient.get<GuestRequest>(`/api/guest-requests/${id}`);
}

export function approveGuestRequest(
  id: string,
): Promise<ApproveGuestRequestResponse> {
  return apiClient.post<ApproveGuestRequestResponse>(
    `/api/guest-requests/${id}/approve`,
  );
}

export function rejectGuestRequest(
  id: string,
  request: RejectGuestRequestRequest,
): Promise<GuestActionResponse> {
  return apiClient.post<GuestActionResponse>(
    `/api/guest-requests/${id}/reject`,
    request,
  );
}

export async function getGuests(): Promise<Guest[]> {
  const response = await apiClient.get<unknown>('/api/guests');
  return normalizeArray<Guest>(response);
}

export function getGuest(id: string): Promise<Guest> {
  return apiClient.get<Guest>(`/api/guests/${id}`);
}

export function checkInGuest(id: string): Promise<GuestActionResponse> {
  return apiClient.post<GuestActionResponse>(`/api/guests/${id}/check-in`);
}

export function checkOutGuest(id: string): Promise<GuestActionResponse> {
  return apiClient.post<GuestActionResponse>(`/api/guests/${id}/check-out`);
}

export async function getGuestBlacklist(): Promise<GuestBlacklistItem[]> {
  const response = await apiClient.get<unknown>('/api/guest-blacklist');
  return normalizeArray<GuestBlacklistItem>(response);
}

export function createGuestBlacklistItem(request: CreateBlacklistItemRequest) {
  return apiClient.post<GuestBlacklistItem>('/api/guest-blacklist', request);
}

export function deleteGuestBlacklistItem(id: string) {
  return apiClient.delete<void>(`/api/guest-blacklist/${id}`);
}
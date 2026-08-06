import { apiClient } from '../../../shared/api/apiClient';
import {
  type AccessPoint,
  type AccessRule,
  type Controller,
  type DsObject,
  type LocalServer,
  type Organization,
  type Person,
  type Reader,
  type Schedule,
  type AccessIdentifier,
} from './centralApi';

export function updateOrganization(id: string, request: Partial<Organization>) {
  return apiClient.put<Organization>(`/api/organizations/${id}`, request);
}

export function deleteOrganization(id: string) {
  return apiClient.delete<void>(`/api/organizations/${id}`);
}

export function updateObject(id: string, request: Partial<DsObject>) {
  return apiClient.put<DsObject>(`/api/objects/${id}`, request);
}

export function deleteObject(id: string) {
  return apiClient.delete<void>(`/api/objects/${id}`);
}

export function updateLocalServer(id: string, request: Partial<LocalServer>) {
  return apiClient.put<LocalServer>(`/api/local-servers/${id}`, request);
}

export function deleteLocalServer(id: string) {
  return apiClient.delete<void>(`/api/local-servers/${id}`);
}

export function updateController(id: string, request: Partial<Controller>) {
  return apiClient.put<Controller>(`/api/controllers/${id}`, request);
}

export function deleteController(id: string) {
  return apiClient.delete<void>(`/api/controllers/${id}`);
}

export function updateReader(id: string, request: Partial<Reader>) {
  return apiClient.put<Reader>(`/api/readers/${id}`, request);
}

export function deleteReader(id: string) {
  return apiClient.delete<void>(`/api/readers/${id}`);
}

export function updateAccessPoint(id: string, request: Partial<AccessPoint>) {
  return apiClient.put<AccessPoint>(`/api/access-points/${id}`, request);
}

export function deleteAccessPoint(id: string) {
  return apiClient.delete<void>(`/api/access-points/${id}`);
}

export function updatePerson(id: string, request: Partial<Person>) {
  return apiClient.put<Person>(`/api/persons/${id}`, request);
}

export function deletePerson(id: string) {
  return apiClient.delete<void>(`/api/persons/${id}`);
}

export function updateIdentifier(
  id: string,
  request: Partial<AccessIdentifier>,
) {
  return apiClient.put<AccessIdentifier>(
    `/api/access-identifiers/${id}`,
    request,
  );
}

export function deleteIdentifier(id: string) {
  return apiClient.delete<void>(`/api/access-identifiers/${id}`);
}

export function updateSchedule(id: string, request: Partial<Schedule>) {
  return apiClient.put<Schedule>(`/api/schedules/${id}`, request);
}

export function deleteSchedule(id: string) {
  return apiClient.delete<void>(`/api/schedules/${id}`);
}

export function updateAccessRule(id: string, request: Partial<AccessRule>) {
  return apiClient.put<AccessRule>(`/api/access-rules/${id}`, request);
}

export function deleteAccessRule(id: string) {
  return apiClient.delete<void>(`/api/access-rules/${id}`);
}
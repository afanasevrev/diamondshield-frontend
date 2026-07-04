import { apiClient } from '../../../shared/api/apiClient';

export interface Organization {
  id: string;
  name: string;
  inn?: string | null;
  description?: string | null;
  active?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrganizationRequest {
  name: string;
  inn?: string;
  description?: string;
}

export interface DsObject {
  id: string;
  organizationId?: string;
  name: string;
  objectType?: string | null;
  address?: string | null;
  description?: string | null;
  active?: boolean;
  isActive?: boolean;
}

export interface CreateObjectRequest {
  organizationId: string;
  name: string;
  address?: string;
  description?: string;
}

export interface AccessPoint {
  id: string;
  objectId?: string;
  controllerId?: string | null;
  name: string;
  accessPointType?: string;
  status?: string;
  active?: boolean;
  isActive?: boolean;
}

export interface CreateAccessPointRequest {
  objectId: string;
  name: string;
  accessPointType: string;
  active: boolean;
}

export interface Person {
  id: string;
  organizationId?: string;
  personType?: string;
  personnelNumber?: string | null;
  lastName: string;
  firstName: string;
  middleName?: string | null;
  birthDate?: string | null;
  phone?: string | null;
  email?: string | null;
  documentType?: string | null;
  documentSeries?: string | null;
  documentNumber?: string | null;
  active?: boolean;
  isActive?: boolean;
}

export interface CreatePersonRequest {
  organizationId: string;
  personType: string;
  personnelNumber?: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  birthDate?: string;
  phone?: string;
  email?: string;
  documentType?: string;
  documentSeries?: string;
  documentNumber?: string;
}

export interface AccessIdentifier {
  id: string;
  personId?: string;
  identifierType?: string;
  identifierMasked?: string;
  validFrom?: string;
  validTo?: string;
  status?: string;
  comment?: string | null;
}

export interface CreateIdentifierRequest {
  personId: string;
  identifierType: string;
  identifierValue: string;
  validFrom?: string;
  validTo?: string;
  comment?: string;
}

export interface ScheduleIntervalRequest {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Schedule {
  id: string;
  organizationId?: string;
  name: string;
  description?: string | null;
  intervals?: ScheduleIntervalRequest[];
}

export interface CreateScheduleRequest {
  organizationId: string;
  name: string;
  description?: string;
  intervals: ScheduleIntervalRequest[];
}

export interface AccessRule {
  id: string;
  personId?: string;
  accessPointId?: string;
  scheduleId?: string;
  validFrom?: string;
  validTo?: string;
  active?: boolean;
  isActive?: boolean;
}

export interface CreateAccessRuleRequest {
  personId: string;
  accessPointId: string;
  scheduleId: string;
  validFrom?: string;
  validTo?: string;
}

export interface AccessCheckRequest {
  identifierType: string;
  identifierValue: string;
  accessPointId: string;
  objectId: string;
  direction: string;
}

export interface AccessCheckResponse {
  decision: string;
  allowed: boolean;
  reason?: string;
  personId?: string;
  personFullName?: string;
  identifierId?: string;
  identifierMasked?: string;
  accessPointId?: string;
  accessRuleId?: string;
  scheduleId?: string;
  accessEventId?: string;
  checkedAt?: string;
}

export interface AccessEvent {
  id: string;
  localEventId?: string;
  objectId?: string;
  personId?: string | null;
  identifierId?: string | null;
  accessPointId?: string | null;
  readerId?: string | null;
  direction?: string | null;
  eventResult?: string;
  accessResult?: string;
  denyReason?: string | null;
  reason?: string | null;
  eventTime?: string;
  receivedAt?: string;
  createdAt?: string;
  unknownIdentifier?: string | null;
  unknownIdentifierHash?: string | null;
  personFullName?: string | null;
  identifierMasked?: string | null;
}

function normalizeArray<T>(response: unknown): T[] {
  if (Array.isArray(response)) {
    return response as T[];
  }

  if (
    response &&
    typeof response === 'object' &&
    'items' in response &&
    Array.isArray(response.items)
  ) {
    return response.items as T[];
  }

  if (
    response &&
    typeof response === 'object' &&
    'content' in response &&
    Array.isArray(response.content)
  ) {
    return response.content as T[];
  }

  return [];
}

export async function getOrganizations(): Promise<Organization[]> {
  const response = await apiClient.get<unknown>('/api/organizations');
  return normalizeArray<Organization>(response);
}

export function createOrganization(request: CreateOrganizationRequest) {
  return apiClient.post<Organization>('/api/organizations', request);
}

export async function getObjects(): Promise<DsObject[]> {
  const response = await apiClient.get<unknown>('/api/objects');
  return normalizeArray<DsObject>(response);
}

export function createObject(request: CreateObjectRequest) {
  return apiClient.post<DsObject>('/api/objects', request);
}

export async function getAccessPoints(): Promise<AccessPoint[]> {
  const response = await apiClient.get<unknown>('/api/access-points');
  return normalizeArray<AccessPoint>(response);
}

export function createAccessPoint(request: CreateAccessPointRequest) {
  return apiClient.post<AccessPoint>('/api/access-points', request);
}

export async function getPersons(): Promise<Person[]> {
  const response = await apiClient.get<unknown>('/api/persons');
  return normalizeArray<Person>(response);
}

export function createPerson(request: CreatePersonRequest) {
  return apiClient.post<Person>('/api/persons', request);
}

export async function getIdentifiers(): Promise<AccessIdentifier[]> {
  const response = await apiClient.get<unknown>('/api/access-identifiers');
  return normalizeArray<AccessIdentifier>(response);
}

export function createIdentifier(request: CreateIdentifierRequest) {
  return apiClient.post<AccessIdentifier>('/api/access-identifiers', request);
}

export function blockIdentifier(identifierId: string) {
  return apiClient.post<AccessIdentifier>(
    `/api/access-identifiers/${identifierId}/block`,
  );
}

export async function getSchedules(): Promise<Schedule[]> {
  const response = await apiClient.get<unknown>('/api/schedules');
  return normalizeArray<Schedule>(response);
}

export function createSchedule(request: CreateScheduleRequest) {
  return apiClient.post<Schedule>('/api/schedules', request);
}

export async function getAccessRules(): Promise<AccessRule[]> {
  const response = await apiClient.get<unknown>('/api/access-rules');
  return normalizeArray<AccessRule>(response);
}

export function createAccessRule(request: CreateAccessRuleRequest) {
  return apiClient.post<AccessRule>('/api/access-rules', request);
}

export function checkAccess(request: AccessCheckRequest) {
  return apiClient.post<AccessCheckResponse>('/api/access-check', request);
}

export async function getAccessEvents(unknown?: boolean): Promise<AccessEvent[]> {
  const query = unknown ? '?unknown=true' : '';
  const response = await apiClient.get<unknown>(`/api/access-events${query}`);
  return normalizeArray<AccessEvent>(response);
}
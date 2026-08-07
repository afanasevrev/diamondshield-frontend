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

export interface User {
  id: string;
  username: string;
  displayName?: string | null;
  email?: string | null;
  enabled?: boolean;
  active?: boolean;
  roles?: string[];
  createdAt?: string | null;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  displayName?: string;
  email?: string;
  enabled: boolean;
}

export interface UpdateUserRequest {
  username?: string;
  displayName?: string;
  email?: string;
  enabled?: boolean;
}

export interface AssignUserRolesRequest {
  roleIds: string[];
}

export interface Role {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  permissions?: string[];
  createdAt?: string | null;
}

export interface CreateRoleRequest {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateRoleRequest {
  code?: string;
  name?: string;
  description?: string;
}

export interface AssignRolePermissionsRequest {
  permissionIds: string[];
}

export interface Permission {
  id: string;
  code: string;
  name?: string | null;
  description?: string | null;
  module?: string | null;
}

export async function getUsers(): Promise<User[]> {
  const response = await apiClient.get<unknown>('/api/users');
  return normalizeArray<User>(response);
}

export function createUser(request: CreateUserRequest) {
  return apiClient.post<User>('/api/users', request);
}

export function updateUser(id: string, request: UpdateUserRequest) {
  return apiClient.put<User>(`/api/users/${id}`, request);
}

export function deleteUser(id: string) {
  return apiClient.delete<void>(`/api/users/${id}`);
}

export function assignUserRoles(id: string, request: AssignUserRolesRequest) {
  return apiClient.post<User>(`/api/users/${id}/roles`, request);
}

export async function getRoles(): Promise<Role[]> {
  const response = await apiClient.get<unknown>('/api/roles');
  return normalizeArray<Role>(response);
}

export function createRole(request: CreateRoleRequest) {
  return apiClient.post<Role>('/api/roles', request);
}

export function updateRole(id: string, request: UpdateRoleRequest) {
  return apiClient.put<Role>(`/api/roles/${id}`, request);
}

export function deleteRole(id: string) {
  return apiClient.delete<void>(`/api/roles/${id}`);
}

export function assignRolePermissions(
  id: string,
  request: AssignRolePermissionsRequest,
) {
  return apiClient.post<Role>(`/api/roles/${id}/permissions`, request);
}

export async function getPermissions(): Promise<Permission[]> {
  const response = await apiClient.get<unknown>('/api/permissions');
  return normalizeArray<Permission>(response);
}
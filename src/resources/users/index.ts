import qs from 'qs';
import { BaseResource } from '../../base';
import {
  ListUsersParams,
  ListUsersResponse,
  User,
  CreateUserInput,
  ListRolesParams,
  ListRolesResponse,
  Role,
  CreateRoleInput,
  UpdateRoleInput,
} from './types';

export class UsersResource extends BaseResource {
  
  async list(params?: ListUsersParams): Promise<ListUsersResponse> {
    const queryParams: any = {};
    if (params) {
      if (params.with) queryParams.with = Array.isArray(params.with) ? params.with.join(',') : params.with;
      if (params.page) queryParams.page = params.page;
      if (params.limit) queryParams.limit = params.limit;
    }
    const query = qs.stringify(queryParams, { skipNulls: true });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<ListUsersResponse>(`/api/v4/users${qsStr}`);
    return response.data;
  }

  async getById(id: number, params?: { with?: import('./types').UserWithParam[] | string }): Promise<User> {
    const queryParams: any = {};
    if (params?.with) {
      queryParams.with = Array.isArray(params.with) ? params.with.join(',') : params.with;
    }
    const query = qs.stringify(queryParams, { skipNulls: true });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<User>(`/api/v4/users/${id}${qsStr}`);
    return response.data;
  }

  async create(items: CreateUserInput | CreateUserInput[]): Promise<ListUsersResponse> {
    const payload = Array.isArray(items) ? items : [items];
    if (payload.length > 10) {
      throw new Error('A API da Kommo permite criar no máximo 10 usuários por requisição.');
    }
    const response = await this.client.post<ListUsersResponse>('/api/v4/users', payload);
    return response.data;
  }
}

export class RolesResource extends BaseResource {
  
  async list(params?: ListRolesParams): Promise<ListRolesResponse> {
    const queryParams: any = {};
    if (params?.with) {
      queryParams.with = Array.isArray(params.with) ? params.with.join(',') : params.with;
    }
    const query = qs.stringify(queryParams, { skipNulls: true });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<ListRolesResponse>(`/api/v4/roles${qsStr}`);
    return response.data;
  }

  async getById(id: number, params?: { with?: import('./types').RoleWithParam[] | string }): Promise<Role> {
    const queryParams: any = {};
    if (params?.with) {
      queryParams.with = Array.isArray(params.with) ? params.with.join(',') : params.with;
    }
    const query = qs.stringify(queryParams, { skipNulls: true });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<Role>(`/api/v4/roles/${id}${qsStr}`);
    return response.data;
  }

  async create(items: CreateRoleInput | CreateRoleInput[]): Promise<ListRolesResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.post<ListRolesResponse>('/api/v4/roles', payload);
    return response.data;
  }

  async update(items: UpdateRoleInput | UpdateRoleInput[]): Promise<ListRolesResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.patch<ListRolesResponse>('/api/v4/roles', payload);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/api/v4/roles/${id}`);
  }
}

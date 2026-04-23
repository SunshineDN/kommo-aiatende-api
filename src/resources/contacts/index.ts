import qs from 'qs';
import { BaseResource } from '../../base';
import {
  ListContactsParams,
  ListContactsResponse,
  Contact,
  ContactWithParam,
  CreateContactInput,
  CreateContactsResponse,
  UpdateContactInput,
  UpdateContactsResponse,
  UpdateSingleContactInput,
} from './types';

export class ContactsResource extends BaseResource {
  
  async list(params?: ListContactsParams): Promise<ListContactsResponse> {
    const queryParams: any = {};

    if (params) {
      if (params.with) {
        queryParams.with = Array.isArray(params.with) ? params.with.join(',') : params.with;
      }
      if (params.page) queryParams.page = params.page;
      if (params.limit) queryParams.limit = params.limit;
      if (params.query) queryParams.query = params.query;

      // Filtros
      const filter: any = {};
      
      const arrayFilters = ['id', 'name', 'created_by', 'updated_by', 'responsible_user_id'] as const;
      arrayFilters.forEach(k => {
        const key = `filter_${k}` as keyof ListContactsParams;
        if (params[key] !== undefined) filter[k] = params[key];
      });

      // Range Filters (from/to)
      const rangeFilters = ['created_at', 'updated_at', 'closest_task_at'];
      rangeFilters.forEach(k => {
        const fromKey = `filter_${k}_from` as keyof ListContactsParams;
        const toKey = `filter_${k}_to` as keyof ListContactsParams;
        
        if (params[fromKey] !== undefined || params[toKey] !== undefined) {
          filter[k] = {};
          if (params[fromKey] !== undefined) filter[k].from = params[fromKey];
          if (params[toKey] !== undefined) filter[k].to = params[toKey];
        }
      });

      if (Object.keys(filter).length > 0) {
        queryParams.filter = filter;
      }

      // Ordenação
      const order: any = {};
      if (params.order_updated_at) order.updated_at = params.order_updated_at;
      if (params.order_id) order.id = params.order_id;
      
      if (Object.keys(order).length > 0) {
        queryParams.order = order;
      }
    }

    const query = qs.stringify(queryParams, { skipNulls: true, arrayFormat: 'brackets' });
    const qsStr = query ? `?${query}` : '';

    const response = await this.client.get<ListContactsResponse>(`/api/v4/contacts${qsStr}`);
    return response.data;
  }

  async getById(
    id: number,
    params?: { with?: ContactWithParam[] | string }
  ): Promise<Contact | null> {
    try {
      const queryParams: any = {};
      if (params?.with) {
        queryParams.with = Array.isArray(params.with) ? params.with.join(',') : params.with;
      }
      
      const query = qs.stringify(queryParams, { skipNulls: true });
      const qsStr = query ? `?${query}` : '';

      const response = await this.client.get<Contact>(`/api/v4/contacts/${id}${qsStr}`);
      if (response.status === 204 || !response.data || (response.data as unknown) === '') {
        return null;
      }
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 204) {
         return null;
      }
      throw error;
    }
  }

  async create(items: CreateContactInput | CreateContactInput[]): Promise<CreateContactsResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.post<CreateContactsResponse>('/api/v4/contacts', payload);
    return response.data;
  }

  async update(items: UpdateContactInput | UpdateContactInput[]): Promise<UpdateContactsResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.patch<UpdateContactsResponse>('/api/v4/contacts', payload);
    return response.data;
  }

  async updateOne(id: number, payload: UpdateSingleContactInput): Promise<UpdateContactsResponse> {
    const response = await this.client.patch<UpdateContactsResponse>(`/api/v4/contacts/${id}`, payload);
    return response.data;
  }
}

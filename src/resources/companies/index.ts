import qs from 'qs';
import { BaseResource } from '../../base';
import {
  ListCompaniesParams,
  ListCompaniesResponse,
  Company,
  CompanyWithParam,
  CreateCompanyInput,
  CreateCompaniesResponse,
  UpdateCompanyInput,
  UpdateCompaniesResponse,
  UpdateSingleCompanyInput,
} from './types';

export class CompaniesResource extends BaseResource {
  
  async list(params?: ListCompaniesParams): Promise<ListCompaniesResponse> {
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
        const key = `filter_${k}` as keyof ListCompaniesParams;
        if (params[key] !== undefined) filter[k] = params[key];
      });

      // Range Filters (from/to)
      const rangeFilters = ['created_at', 'updated_at', 'closest_task_at'];
      rangeFilters.forEach(k => {
        const fromKey = `filter_${k}_from` as keyof ListCompaniesParams;
        const toKey = `filter_${k}_to` as keyof ListCompaniesParams;
        
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

    const response = await this.client.get<ListCompaniesResponse>(`/api/v4/companies${qsStr}`);
    return response.data;
  }

  async getById(
    id: number,
    params?: { with?: CompanyWithParam[] | string }
  ): Promise<Company | null> {
    try {
      const queryParams: any = {};
      if (params?.with) {
        queryParams.with = Array.isArray(params.with) ? params.with.join(',') : params.with;
      }
      
      const query = qs.stringify(queryParams, { skipNulls: true });
      const qsStr = query ? `?${query}` : '';

      const response = await this.client.get<Company>(`/api/v4/companies/${id}${qsStr}`);
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

  async create(items: CreateCompanyInput | CreateCompanyInput[]): Promise<CreateCompaniesResponse> {
    const payload = Array.isArray(items) ? items : [items];
    return this.postIdempotent<CreateCompaniesResponse, CreateCompanyInput>('/api/v4/companies', payload);
  }

  async update(items: UpdateCompanyInput | UpdateCompanyInput[]): Promise<UpdateCompaniesResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.patch<UpdateCompaniesResponse>('/api/v4/companies', payload);
    return response.data;
  }

  async updateOne(id: number, payload: UpdateSingleCompanyInput): Promise<UpdateCompaniesResponse> {
    const response = await this.client.patch<UpdateCompaniesResponse>(`/api/v4/companies/${id}`, payload);
    return response.data;
  }
}

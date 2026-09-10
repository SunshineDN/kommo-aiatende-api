import qs from 'qs';
import { BaseResource } from '../../base';
import {
  ListLeadsParams,
  ListLeadsResponse,
  Lead,
  LeadWithParam,
  CreateLeadInput,
  CreateLeadsResponse,
  UpdateLeadInput,
  UpdateLeadsResponse,
  UpdateSingleLeadInput,
  CreateComplexLeadInput,
  CreateComplexLeadsResponse,
  LossReason,
  ListLossReasonsResponse,
} from './types';

export class LeadsResource extends BaseResource {
  
  async list(params?: ListLeadsParams): Promise<ListLeadsResponse> {
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
      
      const arrayFilters = ['id', 'name', 'created_by', 'updated_by', 'responsible_user_id', 'pipeline_id'] as const;
      arrayFilters.forEach(k => {
        const key = `filter_${k}` as keyof ListLeadsParams;
        if (params[key] !== undefined) filter[k] = params[key];
      });

      if (params.filter_price !== undefined) filter.price = params.filter_price;

      // Range Filters (from/to)
      const rangeFilters = ['created_at', 'updated_at', 'closed_at', 'closest_task_at'];
      rangeFilters.forEach(k => {
        const fromKey = `filter_${k}_from` as keyof ListLeadsParams;
        const toKey = `filter_${k}_to` as keyof ListLeadsParams;
        
        if (params[fromKey] !== undefined || params[toKey] !== undefined) {
          filter[k] = {};
          if (params[fromKey] !== undefined) filter[k].from = params[fromKey];
          if (params[toKey] !== undefined) filter[k].to = params[toKey];
        }
      });

      if (params.filter_statuses && params.filter_statuses.length > 0) {
        filter.statuses = params.filter_statuses;
      }

      if (Object.keys(filter).length > 0) {
        queryParams.filter = filter;
      }

      // Ordenação
      const order: any = {};
      if (params.order_created_at) order.created_at = params.order_created_at;
      if (params.order_updated_at) order.updated_at = params.order_updated_at;
      if (params.order_id) order.id = params.order_id;
      
      if (Object.keys(order).length > 0) {
        queryParams.order = order;
      }
    }

    const query = qs.stringify(queryParams, { skipNulls: true, arrayFormat: 'brackets' });
    const qsStr = query ? `?${query}` : '';

    const response = await this.client.get<ListLeadsResponse>(`/api/v4/leads${qsStr}`);
    return response.data;
  }

  async getById(id: number, params?: { with?: LeadWithParam[] | string }): Promise<Lead | null> {
    try {
      const queryParams: any = {};
      if (params?.with) {
        queryParams.with = Array.isArray(params.with) ? params.with.join(',') : params.with;
      }
      
      const query = qs.stringify(queryParams, { skipNulls: true });
      const qsStr = query ? `?${query}` : '';

      const response = await this.client.get<Lead>(`/api/v4/leads/${id}${qsStr}`);
      if (response.status === 204 || !response.data || (response.data as unknown) === '') {
        return null; // AAPI resolve como NO CONTENT corretamente via interceptador caso seja vazio
      }
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 204) {
         return null;
      }
      throw error;
    }
  }

  async create(items: CreateLeadInput | CreateLeadInput[]): Promise<CreateLeadsResponse> {
    const payload = Array.isArray(items) ? items : [items];
    return this.postIdempotent<CreateLeadsResponse, CreateLeadInput>('/api/v4/leads', payload);
  }

  async update(items: UpdateLeadInput | UpdateLeadInput[]): Promise<UpdateLeadsResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.patch<UpdateLeadsResponse>('/api/v4/leads', payload);
    return response.data;
  }

  async updateOne(id: number, payload: UpdateSingleLeadInput): Promise<UpdateLeadsResponse | Lead> {
    const response = await this.client.patch<UpdateLeadsResponse | Lead>(`/api/v4/leads/${id}`, payload);
    return response.data;
  }

  async createComplex(items: CreateComplexLeadInput | CreateComplexLeadInput[]): Promise<CreateComplexLeadsResponse> {
    const payload = Array.isArray(items) ? items : [items];
    return this.postIdempotent<CreateComplexLeadsResponse, CreateComplexLeadInput>('/api/v4/leads/complex', payload);
  }

  async listLossReasons(): Promise<ListLossReasonsResponse> {
    const response = await this.client.get<ListLossReasonsResponse>('/api/v4/leads/loss_reasons');
    return response.data;
  }

  async getLossReasonById(id: number): Promise<LossReason> {
    const response = await this.client.get<LossReason>(`/api/v4/leads/loss_reasons/${id}`);
    return response.data;
  }
}

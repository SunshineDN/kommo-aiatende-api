import qs from 'qs';
import { BaseResource } from '../../base';
import {
  ListUnsortedLeadsParams,
  ListUnsortedLeadsResponse,
  UnsortedLead,
  CreateSipUnsortedLeadInput,
  CreateFormUnsortedLeadInput,
  CreateUnsortedLeadsResponse,
  UnsortedDecisionResponse,
  LinkUnsortedLeadResponse,
  UnsortedSummaryParams,
  UnsortedSummaryResponse,
} from './types';

export class UnsortedResource extends BaseResource {
  
  async list(params?: ListUnsortedLeadsParams): Promise<ListUnsortedLeadsResponse> {
    const query = qs.stringify(
      {
        page: params?.page,
        limit: params?.limit,
        filter: {
          uid: params?.uid,
          category: params?.category,
          pipeline_id: params?.pipeline_id,
        },
        order: {
          created_at: params?.order_created_at,
        },
      },
      { skipNulls: true, arrayFormat: 'brackets' }
    );

    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<ListUnsortedLeadsResponse>(`/api/v4/leads/unsorted${qsStr}`);
    return response.data;
  }

  async getByUid(uid: string): Promise<UnsortedLead> {
    const response = await this.client.get<UnsortedLead>(`/api/v4/leads/unsorted/${uid}`);
    return response.data;
  }

  async createSip(
    items: CreateSipUnsortedLeadInput | CreateSipUnsortedLeadInput[]
  ): Promise<CreateUnsortedLeadsResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.post<CreateUnsortedLeadsResponse>(
      '/api/v4/leads/unsorted/sip',
      payload
    );
    return response.data;
  }

  async createForms(
    items: CreateFormUnsortedLeadInput | CreateFormUnsortedLeadInput[]
  ): Promise<CreateUnsortedLeadsResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.post<CreateUnsortedLeadsResponse>(
      '/api/v4/leads/unsorted/forms',
      payload
    );
    return response.data;
  }

  async accept(
    uid: string,
    payload?: { user_id?: number; status_id?: number }
  ): Promise<UnsortedDecisionResponse> {
    const response = await this.client.post<UnsortedDecisionResponse>(
      `/api/v4/leads/unsorted/${uid}/accept`,
      payload || {}
    );
    return response.data;
  }

  async decline(
    uid: string,
    payload?: { user_id?: number }
  ): Promise<UnsortedDecisionResponse> {
    const config = payload ? { data: payload } : {};
    const response = await this.client.delete<UnsortedDecisionResponse>(
      `/api/v4/leads/unsorted/${uid}/decline`,
      config
    );
    return response.data;
  }

  async link(
    uid: string,
    payload: {
      link: {
        user_id?: string | number;
        entity_id: string | number;
        entity_type: 'leads' | string;
        metadata?: { contact_id?: number };
      };
    }
  ): Promise<LinkUnsortedLeadResponse> {
    const response = await this.client.post<LinkUnsortedLeadResponse>(
      `/api/v4/leads/unsorted/${uid}/link`,
      payload
    );
    return response.data;
  }

  async summary(params?: UnsortedSummaryParams): Promise<UnsortedSummaryResponse> {
    const queryParams: any = {};
    if (params?.uid) queryParams.uid = params.uid;
    if (params?.pipeline_id) queryParams.pipeline_id = params.pipeline_id;

    if (params?.created_at) {
      queryParams.created_at = params.created_at;
    } else if (params?.created_at_from || params?.created_at_to) {
      queryParams.created_at = {};
      if (params.created_at_from) queryParams.created_at.from = params.created_at_from;
      if (params.created_at_to) queryParams.created_at.to = params.created_at_to;
    }

    const query = qs.stringify(
      { filter: queryParams },
      { skipNulls: true, arrayFormat: 'brackets' }
    );

    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<UnsortedSummaryResponse>(
      `/api/v4/leads/unsorted/summary${qsStr}`
    );
    return response.data;
  }
}

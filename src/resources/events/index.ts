import qs from 'qs';
import { BaseResource } from '../../base';
import {
  ListEventsParams,
  ListEventsResponse,
  Event,
  ListEventTypesParams,
  ListEventTypesResponse,
} from './types';

export class EventsResource extends BaseResource {
  
  async list(params?: ListEventsParams): Promise<ListEventsResponse> {
    const queryParams: any = {};

    if (params) {
      if (params.page) queryParams.page = params.page;
      if (params.limit) queryParams.limit = params.limit;
      if (params.with) queryParams.with = Array.isArray(params.with) ? params.with.join(',') : params.with;

      const filter: any = {};
      if (params.filter_id !== undefined) filter.id = params.filter_id;
      if (params.filter_created_by !== undefined) filter.created_by = params.filter_created_by;
      if (params.filter_entity !== undefined) filter.entity = params.filter_entity;
      
      // Validação local: entity_id só pode ser usado se entity for único
      if (params.filter_entity_id !== undefined) {
        if (!params.filter_entity || (Array.isArray(params.filter_entity) && params.filter_entity.length !== 1)) {
           throw new Error("O filtro de 'entity_id' só pode ser passado quando houver uma única 'entity' informada.");
        }
        filter.entity_id = params.filter_entity_id;
      }
      
      if (params.filter_type !== undefined) filter.type = params.filter_type;

      if (params.filter_created_at_from !== undefined || params.filter_created_at_to !== undefined) {
        filter.created_at = {};
        if (params.filter_created_at_from !== undefined) filter.created_at.from = params.filter_created_at_from;
        if (params.filter_created_at_to !== undefined) filter.created_at.to = params.filter_created_at_to;
      }

      if (params.filter_value_before !== undefined) filter.value_before = params.filter_value_before;
      if (params.filter_value_after !== undefined) filter.value_after = params.filter_value_after;

      if (Object.keys(filter).length > 0) {
        queryParams.filter = filter;
      }
    }

    const query = qs.stringify(queryParams, { skipNulls: true, arrayFormat: 'brackets' });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<ListEventsResponse>(`/api/v4/events${qsStr}`);
    return response.data;
  }

  async getById(id: string, params?: { with?: import('./types').EventWithParam[] | string }): Promise<Event> {
    const queryParams: any = {};
    if (params?.with) {
      queryParams.with = Array.isArray(params.with) ? params.with.join(',') : params.with;
    }
    const query = qs.stringify(queryParams, { skipNulls: true });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<Event>(`/api/v4/events/${id}${qsStr}`);
    return response.data;
  }

  async listTypes(params?: ListEventTypesParams): Promise<ListEventTypesResponse> {
    const queryParams: any = {};
    if (params?.language_code) {
      queryParams.language_code = params.language_code;
    }
    const query = qs.stringify(queryParams, { skipNulls: true });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<ListEventTypesResponse>(`/api/v4/events/types${qsStr}`);
    return response.data;
  }
}

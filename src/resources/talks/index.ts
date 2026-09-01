import qs from 'qs';
import { BaseResource } from '../../base';
import { ListTalksParams, ListTalksResponse, CloseTalkParams } from './types';

export class TalksResource extends BaseResource {
  async list(params?: ListTalksParams): Promise<ListTalksResponse> {
    const queryParams: any = {};
    if (params) {
      if (params.page !== undefined) queryParams.page = params.page;
      if (params.limit !== undefined) queryParams.limit = params.limit;
      if (params.filter_talk_id !== undefined) queryParams.filter = { ...queryParams.filter, talk_id: params.filter_talk_id };
      if (params.filter_contact_id !== undefined) queryParams.filter = { ...queryParams.filter, contact_id: params.filter_contact_id };
      if (params.filter_entity_id !== undefined) queryParams.filter = { ...queryParams.filter, entity_id: params.filter_entity_id };
      if (params.filter_entity_type !== undefined) queryParams.filter = { ...queryParams.filter, entity_type: params.filter_entity_type };
      if (params.filter_only_in_work) queryParams.filter = { ...queryParams.filter, only_in_work: '' };
    }
    const query = qs.stringify(queryParams, { skipNulls: true, arrayFormat: 'brackets' });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<ListTalksResponse>(`/api/v4/talks${qsStr}`);
    if (response.status === 204 || !response.data) {
      return { _page: 1, _embedded: { talks: [] } };
    }
    return response.data;
  }

  async close(id: number, params?: CloseTalkParams): Promise<void> {
    await this.client.post(`/api/v4/talks/${id}/close`, params ?? {});
  }
}

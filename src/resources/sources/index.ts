import qs from 'qs';
import { BaseResource } from '../../base';
import {
  ListSourcesResponse,
  Source,
  CreateSourceInput,
  CreateSourcesResponse,
  UpdateSourceInput,
  UpdateSourceBatchInput,
  UpdateSourcesResponse,
  DeleteSourceBatchInput,
  ListWebsiteButtonsParams,
  ListWebsiteButtonsResponse,
  WebsiteButton,
  CreateWebsiteButtonInput,
  CreateWebsiteButtonResponse,
  UpdateWebsiteButtonInput,
} from './types';

export class SourcesResource extends BaseResource {
  async list(): Promise<ListSourcesResponse> {
    const response = await this.client.get<ListSourcesResponse>('/api/v4/sources');
    return response.data;
  }

  async getById(id: number): Promise<Source> {
    const response = await this.client.get<Source>(`/api/v4/sources/${id}`);
    return response.data;
  }

  async create(items: CreateSourceInput | CreateSourceInput[]): Promise<CreateSourcesResponse> {
    const payload = Array.isArray(items) ? items : [items];
    if (payload.length > 100) {
      throw new Error(`A API da Kommo limita a criação a no máximo 100 fontes por vez.`);
    }
    const response = await this.client.post<CreateSourcesResponse>('/api/v4/sources', payload);
    return response.data;
  }

  async updateOne(id: number, payload: UpdateSourceInput): Promise<Source> {
    const response = await this.client.patch<Source>(`/api/v4/sources/${id}`, payload);
    return response.data;
  }

  async update(items: UpdateSourceBatchInput | UpdateSourceBatchInput[]): Promise<UpdateSourcesResponse> {
    const payload = Array.isArray(items) ? items : [items];
    if (payload.length > 100) {
      throw new Error(`A API da Kommo limita a atualização a no máximo 100 fontes por vez.`);
    }
    const response = await this.client.patch<UpdateSourcesResponse>('/api/v4/sources', payload);
    return response.data;
  }

  async deleteOne(id: number): Promise<void> {
    await this.client.delete(`/api/v4/sources/${id}`);
  }

  async delete(items: DeleteSourceBatchInput | DeleteSourceBatchInput[]): Promise<void> {
    const payload = Array.isArray(items) ? items : [items];
    // OpenAPI documentation specifies to send array of objects for bulk delete
    await this.client.delete('/api/v4/sources', { data: payload });
  }
}

export class WebsiteButtonsResource extends BaseResource {
  async list(params?: ListWebsiteButtonsParams): Promise<ListWebsiteButtonsResponse> {
    const queryParams: any = {};
    if (params) {
      if (params.page !== undefined) queryParams.page = params.page;
      if (params.limit !== undefined) queryParams.limit = params.limit;
      if (params.with !== undefined) queryParams.with = params.with;
    }
    const query = qs.stringify(queryParams, { skipNulls: true });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<ListWebsiteButtonsResponse>(`/api/v4/website_buttons${qsStr}`);
    return response.data;
  }

  async getBySourceId(sourceId: number, params?: { with?: 'scripts' | string }): Promise<WebsiteButton> {
    const queryParams: any = {};
    if (params && params.with !== undefined) {
      queryParams.with = params.with;
    }
    const query = qs.stringify(queryParams, { skipNulls: true });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<WebsiteButton>(`/api/v4/website_buttons/${sourceId}${qsStr}`);
    return response.data;
  }

  async create(payload: CreateWebsiteButtonInput): Promise<CreateWebsiteButtonResponse> {
    if ((!payload.trusted_websites || payload.trusted_websites.length === 0) && !payload.is_used_in_app) {
       console.warn(`[WebsiteButtonsResource] A Kommo indica que se não enviar 'trusted_websites', é preciso enviar 'is_used_in_app' como true.`);
    }
    const response = await this.client.post<CreateWebsiteButtonResponse>('/api/v4/website_buttons', payload);
    return response.data;
  }

  async connectOnlineChat(sourceId: number | string): Promise<void> {
    await this.client.post(`/api/v4/website_buttons/${sourceId}/online_chat`);
  }

  async update(sourceId: number, payload: UpdateWebsiteButtonInput): Promise<WebsiteButton> {
    const response = await this.client.patch<WebsiteButton>(`/api/v4/website_buttons/${sourceId}`, payload);
    return response.data;
  }
}

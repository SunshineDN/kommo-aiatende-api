import qs from 'qs';
import { BaseResource } from '../../base';
import {
  ListWebhooksParams,
  ListWebhooksResponse,
  Webhook,
  CreateWebhookInput,
  DeleteWebhookInput
} from './types';

// Kommo's webhooks API only exposes GET/POST/DELETE (no PATCH), so there is
// no update() here by design — changing a webhook's events means delete + create.
export class WebhooksResource extends BaseResource {
  async list(params?: ListWebhooksParams): Promise<ListWebhooksResponse> {
    const queryParams: any = {};
    if (params) {
      const filter: any = {};
      if (params.filter_destination !== undefined) filter.destination = params.filter_destination;
      
      if (Object.keys(filter).length > 0) {
        queryParams.filter = filter;
      }
    }
    const query = qs.stringify(queryParams, { skipNulls: true, arrayFormat: 'brackets' });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<ListWebhooksResponse>(`/api/v4/webhooks${qsStr}`);
    
    if (response.status === 204 || !response.data) {
        return { _total_items: 0, _embedded: { webhooks: [] } };
    }
    return response.data;
  }

  async create(payload: CreateWebhookInput): Promise<Webhook> {
    const response = await this.client.post<Webhook>('/api/v4/webhooks', payload);
    return response.data;
  }

  async delete(payload: DeleteWebhookInput): Promise<void> {
    const data = { destination: payload.destination };
    await this.client.delete('/api/v4/webhooks', { data });
  }
}

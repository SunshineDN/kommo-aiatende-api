import { AxiosInstance } from 'axios';
import { RetryableAxiosRequestConfig } from './http/retry';
import { ensureRequestId } from './utils/idempotency';

export abstract class BaseResource {
  protected client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * POST de criação em lote marcado como seguro para retry: cada item recebe um
   * request_id (se ainda não tiver um) para que a Kommo deduplique reenvios após
   * falhas transitórias de rede, e a requisição fica elegível ao retry automático.
   */
  protected async postIdempotent<TResponse, TItem extends { request_id?: string }>(
    url: string,
    items: TItem[]
  ): Promise<TResponse> {
    const payload = items.map(ensureRequestId);
    const config: RetryableAxiosRequestConfig = { _idempotentRetry: true };
    const response = await this.client.post<TResponse>(url, payload, config);
    return response.data;
  }
}

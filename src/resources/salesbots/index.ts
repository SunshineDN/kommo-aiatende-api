import qs from 'qs';
import { BaseResource } from '../../base';
import {
  ListSalesbotsParams,
  ListSalesbotsResponse,
  RunSalesbotInput,
  RunManySalesbotsItem,
  StopSalesbotInput,
  SalesbotContinueBotType,
  SalesbotContinueInput,
} from './types';

export class SalesbotsResource extends BaseResource {
  async list(params?: ListSalesbotsParams): Promise<ListSalesbotsResponse> {
    const queryParams: any = {};
    if (params) {
      if (params.page !== undefined) queryParams.page = params.page;
      if (params.limit !== undefined) queryParams.limit = params.limit;
      if (params.with !== undefined) queryParams.with = params.with;
      
      const filter: any = {};
      if (params.filter_id !== undefined) filter.id = params.filter_id;
      if (params.filter_type_functionality !== undefined) filter.type_functionality = params.filter_type_functionality;
      
      if (Object.keys(filter).length > 0) {
        queryParams.filter = filter;
      }
    }
    const query = qs.stringify(queryParams, { skipNulls: true, arrayFormat: 'brackets' });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<ListSalesbotsResponse>(`/api/v4/bots${qsStr}`);
    
    if (response.status === 204 || !response.data) {
      return { _embedded: { items: [] } };
    }
    return response.data;
  }

  async run(botId: number | string, payload: RunSalesbotInput): Promise<void> {
    await this.client.post(`/api/v4/bots/${botId}/run`, payload);
  }

  async runMany(items: RunManySalesbotsItem | RunManySalesbotsItem[]): Promise<void> {
    const payload = Array.isArray(items) ? items : [items];
    if (payload.length > 100) {
      throw new Error(`A API da Kommo limita o 'runMany' a no máximo 100 salesbots por requisição. Você enviou ${payload.length}.`);
    }
    await this.client.post(`/api/v4/bots/run`, payload);
  }

  async stop(botId: number, payload: StopSalesbotInput): Promise<void> {
    await this.client.post(`/api/v4/bots/${botId}/stop`, payload);
  }

  async continueWidgetExecution(bot: SalesbotContinueBotType, botId: number, continueId: number, payload: SalesbotContinueInput): Promise<void> {
    if (payload.execute_handlers) {
      if (payload.execute_handlers.length > 10) {
        throw new Error(`A API da Kommo limita 'execute_handlers' a no máximo 10 itens. Você enviou ${payload.execute_handlers.length}.`);
      }

      for (const handler of payload.execute_handlers) {
        if (handler.handler === 'show') {
          if (handler.params.value && handler.params.value.length > 80) {
            console.warn(`[SalesbotResource] O campo 'value' em um handler 'show' tem ${handler.params.value.length} caracteres. A documentação aconselha no máximo 80.`);
          }
          if ('buttons' in handler.params && handler.params.buttons && handler.params.buttons.length > 25) {
             throw new Error(`A API da Kommo não permite mais do que 25 botões. Você tentou enviar ${handler.params.buttons.length}.`);
          }
        }
      }
    }

    await this.client.post(`/api/v4/${bot}/${botId}/continue/${continueId}`, payload);
  }
}

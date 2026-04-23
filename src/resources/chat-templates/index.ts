import qs from 'qs';
import { BaseResource } from '../../base';
import {
  ListChatTemplatesParams,
  ListChatTemplatesResponse,
  ChatTemplate,
  CreateChatTemplateInput,
  CreateChatTemplatesResponse,
  UpdateChatTemplateInput,
  UpdateChatTemplatesResponse,
  SubmitWhatsAppTemplateReviewResponse,
  UpdateWhatsAppTemplateReviewStatusInput,
  UpdateWhatsAppTemplateReviewStatusResponse,
  DeleteChatTemplateInput
} from './types';

export class ChatTemplatesResource extends BaseResource {
  async list(params?: ListChatTemplatesParams): Promise<ListChatTemplatesResponse> {
    const queryParams: any = {};
    if (params) {
      if (params.page !== undefined) queryParams.page = params.page;
      if (params.limit !== undefined) queryParams.limit = params.limit;
      if (params.with !== undefined) queryParams.with = params.with;

      const filter: any = {};
      if (params.filter_external_id !== undefined) filter.external_id = params.filter_external_id;

      if (Object.keys(filter).length > 0) {
        queryParams.filter = filter;
      }
    }
    const query = qs.stringify(queryParams, { skipNulls: true, arrayFormat: 'brackets' });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<ListChatTemplatesResponse>(`/api/v4/chats/templates${qsStr}`);
    
    if (response.status === 204 || !response.data) {
       return { _page: 1, _embedded: { chat_templates: [] } };
    }
    
    return response.data;
  }

  async getById(id: number, params?: { with?: 'reviews' | string }): Promise<ChatTemplate> {
    const queryParams: any = {};
    if (params && params.with !== undefined) {
      queryParams.with = params.with;
    }
    const query = qs.stringify(queryParams, { skipNulls: true });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<ChatTemplate>(`/api/v4/chats/templates/${id}${qsStr}`);
    return response.data;
  }

  async create(items: CreateChatTemplateInput | CreateChatTemplateInput[]): Promise<CreateChatTemplatesResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.post<CreateChatTemplatesResponse>('/api/v4/chats/templates', payload);
    return response.data;
  }

  async update(items: UpdateChatTemplateInput | UpdateChatTemplateInput[]): Promise<UpdateChatTemplatesResponse> {
    const payload = Array.isArray(items) ? items : [items];
    // Validação de segurança local para evitar erro HTTP opaco se o desenvolvedor tentar editar um Waba já aprovado.
    // Como a API não retorna o state no payload de input obrigatoriamente, enviamos um aviso (warning).
    const isWaba = payload.some(item => item.type === 'waba');
    if (isWaba) {
       console.warn(`[ChatTemplatesResource] Modelos do WhatsApp ('waba') só podem ser editados se o status for 'draft'. Modificar um template em 'review' ou 'approved' causará erro na API.`);
    }

    const response = await this.client.patch<UpdateChatTemplatesResponse>('/api/v4/chats/templates', payload);
    return response.data;
  }

  async submitForReview(id: number): Promise<SubmitWhatsAppTemplateReviewResponse> {
    const response = await this.client.post<SubmitWhatsAppTemplateReviewResponse>(`/api/v4/chats/templates/${id}/review`);
    return response.data;
  }

  async updateReviewStatus(id: number, reviewId: number, payload: UpdateWhatsAppTemplateReviewStatusInput): Promise<UpdateWhatsAppTemplateReviewStatusResponse> {
    const response = await this.client.post<UpdateWhatsAppTemplateReviewStatusResponse>(`/api/v4/chats/templates/${id}/review/${reviewId}`, payload);
    return response.data;
  }

  async delete(items: DeleteChatTemplateInput | DeleteChatTemplateInput[]): Promise<void> {
    const payload = Array.isArray(items) ? items : [items];
    await this.client.delete('/api/v4/chats/templates', { data: payload });
  }

  async deleteOne(id: number): Promise<void> {
    await this.client.delete(`/api/v4/chats/templates/${id}`);
  }
}

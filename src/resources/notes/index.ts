import qs from 'qs';
import { BaseResource } from '../../base';
import {
  NoteEntityType,
  ListEntityNotesParams,
  ListNotesResponse,
  Note,
  CreateNoteInput,
  CreateNotesResponse,
  UpdateNoteInput,
  UpdateSingleNoteInput,
  UpdateNotesResponse,
} from './types';

export class NotesResource extends BaseResource {
  
  private normalizeEntityType(type: NoteEntityType): string {
    if (type === 'contatos') return 'contacts';
    if (type === 'empresas') return 'companies';
    return type;
  }

  async listByEntity(entityType: NoteEntityType, entityId: number, params?: ListEntityNotesParams): Promise<ListNotesResponse> {
    const normalType = this.normalizeEntityType(entityType);
    const queryParams: any = {};

    if (params) {
      if (params.page) queryParams.page = params.page;
      if (params.limit) queryParams.limit = params.limit;

      const filter: any = {};
      if (params.filter_id !== undefined) filter.id = params.filter_id;
      if (params.filter_note_type !== undefined) filter.note_type = params.filter_note_type;
      
      if (params.filter_updated_at_from !== undefined || params.filter_updated_at_to !== undefined) {
        filter.updated_at = {};
        if (params.filter_updated_at_from !== undefined) filter.updated_at.from = params.filter_updated_at_from;
        if (params.filter_updated_at_to !== undefined) filter.updated_at.to = params.filter_updated_at_to;
      }
      
      if (Object.keys(filter).length > 0) {
        queryParams.filter = filter;
      }

      const order: any = {};
      if (params.order_updated_at !== undefined) order.updated_at = params.order_updated_at;
      if (params.order_id !== undefined) order.id = params.order_id;
      
      if (Object.keys(order).length > 0) {
        queryParams.order = order;
      }
    }

    const query = qs.stringify(queryParams, { skipNulls: true, arrayFormat: 'brackets' });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<ListNotesResponse>(`/api/v4/${normalType}/${entityId}/notes${qsStr}`);
    return response.data;
  }

  async listByEntityType(entityType: NoteEntityType, params?: ListEntityNotesParams): Promise<ListNotesResponse> {
    const normalType = this.normalizeEntityType(entityType);
    const queryParams: any = {};

    if (params) {
      if (params.page) queryParams.page = params.page;
      if (params.limit) queryParams.limit = params.limit;

      const filter: any = {};
      if (params.filter_id !== undefined) filter.id = params.filter_id;
      if (params.filter_note_type !== undefined) filter.note_type = params.filter_note_type;
      
      if (params.filter_updated_at_from !== undefined || params.filter_updated_at_to !== undefined) {
        filter.updated_at = {};
        if (params.filter_updated_at_from !== undefined) filter.updated_at.from = params.filter_updated_at_from;
        if (params.filter_updated_at_to !== undefined) filter.updated_at.to = params.filter_updated_at_to;
      }
      
      if (Object.keys(filter).length > 0) {
        queryParams.filter = filter;
      }

      const order: any = {};
      if (params.order_updated_at !== undefined) order.updated_at = params.order_updated_at;
      if (params.order_id !== undefined) order.id = params.order_id;
      
      if (Object.keys(order).length > 0) {
        queryParams.order = order;
      }
    }

    const query = qs.stringify(queryParams, { skipNulls: true, arrayFormat: 'brackets' });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<ListNotesResponse>(`/api/v4/${normalType}/notes${qsStr}`);
    return response.data;
  }

  async getById(entityType: NoteEntityType, id: number): Promise<Note> {
    const normalType = this.normalizeEntityType(entityType);
    const response = await this.client.get<Note>(`/api/v4/${normalType}/notes/${id}`);
    return response.data;
  }

  async create(entityType: NoteEntityType, items: CreateNoteInput | CreateNoteInput[]): Promise<CreateNotesResponse> {
    const normalType = this.normalizeEntityType(entityType);
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.post<CreateNotesResponse>(`/api/v4/${normalType}/notes`, payload);
    return response.data;
  }

  async update(entityType: NoteEntityType, items: UpdateNoteInput | UpdateNoteInput[]): Promise<UpdateNotesResponse> {
    const normalType = this.normalizeEntityType(entityType);
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.patch<UpdateNotesResponse>(`/api/v4/${normalType}/notes`, payload);
    return response.data;
  }

  async updateOne(entityType: NoteEntityType, id: number | string, payload: UpdateSingleNoteInput): Promise<UpdateNotesResponse> {
    const normalType = this.normalizeEntityType(entityType);
    const response = await this.client.patch<UpdateNotesResponse>(`/api/v4/${normalType}/notes/${id}`, payload);
    return response.data;
  }

  async pin(entityType: NoteEntityType, id: number): Promise<void> {
    const normalType = this.normalizeEntityType(entityType);
    await this.client.post(`/api/v4/${normalType}/notes/${id}/pin`);
  }

  async unpin(entityType: NoteEntityType, id: number): Promise<void> {
    const normalType = this.normalizeEntityType(entityType);
    await this.client.post(`/api/v4/${normalType}/notes/${id}/unpin`);
  }
}

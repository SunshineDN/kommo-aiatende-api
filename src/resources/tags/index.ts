import qs from 'qs';
import { BaseResource } from '../../base';
import {
  TagEntityType,
  ListTagsParams,
  ListTagsResponse,
  CreateTagInput,
  CreateTagsResponse,
  UpdateEntityTagsInput,
  UpdateEntityTagsBatchResponse,
  UpdateSingleEntityTagsInput,
  UpdateEntityTagsSingleResponse
} from './types';

export class TagsResource extends BaseResource {
  async list(entityType: TagEntityType, params?: ListTagsParams): Promise<ListTagsResponse> {
    const queryParams: any = {};
    if (params) {
      if (params.page !== undefined) queryParams.page = params.page;
      if (params.limit !== undefined) queryParams.limit = params.limit;
      if (params.query !== undefined) queryParams.query = params.query;
      
      const filter: any = {};
      if (params.filter_id !== undefined) filter.id = params.filter_id;
      if (params.filter_name !== undefined) filter.name = params.filter_name;
      
      if (Object.keys(filter).length > 0) {
        queryParams.filter = filter;
      }
    }
    const query = qs.stringify(queryParams, { skipNulls: true, arrayFormat: 'brackets' });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<ListTagsResponse>(`/api/v4/${entityType}/tags${qsStr}`);
    
    // Tratando o 204
    if (response.status === 204 || !response.data) {
      return { _page: 1, _embedded: { tags: [] } };
    }
    return response.data;
  }

  async create(entityType: TagEntityType, items: CreateTagInput | CreateTagInput[]): Promise<CreateTagsResponse> {
    const payload = Array.isArray(items) ? items : [items];
    
    // Validate that only leads support colors
    if (entityType !== 'leads') {
        const hasColor = payload.some(p => p.color !== undefined);
        if (hasColor) {
            console.warn(`[TagsResource] A documentação indica que propriedades de cor na tag só são aceitas para a entidade 'leads'. Sua requisição foi feita para '${entityType}' com cor.`);
        }
    }

    const response = await this.client.post<CreateTagsResponse>(`/api/v4/${entityType}/tags`, payload);
    return response.data;
  }

  async updateForMany(entityType: TagEntityType, items: UpdateEntityTagsInput | UpdateEntityTagsInput[]): Promise<UpdateEntityTagsBatchResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.patch<UpdateEntityTagsBatchResponse>(`/api/v4/${entityType}`, payload);
    return response.data;
  }

  async updateForOne(entityType: TagEntityType, id: number, payload: UpdateSingleEntityTagsInput): Promise<UpdateEntityTagsSingleResponse> {
    const response = await this.client.patch<UpdateEntityTagsSingleResponse>(`/api/v4/${entityType}/${id}`, payload);
    return response.data;
  }
}

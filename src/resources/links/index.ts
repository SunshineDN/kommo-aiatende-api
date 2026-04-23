import qs from 'qs';
import { BaseResource } from '../../base';
import {
  LinkSourceEntityType,
  ListEntityLinksParams,
  ListEntityLinksResponse,
  CreateEntityLinkInput,
  CreateEntityLinksResponse,
  DeleteEntityLinkInput
} from './types';

export class LinksResource extends BaseResource {
  async list(entity: LinkSourceEntityType, entityId: number, params?: ListEntityLinksParams): Promise<ListEntityLinksResponse> {
    const queryParams: any = {};
    if (params) {
      const filter: any = {};
      
      // Validação combinada: filter_to_entity_id e filter_to_entity_type devem ser usados juntos
      const hasEntityId = params.filter_to_entity_id !== undefined;
      const hasEntityType = params.filter_to_entity_type !== undefined;

      if (hasEntityId !== hasEntityType) {
         throw new Error("A API exige que 'filter_to_entity_id' e 'filter_to_entity_type' sejam fornecidos juntos no filtro de vínculos.");
      }

      if (hasEntityId) filter.to_entity_id = params.filter_to_entity_id;
      if (hasEntityType) filter.to_entity_type = params.filter_to_entity_type;
      
      if (params.filter_to_catalog_id !== undefined) filter.to_catalog_id = params.filter_to_catalog_id;

      if (Object.keys(filter).length > 0) {
        queryParams.filter = filter;
      }
    }

    const query = qs.stringify(queryParams, { skipNulls: true, arrayFormat: 'brackets' });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<ListEntityLinksResponse>(`/api/v4/${entity}/${entityId}/links${qsStr}`);
    
    return response.data;
  }

  async link(entity: LinkSourceEntityType, entityId: number, items: CreateEntityLinkInput | CreateEntityLinkInput[]): Promise<CreateEntityLinksResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.post<CreateEntityLinksResponse>(`/api/v4/${entity}/${entityId}/link`, payload);
    return response.data;
  }

  async unlink(entity: LinkSourceEntityType, entityId: number, items: DeleteEntityLinkInput | DeleteEntityLinkInput[]): Promise<void> {
    const payload = Array.isArray(items) ? items : [items];
    await this.client.post(`/api/v4/${entity}/${entityId}/unlink`, payload);
  }
}

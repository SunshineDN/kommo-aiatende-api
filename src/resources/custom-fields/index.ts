import { BaseResource } from '../../base';
import {
  EntityType,
  ListEntityCustomFieldsResponse,
  EntityCustomField,
  CreateEntityCustomFieldInput,
  UpdateEntityCustomFieldInput,
  UpdateSingleEntityCustomFieldInput,
  ListListCustomFieldsResponse,
  ListCustomField,
  CreateListCustomFieldInput,
  UpdateListCustomFieldInput,
  UpdateSingleListCustomFieldInput,
  ListCustomFieldGroupsResponse,
  CustomFieldGroup,
  CreateCustomFieldGroupInput,
  UpdateCustomFieldGroupInput
} from './types';

export class CustomFieldsResource extends BaseResource {

  // ==== CAMPOS DE ENTIDADES ====

  async listEntity(entityType: EntityType): Promise<ListEntityCustomFieldsResponse> {
    const response = await this.client.get<ListEntityCustomFieldsResponse>(`/api/v4/${entityType}/custom_fields`);
    return response.data;
  }

  async getEntityById(entityType: EntityType, id: number): Promise<EntityCustomField> {
    const response = await this.client.get<EntityCustomField>(`/api/v4/${entityType}/custom_fields/${id}`);
    return response.data;
  }

  async createEntity(entityType: EntityType, items: CreateEntityCustomFieldInput | CreateEntityCustomFieldInput[]): Promise<ListEntityCustomFieldsResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.post<ListEntityCustomFieldsResponse>(`/api/v4/${entityType}/custom_fields`, payload);
    return response.data;
  }

  async updateEntity(entityType: EntityType, items: UpdateEntityCustomFieldInput | UpdateEntityCustomFieldInput[]): Promise<ListEntityCustomFieldsResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.patch<ListEntityCustomFieldsResponse>(`/api/v4/${entityType}/custom_fields`, payload);
    return response.data;
  }

  async updateEntityById(entityType: EntityType, id: number, payload: UpdateSingleEntityCustomFieldInput): Promise<EntityCustomField> {
    const response = await this.client.patch<EntityCustomField>(`/api/v4/${entityType}/custom_fields/${id}`, payload);
    return response.data;
  }

  async deleteEntity(entityType: EntityType, id: number): Promise<void> {
    await this.client.delete(`/api/v4/${entityType}/custom_fields/${id}`);
  }

  // ==== CAMPOS DE LISTAS ====

  async listList(listId: number): Promise<ListListCustomFieldsResponse> {
    const response = await this.client.get<ListListCustomFieldsResponse>(`/api/v4/catalogs/${listId}/custom_fields`);
    return response.data;
  }

  async getListById(listId: number, customFieldId: number): Promise<ListCustomField | EntityCustomField> {
    const response = await this.client.get<ListCustomField | EntityCustomField>(`/api/v4/catalogs/${listId}/custom_fields/${customFieldId}`);
    return response.data;
  }

  async createList(listId: number, items: CreateListCustomFieldInput | CreateListCustomFieldInput[]): Promise<ListListCustomFieldsResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.post<ListListCustomFieldsResponse>(`/api/v4/catalogs/${listId}/custom_fields`, payload);
    return response.data;
  }

  async updateList(listId: number, items: UpdateListCustomFieldInput | UpdateListCustomFieldInput[]): Promise<ListListCustomFieldsResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.patch<ListListCustomFieldsResponse>(`/api/v4/catalogs/${listId}/custom_fields`, payload);
    return response.data;
  }

  async updateListById(listId: number, customFieldId: number, payload: UpdateSingleListCustomFieldInput): Promise<ListCustomField> {
    const response = await this.client.patch<ListCustomField>(`/api/v4/catalogs/${listId}/custom_fields/${customFieldId}`, payload);
    return response.data;
  }

  async deleteList(listId: number, id: number): Promise<void> {
    await this.client.delete(`/api/v4/catalogs/${listId}/custom_fields/${id}`);
  }
}

export class CustomFieldGroupsResource extends BaseResource {

  async list(entityType: EntityType): Promise<ListCustomFieldGroupsResponse> {
    const response = await this.client.get<ListCustomFieldGroupsResponse>(`/api/v4/${entityType}/custom_fields/groups`);
    return response.data;
  }

  async getById(entityType: EntityType, id: number): Promise<CustomFieldGroup> {
    const response = await this.client.get<CustomFieldGroup>(`/api/v4/${entityType}/custom_fields/groups/${id}`);
    return response.data;
  }

  async create(entityType: EntityType, items: CreateCustomFieldGroupInput | CreateCustomFieldGroupInput[]): Promise<ListCustomFieldGroupsResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.post<ListCustomFieldGroupsResponse>(`/api/v4/${entityType}/custom_fields/groups`, payload);
    return response.data;
  }

  async update(entityType: EntityType, id: number, payload: UpdateCustomFieldGroupInput): Promise<CustomFieldGroup> {
    const response = await this.client.patch<CustomFieldGroup>(`/api/v4/${entityType}/custom_fields/groups/${id}`, payload);
    return response.data;
  }

  async delete(entityType: EntityType, id: number): Promise<void> {
    await this.client.delete(`/api/v4/${entityType}/custom_fields/groups/${id}`);
  }

}

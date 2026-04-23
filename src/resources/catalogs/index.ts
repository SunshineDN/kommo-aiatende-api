import qs from 'qs';
import { BaseResource } from '../../base';
import {
  ListCatalogsParams,
  ListCatalogsResponse,
  Catalog,
  CreateCatalogInput,
  CreateCatalogsResponse,
  UpdateCatalogInput,
  UpdateCatalogsResponse,
  UpdateSingleCatalogInput,
  ListCatalogElementsParams,
  ListCatalogElementsResponse,
  CatalogElement,
  CreateCatalogElementInput,
  CreateCatalogElementsResponse,
  UpdateCatalogElementInput,
  UpdateCatalogElementsResponse,
  UpdateSingleCatalogElementInput,
} from './types';

export class CatalogsResource extends BaseResource {
  
  // ================= CATÁLOGOS (LISTAS) =================
  
  async list(params?: ListCatalogsParams): Promise<ListCatalogsResponse> {
    const query = qs.stringify({ page: params?.page, limit: params?.limit }, { skipNulls: true });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<ListCatalogsResponse>(`/api/v4/catalogs${qsStr}`);
    return response.data;
  }

  async getById(id: number): Promise<Catalog> {
    const response = await this.client.get<Catalog>(`/api/v4/catalogs/${id}`);
    return response.data;
  }

  async create(items: CreateCatalogInput | CreateCatalogInput[]): Promise<CreateCatalogsResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.post<CreateCatalogsResponse>('/api/v4/catalogs', payload);
    return response.data;
  }

  async update(items: UpdateCatalogInput | UpdateCatalogInput[]): Promise<UpdateCatalogsResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.patch<UpdateCatalogsResponse>('/api/v4/catalogs', payload);
    return response.data;
  }

  async updateOne(id: number, payload: UpdateSingleCatalogInput): Promise<Catalog> {
    const response = await this.client.patch<Catalog>(`/api/v4/catalogs/${id}`, payload);
    return response.data;
  }

  // ================= ELEMENTOS DO CATÁLOGO =================

  async listElements(listId: number, params?: ListCatalogElementsParams): Promise<ListCatalogElementsResponse> {
    const queryParams: any = {};

    if (params) {
      if (params.page) queryParams.page = params.page;
      if (params.limit) queryParams.limit = params.limit;
      if (params.query) queryParams.query = params.query;
      
      const filter: any = {};
      if (params.filter_id !== undefined) filter.id = params.filter_id;

      if (Object.keys(filter).length > 0) {
        queryParams.filter = filter;
      }
    }

    const query = qs.stringify(queryParams, { skipNulls: true, arrayFormat: 'brackets' });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<ListCatalogElementsResponse>(`/api/v4/catalogs/${listId}/elements${qsStr}`);
    return response.data;
  }

  async getElementById(listId: number, elementId: number): Promise<CatalogElement> {
    const response = await this.client.get<CatalogElement>(`/api/v4/catalogs/${listId}/elements/${elementId}`);
    return response.data;
  }

  async createElements(listId: number, items: CreateCatalogElementInput | CreateCatalogElementInput[]): Promise<CreateCatalogElementsResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.post<CreateCatalogElementsResponse>(`/api/v4/catalogs/${listId}/elements`, payload);
    return response.data;
  }

  async updateElements(listId: number, items: UpdateCatalogElementInput | UpdateCatalogElementInput[]): Promise<UpdateCatalogElementsResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.patch<UpdateCatalogElementsResponse>(`/api/v4/catalogs/${listId}/elements`, payload);
    return response.data;
  }

  async updateElementById(listId: number, elementId: number, payload: UpdateSingleCatalogElementInput): Promise<CatalogElement> {
    const response = await this.client.patch<CatalogElement>(`/api/v4/catalogs/${listId}/elements/${elementId}`, payload);
    return response.data;
  }
}

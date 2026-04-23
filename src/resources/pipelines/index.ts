import qs from 'qs';
import { BaseResource } from '../../base';
import {
  Pipeline,
  PipelineStatus,
  ListPipelinesResponse,
  CreatePipelineInput,
  CreatePipelinesResponse,
  UpdatePipelineInput,
  ListPipelineStatusesResponse,
  CreateStatusInput,
  CreateStatusesResponse,
  UpdateStatusInput,
  StatusDescription,
} from './types';

export class PipelinesResource extends BaseResource {
  
  // PIPELINES

  async list(): Promise<ListPipelinesResponse> {
    const response = await this.client.get<ListPipelinesResponse>('/api/v4/leads/pipelines');
    return response.data;
  }

  async getById(id: number): Promise<Pipeline> {
    const response = await this.client.get<Pipeline>(`/api/v4/leads/pipelines/${id}`);
    return response.data;
  }

  async create(items: CreatePipelineInput | CreatePipelineInput[]): Promise<CreatePipelinesResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.post<CreatePipelinesResponse>('/api/v4/leads/pipelines', payload);
    return response.data;
  }

  async update(id: number, payload: UpdatePipelineInput): Promise<Pipeline> {
    const response = await this.client.patch<Pipeline>(`/api/v4/leads/pipelines/${id}`, payload);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/api/v4/leads/pipelines/${id}`);
  }

  // STATUSES (ETAPAS)

  async listStatuses(pipelineId: number, params?: { with?: 'descriptions' }): Promise<ListPipelineStatusesResponse> {
    const query = qs.stringify({ with: params?.with }, { skipNulls: true });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<ListPipelineStatusesResponse>(`/api/v4/leads/pipelines/${pipelineId}/statuses${qsStr}`);
    return response.data;
  }

  async getStatusById(pipelineId: number, id: number | string, params?: { with?: 'descriptions' }): Promise<PipelineStatus> {
    const query = qs.stringify({ with: params?.with }, { skipNulls: true });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<PipelineStatus>(`/api/v4/leads/pipelines/${pipelineId}/statuses/${id}${qsStr}`);
    return response.data;
  }

  async createStatuses(pipelineId: number, items: CreateStatusInput | CreateStatusInput[]): Promise<CreateStatusesResponse> {
    const payload = Array.isArray(items) ? items : [items];
    
    // Validate descriptions locally before sending payload
    payload.forEach(item => this.validateStatusDescriptions(item.descriptions));

    const response = await this.client.post<CreateStatusesResponse>(`/api/v4/leads/pipelines/${pipelineId}/statuses`, payload);
    return response.data;
  }

  async updateStatus(pipelineId: number, id: number | string, payload: UpdateStatusInput): Promise<PipelineStatus> {
    this.validateStatusDescriptions(payload.descriptions);

    const response = await this.client.patch<PipelineStatus>(`/api/v4/leads/pipelines/${pipelineId}/statuses/${id}`, payload);
    return response.data;
  }

  async deleteStatus(pipelineId: number, id: number | string): Promise<void> {
    await this.client.delete(`/api/v4/leads/pipelines/${pipelineId}/statuses/${id}`);
  }

  private validateStatusDescriptions(descriptions?: StatusDescription[]) {
    if (!descriptions) return;

    if (descriptions.length > 3) {
      throw new Error('A etapa aceita no máximo 3 descrições.');
    }

    const levels = descriptions.map((d) => d.level);
    const uniqueLevels = new Set(levels);

    if (levels.length !== uniqueLevels.size) {
      throw new Error('Não é permitido repetir level em descriptions.');
    }

    for (const item of descriptions) {
      if (item.description.length > 1000) {
        throw new Error('A descrição da etapa pode ter no máximo 1000 caracteres.');
      }
    }
  }
}

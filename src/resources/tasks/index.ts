import qs from 'qs';
import { BaseResource } from '../../base';
import {
  ListTasksParams,
  ListTasksResponse,
  Task,
  CreateTaskInput,
  CreateTasksResponse,
  UpdateTaskInput,
  UpdateTasksResponse,
  UpdateSingleTaskInput
} from './types';

export class TasksResource extends BaseResource {
  
  async list(params?: ListTasksParams): Promise<ListTasksResponse> {
    const queryParams: any = {};

    if (params) {
      if (params.page) queryParams.page = params.page;
      if (params.limit) queryParams.limit = params.limit;

      const filter: any = {};
      if (params.filter_responsible_user_id !== undefined) filter.responsible_user_id = params.filter_responsible_user_id;
      if (params.filter_is_completed !== undefined) filter.is_completed = params.filter_is_completed;
      if (params.filter_task_type !== undefined) filter.task_type = params.filter_task_type;
      if (params.filter_entity_type !== undefined) filter.entity_type = params.filter_entity_type;
      if (params.filter_entity_id !== undefined) filter.entity_id = params.filter_entity_id;
      if (params.filter_id !== undefined) filter.id = params.filter_id;
      if (params.filter_updated_at_from !== undefined || params.filter_updated_at_to !== undefined) {
        filter.updated_at = {};
        if (params.filter_updated_at_from !== undefined) filter.updated_at.from = params.filter_updated_at_from;
        if (params.filter_updated_at_to !== undefined) filter.updated_at.to = params.filter_updated_at_to;
      }
      if (Object.keys(filter).length > 0) {
        queryParams.filter = filter;
      }

      const order: any = {};
      if (params.order_complete_till !== undefined) order.complete_till = params.order_complete_till;
      if (params.order_created_at !== undefined) order.created_at = params.order_created_at;
      if (params.order_id !== undefined) order.id = params.order_id;
      if (Object.keys(order).length > 0) {
        queryParams.order = order;
      }
    }

    const query = qs.stringify(queryParams, { skipNulls: true, arrayFormat: 'brackets' });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get<ListTasksResponse>(`/api/v4/tasks${qsStr}`);
    return response.data;
  }

  async getById(id: number): Promise<Task> {
    const response = await this.client.get<Task>(`/api/v4/tasks/${id}`);
    return response.data;
  }

  async create(items: CreateTaskInput | CreateTaskInput[]): Promise<CreateTasksResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.post<CreateTasksResponse>('/api/v4/tasks', payload);
    return response.data;
  }

  async update(items: UpdateTaskInput | UpdateTaskInput[]): Promise<UpdateTasksResponse> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.patch<UpdateTasksResponse>('/api/v4/tasks', payload);
    return response.data;
  }

  async updateOne(id: number, payload: UpdateSingleTaskInput): Promise<UpdateTasksResponse> {
    const response = await this.client.patch<UpdateTasksResponse>(`/api/v4/tasks/${id}`, payload);
    return response.data;
  }
}

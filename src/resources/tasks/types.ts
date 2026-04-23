export interface Task {
  id: number;
  created_by?: number;
  updated_by?: number;
  created_at?: number;
  updated_at?: number;
  responsible_user_id?: number;
  group_id?: number;
  entity_id?: number;
  entity_type?: 'leads' | 'contacts' | 'companies' | string;
  is_completed?: boolean;
  task_type_id?: number;
  text?: string;
  duration?: number;
  complete_till?: number;
  result?: {
    text?: string;
  } | Record<string, unknown> | null;
  account_id?: number;
  request_id?: string;
  _links?: {
    self?: {
      href: string;
    };
  };
}

export interface ListTasksParams {
  page?: number;
  limit?: number; // máximo 250

  filter_responsible_user_id?: number[];
  filter_is_completed?: 0 | 1;
  filter_task_type?: number[];
  filter_entity_type?: 'leads' | 'contacts' | 'companies';
  filter_entity_id?: number[];
  filter_id?: number[];

  filter_updated_at_from?: number;
  filter_updated_at_to?: number;

  order_complete_till?: 'asc' | 'desc';
  order_created_at?: 'asc' | 'desc';
  order_id?: 'asc' | 'desc';
}

export interface ListTasksResponse {
  _page: number;
  _links?: {
    self?: { href: string };
    next?: { href: string };
  };
  _embedded?: {
    tasks?: Task[];
  };
}

export interface CreateTaskInput {
  responsible_user_id?: number;
  entity_id?: number;
  entity_type?: 'leads' | 'contacts' | 'companies';
  is_completed?: boolean;
  task_type_id?: number;
  text: string;
  duration?: number;
  complete_till: number;
  result?: {
    text?: string;
  };
  created_by?: number;
  updated_by?: number;
  created_at?: number;
  updated_at?: number;
  request_id?: string;
}

export interface CreateTasksResponse {
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    tasks?: Array<{
      id: number;
      request_id?: string;
      _links?: {
        self?: { href: string };
      };
    }>;
  };
}

export interface UpdateTaskInput {
  id: number;
  responsible_user_id?: number;
  entity_id?: number;
  entity_type?: 'leads' | 'contacts' | 'companies';
  is_completed?: boolean;
  task_type_id?: number;
  text?: string;
  duration?: number;
  complete_till?: number;
  result?: {
    text?: string;
  };
}

export interface UpdateTasksResponse {
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    tasks?: Array<{
      id: number;
      updated_at: number;
      request_id?: string;
      _links?: {
        self?: { href: string };
      };
    }>;
  };
}

export type UpdateSingleTaskInput = Omit<UpdateTaskInput, 'id'>;

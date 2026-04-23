export interface Lead {
  id: number;
  name?: string | null;
  price?: number | null;
  responsible_user_id?: number | null;
  group_id?: number | null;
  status_id?: number | null;
  pipeline_id?: number | null;
  loss_reason_id?: number | null;
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: number | null;
  updated_at?: number | null;
  closed_at?: number | null;
  closest_task_at?: number | null;
  is_deleted?: boolean;
  custom_fields_values?: unknown[] | null;
  score?: number | null;
  account_id?: number | null;
  labor_cost?: number | null;
  source_id?: number | null;
  is_price_modified_by_robot?: boolean;
  is_price_computed?: boolean;
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    tags?: LeadTag[];
    contacts?: LeadContactRef[];
    companies?: LeadCompanyRef[];
    catalog_elements?: LeadCatalogElementRef[];
    loss_reason?: LossReason[] | LossReason;
    source?: {
      id?: number;
      name?: string;
    };
  };
}

export interface LeadTag {
  id?: number;
  name?: string;
  color?: string | null;
}

export interface LeadContactRef {
  id: number;
  is_main?: boolean;
  _links?: { self?: { href: string } };
}

export interface LeadCompanyRef {
  id: number;
  _links?: { self?: { href: string } };
}

export interface LeadCatalogElementRef {
  id: number;
  metadata?: Record<string, unknown>;
  quantity?: number;
  catalog_id?: number;
}

export type LeadWithParam =
  | 'contacts'
  | 'only_deleted'
  | 'loss_reason'
  | 'is_price_modified_by_robot'
  | 'catalog_elements'
  | 'source_id'
  | 'source';

export interface ListLeadsParams {
  with?: LeadWithParam[] | string;
  page?: number;
  limit?: number;
  query?: string;

  order_created_at?: 'asc' | 'desc';
  order_updated_at?: 'asc' | 'desc';
  order_id?: 'asc' | 'desc';

  filter_id?: number[];
  filter_name?: string[];
  filter_price?: number;
  filter_created_by?: number[];
  filter_updated_by?: number[];
  filter_responsible_user_id?: number[];

  filter_created_at_from?: number;
  filter_created_at_to?: number;
  filter_updated_at_from?: number;
  filter_updated_at_to?: number;
  filter_closed_at_from?: number;
  filter_closed_at_to?: number;
  filter_closest_task_at_from?: number;
  filter_closest_task_at_to?: number;

  filter_pipeline_id?: number[];

  filter_statuses?: Array<{
    pipeline_id: number;
    status_id: number;
  }>;
}

export interface ListLeadsResponse {
  _page: number;
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    leads?: Lead[];
  };
}

export interface LeadTagRef {
  id?: number;
  name?: string;
}

export interface CreateLeadInput {
  request_id?: string;
  name?: string;
  price?: number;
  status_id?: number;
  pipeline_id?: number;
  created_by?: number;
  updated_by?: number;
  created_at?: number;
  updated_at?: number;
  closed_at?: number;
  loss_reason_id?: string | number;
  responsible_user_id?: number;
  custom_fields_values?: unknown[] | string;

  _embedded?: {
    tags?: LeadTagRef[];
    contacts?: Array<{
      id: number;
      is_main?: boolean;
    }>;
    companies?: Array<{
      id: number;
    }>;
    source?: {
      external_id?: string;
      type?: 'widget' | string;
    };
  };

  tags_to_add?: LeadTagRef[];
  tags_to_delete?: LeadTagRef[];
}

export interface CreateLeadsResponse {
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    leads?: Array<{
      id: number;
      _links?: { self?: { href: string } };
    }>;
  };
  raw?: unknown;
}

export interface UpdateLeadInput {
  id: number;
  request_id?: string;

  name?: string;
  price?: number;
  status_id?: number;
  pipeline_id?: number;
  created_by?: number;
  updated_by?: number;
  created_at?: number;
  updated_at?: number;
  closed_at?: number;
  loss_reason_id?: number;
  responsible_user_id?: number;

  custom_fields_values?: unknown[] | string;

  _embedded?: {
    tags?: LeadTagRef[];
  };

  tags_to_add?: LeadTagRef[];
  tags_to_delete?: LeadTagRef[];
}

export interface UpdateLeadsResponse {
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    leads?: Array<{
      id: number;
      updated_at: number;
      _links?: {
        self?: { href: string };
      };
    }>;
  };
}

export type UpdateSingleLeadInput = Omit<UpdateLeadInput, 'id'>;

export interface CreateComplexLeadInput {
  request_id?: string;
  name?: string;
  price?: number;
  status_id?: number;
  pipeline_id?: number;
  created_by?: number;
  updated_by?: number;
  created_at?: number;
  updated_at?: number;
  closed_at?: number;
  loss_reason_id?: number;
  responsible_user_id?: number;
  custom_fields_values?: unknown[] | string;

  _embedded?: {
    tags?: LeadTagRef[];
    contacts?: Array<{
      id?: number;
      name?: string;
      first_name?: string;
      last_name?: string;
      created_at?: number;
      responsible_user_id?: number;
      updated_by?: number;
      custom_fields_values?: unknown[];
    }>;
    companies?: Array<{
      id?: number;
      name?: string;
      responsible_user_id?: number;
      custom_fields_values?: unknown[];
    }>;
  };
}

export interface CreateComplexLeadsResponseItem {
  id: number;
  contact_id?: number;
  company_id?: number;
  request_id: string[];
  merged: boolean;
}

export type CreateComplexLeadsResponse = CreateComplexLeadsResponseItem[];

export interface LossReason {
  id: number;
  name: string;
  sort: number;
  created_at: number;
  updated_at: number;
  _links?: {
    self?: { href: string };
  };
}

export interface ListLossReasonsResponse {
  _total_items?: number;
  _embedded?: {
    loss_reasons?: LossReason[];
  };
}

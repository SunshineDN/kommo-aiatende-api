export interface ContactTag {
  id?: number;
  name?: string;
  color?: string | null;
}

export interface ContactCompanyRef {
  id: number;
  _links?: {
    self?: { href: string };
  };
}

export interface ContactLeadRef {
  id: number;
  _links?: {
    self?: { href: string };
  };
}

export interface ContactCustomerRef {
  id: number;
  _links?: {
    self?: { href: string };
  };
}

export interface ContactCatalogElementRef {
  id: number;
  metadata?: Record<string, unknown>;
  quantity?: number;
  catalog_id?: number;
}

export interface Contact {
  id: number;
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  responsible_user_id?: number | null;
  group_id?: number | null;
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: number | null;
  updated_at?: number | null;
  closest_task_at?: number | null;
  custom_fields_values?: unknown[] | null;
  account_id?: number | null;
  is_deleted?: boolean;
  is_unsorted?: boolean;
  _links?: {
    self?: {
      href: string;
    };
  };
  _embedded?: {
    tags?: ContactTag[];
    companies?: ContactCompanyRef[];
    leads?: ContactLeadRef[];
    catalog_elements?: ContactCatalogElementRef[];
    customers?: ContactCustomerRef[];
  };
}

export type ContactWithParam = 'leads' | 'catalog_elements';

export interface ListContactsParams {
  with?: ContactWithParam[] | string;
  page?: number;
  limit?: number; // máximo 250
  query?: string;

  order_updated_at?: 'asc' | 'desc';
  order_id?: 'asc' | 'desc';

  filter_id?: number[];
  filter_name?: string[];
  filter_created_by?: number[];
  filter_updated_by?: number[];
  filter_responsible_user_id?: number[];

  filter_created_at_from?: number;
  filter_created_at_to?: number;

  filter_updated_at_from?: number;
  filter_updated_at_to?: number;

  filter_closest_task_at_from?: number;
  filter_closest_task_at_to?: number;
}

export interface ListContactsResponse {
  _page: number;
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    contacts?: Contact[];
  };
}

export interface ContactTagRef {
  id?: number;
  name?: string;
}

export interface CreateContactInput {
  request_id?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  responsible_user_id?: number;
  created_by?: number;
  updated_by?: number;
  created_at?: number;
  updated_at?: number;
  custom_fields_values?: unknown[] | string;

  _embedded?: {
    tags?: ContactTagRef[];
  };

  tags_to_add?: ContactTagRef[];
  tags_to_delete?: ContactTagRef[];
}

export interface CreateContactsResponse {
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    contacts?: Array<{
      id: number;
      is_deleted: boolean;
      is_unsorted: boolean;
      request_id?: string;
      _links?: {
        self?: { href: string };
      };
    }>;
  };
}

export interface UpdateContactInput {
  id: number;
  request_id?: string;

  name?: string;
  first_name?: string;
  last_name?: string;
  responsible_user_id?: number;
  created_by?: number;
  updated_by?: number;
  created_at?: number;
  updated_at?: number;
  custom_fields_values?: unknown[] | string;

  _embedded?: {
    tags?: ContactTagRef[];
  };

  tags_to_add?: ContactTagRef[];
  tags_to_delete?: ContactTagRef[];
}

export interface UpdateContactsResponse {
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    contacts?: Array<{
      id: number;
      name?: string;
      updated_at: number;
      is_deleted: boolean;
      is_unsorted: boolean;
      _links?: {
        self?: { href: string };
      };
    }>;
  };
}

export type UpdateSingleContactInput = Omit<UpdateContactInput, 'id'>;

export interface CompanyTag {
  id?: number;
  name?: string;
  color?: string | null;
}

export interface CompanyContactRef {
  id: number;
  _links?: {
    self?: { href: string };
  };
}

export interface CompanyLeadRef {
  id: number;
  _links?: {
    self?: { href: string };
  };
}

export interface CompanyCatalogElementRef {
  id: number;
  metadata?: Record<string, unknown>;
  quantity?: number;
  catalog_id?: number;
}

export interface Company {
  id: number;
  name?: string | null;
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
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    tags?: CompanyTag[];
    contacts?: CompanyContactRef[];
    leads?: CompanyLeadRef[];
    catalog_elements?: CompanyCatalogElementRef[];
  };
}

export type CompanyWithParam = 'leads' | 'contacts' | 'catalog_elements';

export interface ListCompaniesParams {
  with?: CompanyWithParam[] | string;
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

export interface ListCompaniesResponse {
  _page: number;
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    companies?: Company[];
  };
}

export interface CompanyTagRef {
  id?: number;
  name?: string;
}

export interface CreateCompanyInput {
  request_id?: string;
  name?: string;
  responsible_user_id?: number;
  created_by?: number;
  updated_by?: number;
  created_at?: number;
  updated_at?: number;
  custom_fields_values?: unknown[] | string;

  _embedded?: {
    tags?: CompanyTagRef[];
  };

  tags_to_add?: CompanyTagRef[];
}

export interface CreateCompaniesResponse {
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    companies?: Array<{
      id: number;
      is_deleted: boolean;
      request_id?: string;
      _links?: {
        self?: { href: string };
      };
    }>;
  };
}

export interface UpdateCompanyInput {
  id: number;
  request_id?: string;

  name?: string;
  responsible_user_id?: number;
  created_by?: number;
  updated_by?: number;
  created_at?: number;
  updated_at?: number;
  custom_fields_values?: unknown[] | string;

  _embedded?: {
    tags?: CompanyTagRef[];
  };

  tags_to_add?: CompanyTagRef[];
  tags_to_delete?: CompanyTagRef[];
}

export interface UpdateCompaniesResponse {
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    companies?: Array<{
      id: number;
      name?: string;
      updated_at: number;
      is_deleted: boolean;
      _links?: {
        self?: { href: string };
      };
    }>;
  };
}

export type UpdateSingleCompanyInput = Omit<UpdateCompanyInput, 'id'>;

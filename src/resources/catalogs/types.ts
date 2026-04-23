export interface Catalog {
  id: number;
  name: string;
  created_by: number;
  updated_by: number;
  created_at: number;
  updated_at: number;
  sort: number;
  type: string;
  can_link_multiple: boolean;
  can_be_deleted: boolean;
  account_id: number;

  can_add_elements?: boolean;
  can_show_in_cards?: boolean;
  sdk_widget_code?: string | null;
  request_id?: string;

  _links?: {
    self?: {
      href: string;
    };
  };
}

export interface CatalogElementCustomFieldValue {
  field_id: number;
  field_name?: string;
  field_code?: string;
  field_type?: string;
  values: Array<{
    value: string | number | boolean | null;
    enum_id?: number;
  }>;
}

export interface CatalogElement {
  id: number;
  catalog_id: number;
  name: string;
  created_by: number;
  updated_by: number;
  created_at: number;
  updated_at: number;
  is_deleted: boolean | null;
  custom_fields_values: unknown[] | null;
  account_id: number;
  request_id?: string;

  _links?: {
    self?: {
      href: string;
    };
  };
}

export interface ListCatalogsParams {
  page?: number;
  limit?: number; // máximo 250
}

export interface ListCatalogsResponse {
  _page: number;
  _links?: {
    self?: { href: string };
    next?: { href: string };
  };
  _embedded?: {
    catalogs?: Catalog[];
  };
}

export interface CreateCatalogInput {
  name: string;
  type?: string; // default documentado: regular
  sort?: number;
  can_link_multiple?: boolean;
  request_id?: string;
}

export interface CreateCatalogsResponse {
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    catalogs?: Catalog[];
  };
}

export interface UpdateCatalogInput {
  id: number;
  name?: string;
  can_link_multiple?: boolean;
  request_id?: string;
}

export type UpdateSingleCatalogInput = Omit<UpdateCatalogInput, 'id'>;

export type UpdateCatalogsResponse =
  | Catalog[]
  | {
      _links?: {
        self?: { href: string };
      };
      _embedded?: {
        catalogs?: Catalog[];
      };
    };

export interface ListCatalogElementsParams {
  page?: number;
  limit?: number; // máximo 250
  query?: string;
  filter_id?: number[];
}

export interface ListCatalogElementsResponse {
  _page: number;
  _links?: {
    self?: { href: string };
    next?: { href: string };
  };
  _embedded?: {
    elements?: CatalogElement[];
  };
}

export interface CreateCatalogElementInput {
  name: string;
  custom_fields_values?: CatalogElementCustomFieldValue[] | string;
  request_id?: string;
}

export interface CreateCatalogElementsResponse {
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    elements?: CatalogElement[];
  };
}

export interface UpdateCatalogElementInput {
  id: number | string;
  name?: string;
  custom_fields_values?: CatalogElementCustomFieldValue[] | string;
  request_id?: string;
}

export type UpdateSingleCatalogElementInput = Omit<UpdateCatalogElementInput, 'id'>;

export interface UpdateCatalogElementsResponse {
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    elements?: CatalogElement[];
  };
}

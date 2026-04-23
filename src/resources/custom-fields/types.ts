export type CustomFieldType =
  | 'text'
  | 'numeric'
  | 'checkbox'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'url'
  | 'textarea'
  | 'radiobutton'
  | 'streetaddress'
  | 'smart_address'
  | 'birthday'
  | 'legal_entity'
  | 'date_time'
  | 'price'
  | 'category'
  | 'file';

export type EntityType = 'leads' | 'contacts' | 'companies';

export interface CustomFieldEnum {
  id?: number;
  value: string;
  sort?: number;
  code?: string;
}

export interface CustomFieldRequiredStatus {
  status_id: number;
  pipeline_id: number;
}

export interface CustomFieldNestedValue {
  id?: number;
  parent_id?: number;
  value: string;
  sort?: number;
  request_id?: string;
  parent_request_id?: string;
}

export interface BaseCustomField {
  id: number;
  name: string;
  code?: string | null;
  sort?: number;
  type: string;
  entity_type?: string;
  account_id?: number;
  enums?: CustomFieldEnum[] | Record<string, CustomFieldEnum> | null;
  remind?: 'never' | 'day' | 'week' | 'month' | string | null;
  request_id?: string;
  _links?: {
    self?: {
      href: string;
    };
  };
}

export interface EntityCustomField extends BaseCustomField {
  entity_type: 'leads' | 'contacts' | 'companies';
  group_id?: number | null;
  is_api_only?: boolean;
  required_statuses?: CustomFieldRequiredStatus[];
  is_predefined?: boolean;
  is_deletable?: boolean;
  tracking_callback?: unknown;
  triggers?: unknown[];
  currency?: unknown;
  hidden_statuses?: unknown[];
  chained_lists?: unknown;
}

export interface ListCustomField extends BaseCustomField {
  entity_type?: 'catalogs' | 'catalog' | string;
  settings?: Record<string, unknown> | string | null;
  is_visible?: boolean;
  is_required?: boolean;
  nested?: CustomFieldNestedValue[] | null;
}

// ==== LIST/GET RESPONSES ====
export interface ListEntityCustomFieldsResponse {
  _total_items?: number;
  _embedded?: {
    custom_fields?: EntityCustomField[];
  };
}

export interface ListListCustomFieldsResponse {
  _total_items?: number;
  _embedded?: {
    custom_fields?: ListCustomField[];
  };
}

// ==== ENTITY PAYLOADS ====
export interface CreateEntityCustomFieldInput {
  type: CustomFieldType;
  name: string;
  code?: string;
  sort?: number;
  group_id?: number;
  is_api_only?: boolean;
  required_statuses?: CustomFieldRequiredStatus[];
  remind?: 'never' | 'day' | 'week' | 'month' | string | null;
  enums?: Array<{
    value: string;
    sort?: number;
    code?: string;
  }>;
  nested?: CustomFieldNestedValue[];
}

export interface UpdateEntityCustomFieldInput {
  id: number;
  name?: string;
  code?: string;
  sort?: number;
  group_id?: number;
  is_api_only?: boolean;
  required_statuses?: CustomFieldRequiredStatus[];
  remind?: 'never' | 'day' | 'week' | 'month' | string | null;
  enums?: Array<{
    value: string;
    sort?: number;
    code?: string;
  }>;
  nested?: CustomFieldNestedValue[];
}

export type UpdateSingleEntityCustomFieldInput = Omit<UpdateEntityCustomFieldInput, 'id'>;

// ==== LIST PAYLOADS ====
export interface CreateListCustomFieldInput {
  type: CustomFieldType;
  name: string;
  code?: string;
  sort?: number;
  settings?: Record<string, unknown> | string;
  is_visible?: boolean;
  is_required?: boolean;
  remind?: 'never' | 'day' | 'week' | 'month' | string | null;
  enums?: Array<{
    value: string;
    sort?: number;
    code?: string;
  }>;
  nested?: CustomFieldNestedValue[];
}

export interface UpdateListCustomFieldInput {
  id: number;
  name?: string;
  code?: string;
  sort?: number;
  settings?: Record<string, unknown> | string;
  is_visible?: boolean;
  is_required?: boolean;
  remind?: 'never' | 'day' | 'week' | 'month' | string | null;
  enums?: Array<{
    value: string;
    sort?: number;
    code?: string;
  }>;
  nested?: CustomFieldNestedValue[];
}

export type UpdateSingleListCustomFieldInput = Omit<UpdateListCustomFieldInput, 'id'>;


// ==== CUSTOM FIELD GROUPS ====

export interface CustomFieldGroup {
  id: number;
  name: string;
  sort: string | number;
  entity_type: 'leads' | 'contacts' | 'companies' | string;
  is_predefined: boolean | number;
  type: 'linked_group' | 'custom_field_group' | string;
  fields: number[];
}

export interface ListCustomFieldGroupsResponse {
  _embedded?: {
    custom_fields_groups?: CustomFieldGroup[];
  };
}

export interface CreateCustomFieldGroupInput {
  name: string;
  sort?: string | number;
  request_id?: string;
}

export interface UpdateCustomFieldGroupInput {
  name?: string;
  sort?: string | number;
  fields?: number[];
}

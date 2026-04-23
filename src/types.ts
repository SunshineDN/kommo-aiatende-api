export interface KommoConfig {
  domain: string;
  accessToken?: string;
  refreshToken?: string;
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
}

export interface AccessTokenResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

// Respostas Padrões e Paginação
export interface Embedded<T> {
  _embedded: T;
}

export interface CollectionResponse<K extends string, T> {
  _page?: number;
  _links?: {
    self: { href: string };
    next?: { href: string };
  };
  _embedded: Record<K, T[]>;
}

// Campos Personalizados (Custom Fields)
export interface CustomFieldValue {
  value: string | number | boolean;
  enum_id?: number;
  enum_code?: string;
}

export interface CustomField {
  field_id: number;
  field_name?: string;
  field_code?: string;
  field_type?: string;
  values: CustomFieldValue[];
}

// Entidade Base do Kommo
export interface BaseEntity {
  id: number;
  name: string;
  responsible_user_id?: number;
  group_id?: number;
  created_by?: number;
  updated_by?: number;
  created_at?: number;
  updated_at?: number;
  is_deleted?: boolean;
  custom_fields_values?: CustomField[];
  account_id?: number;
  _links?: { self: { href: string } };
}


// Removido

export const KOMMO_TAG_COLORS = [
  'EBEBEB',
  'D0D0D0',
  'F2DDF7',
  'D1A4DC',
  'FF8F92',
  'FFC8C8',
  'C7DB8C',
  'DDEBB5',
  '8699DA',
  'AABDFF',
  'FFCE5A',
  'FFE193',
  '90CDB0',
  'C6F4DE',
  'A9A5D7',
  'D8D5FF',
  '86C0FC',
  '832161',
  '6A0F49',
  '0C7C59',
  '10599D',
  '9D2B32',
  '247BA0',
] as const;

export type TagColor = typeof KOMMO_TAG_COLORS[number];
export type TagEntityType = 'leads' | 'contacts' | 'companies' | string;

export interface Tag {
  id: number;
  name: string;
  color?: TagColor | string;
  request_id?: string;
}

export interface ListTagsParams {
  page?: number;
  limit?: number; // máximo 250
  query?: string;
  filter_id?: number[];
  filter_name?: string;
}

export interface ListTagsResponse {
  _page: number;
  _links?: {
    self?: { href: string };
    next?: { href: string };
  };
  _embedded?: {
    tags?: Tag[];
  };
}

export interface CreateTagInput {
  name: string;
  color?: TagColor | string; // apenas para leads
  request_id?: string;
}

export interface CreateTagsResponse {
  _total_items?: number;
  _embedded?: {
    tags?: Array<{
      id: number;
      name: string;
      request_id?: string;
    }>;
  };
}

export interface TagRefInput {
  id?: number;
  name?: string;
}

export interface UpdateEntityTagsInput {
  id: number;
  _embedded: {
    tags: TagRefInput[] | null;
  };
}

export interface EntityUpdateResult {
  id: number;
  updated_at: number;
  _links?: {
    self?: { href: string };
  };
}

export interface UpdateEntityTagsBatchResponse {
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    leads?: Array<EntityUpdateResult>;
    contacts?: Array<EntityUpdateResult>;
    companies?: Array<EntityUpdateResult>;
  };
}

export interface UpdateSingleEntityTagsInput {
  _embedded: {
    tags: TagRefInput[] | null;
  };
}

export interface UpdateEntityTagsSingleResponse {
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    leads?: Array<EntityUpdateResult>;
    contacts?: Array<EntityUpdateResult>;
    companies?: Array<EntityUpdateResult>;
  };
}

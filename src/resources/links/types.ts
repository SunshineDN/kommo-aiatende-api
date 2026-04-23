export type LinkSourceEntityType = 'leads' | 'contacts' | 'companies' | string;
export type LinkTargetEntityType =
  | 'leads'
  | 'contacts'
  | 'companies'
  | 'catalog_elements'
  | string;

export interface LinkMetadataInput {
  catalog_id?: number;
  quantity?: number;
  is_main?: boolean;
  updated_by?: number;
}

export interface EntityLinkMetadata {
  main_contact?: boolean;
  quantity?: number;
  catalog_id?: number;
  updated_by?: number;
}

export interface EntityLink {
  to_entity_id: number;
  to_entity_type: LinkTargetEntityType;
  metadata?: EntityLinkMetadata | null;
}

export interface EntityLinkWithSource extends EntityLink {
  entity_id?: number;
  entity_type?: LinkSourceEntityType;
}

export interface ListEntityLinksParams {
  filter_to_entity_id?: number;
  filter_to_entity_type?: LinkTargetEntityType;
  filter_to_catalog_id?: number;
}

export interface ListEntityLinksResponse {
  _total_items?: number;
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    links?: EntityLink[];
  };
}

export interface CreateEntityLinkInput {
  to_entity_id: number;
  to_entity_type: LinkTargetEntityType;
  metadata?: LinkMetadataInput;
}

export interface CreateEntityLinksResponse {
  _total_items?: number;
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    links?: EntityLinkWithSource[];
  };
}

export interface DeleteEntityLinkInput {
  to_entity_type: LinkTargetEntityType;
  to_entity_id: number;
  metadata?: {
    catalog_id?: number;
    updated_by?: number;
  };
}

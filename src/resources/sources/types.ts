// --- Fontes (Sources) ---

export interface SourceServicePage {
  name: string;
  id: string;
  link: string;
}

export interface SourceService {
  type?: string;
  params?: {
    waba?: boolean;
    is_supports_list_message?: boolean;
  };
  pages?: SourceServicePage[];
}

export interface Source {
  id: number;
  name: string;
  pipeline_id: number | null;
  external_id: string;
  default?: boolean | null;
  services?: SourceService[] | unknown[];
  origin_code?: string | null;
  request_id?: string;
  _links?: {
    self?: {
      href: string;
    };
  };
}

export interface ListSourcesResponse {
  _total_items?: number;
  _embedded?: {
    sources?: Source[];
  };
}

export interface CreateSourceInput {
  name: string;
  pipeline_id?: number | null;
  external_id: string;
  default?: boolean | null;
  origin_code?: string | null;
  services?: SourceService[] | Record<string, unknown>;
  request_id?: string;
}

export interface CreateSourcesResponse {
  _total_items?: number;
  _embedded?: {
    sources?: Source[];
  };
}

export interface UpdateSourceInput {
  name?: string;
  pipeline_id?: number | null;
  external_id?: string;
  default?: boolean | null;
  origin_code?: string | null;
  services?: SourceService[] | Record<string, unknown>;
}

export interface UpdateSourceBatchInput extends UpdateSourceInput {
  id: number;
}

export interface UpdateSourcesResponse {
  _total_items?: number;
  _embedded?: {
    sources?: Source[];
  };
}

export interface DeleteSourceBatchInput {
  id: number;
}


// --- Botões de Chat Web (Website Buttons) ---

export type WebsiteButtonCreationStatus = 'created' | 'creation_pending' | string;

export interface WebsiteButton {
  account_id: number;
  source_id: number;
  button_id: number;
  is_duplication_control_enabled: boolean;
  name: string;
  creation_status: WebsiteButtonCreationStatus;
  pipeline_id: number | null;
  script?: string | null;
}

export interface ListWebsiteButtonsParams {
  with?: 'scripts' | string;
  page?: number;
  limit?: number; // padrão/máximo documentado: 250
}

export interface ListWebsiteButtonsResponse {
  _page?: number;
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    website_buttons?: WebsiteButton[];
  };
}

export interface CreateWebsiteButtonInput {
  pipeline_id: number;
  trusted_websites?: string[];
  is_used_in_app?: boolean;
}

export interface CreateWebsiteButtonResponse {
  source_id: number;
  trusted_websites: string[];
}

export interface UpdateWebsiteButtonInput {
  trusted_websites: string[];
}

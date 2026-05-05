export type AccountWithParam =
  | 'amojo_id'
  | 'amojo_rights'
  | 'users_groups'
  | 'task_types'
  | 'version'
  | 'entity_names'
  | 'datetime_settings'
  | 'drive_url'
  | string;

export interface GetAccountParams {
  with?: AccountWithParam | AccountWithParam[];
}

export interface AmojoRights {
  can_direct?: Record<string, unknown>;
  can_create_groups?: Record<string, unknown>;
}

export interface Account {
  id: number;
  name: string;
  subdomain: string;
  current_user_id: number;
  country?: string | null;
  currency?: string | null;
  currency_symbol?: string | null;
  /** Se "Leads de Entrada" (Unsorted) está habilitado na conta */
  is_unsorted_on?: boolean;
  /** Se "Motivo para leads perdidos" está habilitado */
  is_loss_reason_enabled?: boolean;
  /** Se o AI power-up (helpbot) está habilitado */
  is_helpbot_enabled?: boolean;
  /** Se é uma conta técnica (integração) */
  is_technical_account?: boolean;
  /** 1 = "Nome Sobrenome", 2 = "Sobrenome Nome" */
  contact_name_display_order?: 1 | 2 | number;

  // Campos opcionais via `with`
  amojo_id?: string;
  version?: number;

  _embedded?: {
    amojo_rights?: AmojoRights;
    users_groups?: unknown;
    task_types?: unknown;
    entity_names?: unknown;
    datetime_settings?: unknown;
    drive_url?: unknown;
  };

  _links?: {
    self?: {
      href: string;
    };
  };
}

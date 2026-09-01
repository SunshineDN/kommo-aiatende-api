export type TalkEntityType = 'lead';

export type TalkStatus = 'in_work' | 'closed' | 'nps_scheduled' | 'nps_in_progress' | 'with_error';

export interface Talk {
  talk_id: number;
  created_at: number;
  updated_at: number;
  rate: number | null;
  contact_id: number;
  chat_id: string;
  entity_id: number;
  entity_type: TalkEntityType;
  status: TalkStatus;
  is_in_work: boolean;
  is_read: boolean;
  origin: string;
  source_id: string | null;
  account_id: number;
  _embedded?: {
    contacts?: Array<{ id: number }>;
    leads?: Array<{ id: number }>;
  };
}

export interface ListTalksParams {
  page?: number;
  limit?: number;
  filter_talk_id?: number[];
  filter_contact_id?: number[];
  filter_entity_id?: number[];
  filter_entity_type?: TalkEntityType;
  // Presente = filtra só conversas em atendimento; a Kommo trata como flag, sem valor.
  filter_only_in_work?: boolean;
}

export interface ListTalksResponse {
  _page: number;
  _links?: {
    self?: { href: string };
    next?: { href: string };
  };
  _embedded?: {
    talks?: Talk[];
  };
}

export interface CloseTalkParams {
  force_close?: boolean;
}

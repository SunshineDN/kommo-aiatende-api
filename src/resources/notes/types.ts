export type NoteType =
  | 'common'
  | 'call_in'
  | 'call_out'
  | 'service_message'
  | 'geolocation'
  | 'sms_in'
  | 'sms_out'
  | 'extended_service_message'
  | 'attachment'
  | string;

export interface CommonNoteParams {
  text: string;
}

export interface CallNoteParams {
  uniq: string;
  duration: number;
  source: string;
  link?: string;
  phone: string;
}

export interface ServiceMessageNoteParams {
  service: string;
  text: string;
}

export interface GeolocationNoteParams {
  text: string;
  address: string;
  longitude: string;
  latitude: string;
}

export interface SmsNoteParams {
  text: string;
  phone: string;
}

export interface AttachmentNoteParams {
  version_uuid?: string;
  file_uuid: string;
  file_name: string;
}

export type NoteParams =
  | CommonNoteParams
  | CallNoteParams
  | ServiceMessageNoteParams
  | GeolocationNoteParams
  | SmsNoteParams
  | AttachmentNoteParams
  | Record<string, unknown>;

export interface Note {
  id: number;
  entity_id: number;
  created_by?: number;
  updated_by?: number;
  created_at?: number;
  updated_at?: number;
  responsible_user_id?: number;
  group_id?: number;
  note_type: NoteType;
  params?: NoteParams;
  account_id?: number;
  request_id?: string;
  _links?: {
    self?: {
      href: string;
    };
  };
}

export type NoteEntityType =
  | 'leads'
  | 'contacts'
  | 'companies'
  | 'contatos'
  | 'empresas'
  | string;

export interface ListEntityNotesParams {
  page?: number;
  limit?: number; // máximo 250

  filter_id?: number[] | string[];
  filter_note_type?: NoteType[] | string[];

  filter_updated_at_from?: number;
  filter_updated_at_to?: number;

  order_updated_at?: 'asc' | 'desc';
  order_id?: 'asc' | 'desc';
}

export interface ListNotesResponse {
  _page: number;
  _links?: {
    self?: { href: string };
    next?: { href: string };
  };
  _embedded?: {
    notes?: Note[];
  };
}

export interface CreateNoteInput {
  entity_id: number;
  note_type: NoteType;
  params?: NoteParams;
  request_id?: string;
  is_need_to_trigger_digital_pipeline?: boolean;
}

export interface CreateNotesResponse {
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    notes?: Array<{
      id: number;
      entity_id: number;
      request_id?: string;
      _links?: {
        self?: { href: string };
      };
    }>;
  };
}

export interface UpdateNoteInput {
  id: number;
  entity_id?: number;
  note_type?: NoteType;
  params?: NoteParams;
}

export interface UpdateSingleNoteInput {
  entity_id?: number;
  note_type?: NoteType;
  params?: NoteParams;
}

export interface UpdateNotesResponse {
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    notes?: Array<{
      id: number;
      entity_id: number;
      updated_at: number;
      _links?: {
        self?: { href: string };
      };
    }>;
  };
}

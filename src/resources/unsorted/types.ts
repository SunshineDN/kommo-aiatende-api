import { BaseEntity } from '../../types';

export interface UnsortedLead {
  uid: string;
  source_uid?: string | null;
  source_name?: string | null;
  category: 'sip' | 'forms' | 'chats' | 'mail' | string;
  pipeline_id: number;
  created_at: number;
  metadata: Record<string, unknown>;
  account_id: number;
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    contacts?: Array<{ id: number; _links?: { self?: { href: string } } }>;
    companies?: Array<{ id: number; _links?: { self?: { href: string } } }>;
    leads?: Array<{ id: number; _links?: { self?: { href: string } } }>;
  };
}

export interface ListUnsortedLeadsResponse {
  _page?: number;
  _links?: {
    self?: { href: string };
    next?: { href: string };
  };
  _embedded?: {
    unsorted?: UnsortedLead[];
  };
}

export interface CreateUnsortedLeadsResponse {
  _total_items?: number;
  _embedded?: {
    unsorted?: Array<{
      uid: string;
      account_id: number;
      request_id?: string;
      _links?: { self?: { href: string } };
      _embedded?: {
        contacts?: Array<{ id: number; _links?: { self?: { href: string } } }>;
        leads?: Array<{ id: number; _links?: { self?: { href: string } } }>;
        companies?: Array<{ id: number; _links?: { self?: { href: string } } }>;
      };
    }>;
  };
}

export interface UnsortedDecisionResponse {
  uid: string;
  pipeline_id: number;
  category: string;
  created_at: number;
  _embedded?: {
    contacts?: Array<{ id: number; is_deleted?: boolean; is_unsorted?: boolean }>;
    companies?: Array<{ id: number }>;
    leads?: Array<{ id: number }>;
  };
}

export interface LinkUnsortedLeadResponse {
  uid: string;
  _embedded?: {
    leads?: Array<{ id: number }>;
    contacts?: Array<{ id: number }>;
    companies?: Array<{ id: number }>;
  };
}

export interface UnsortedSummaryResponse {
  total: number;
  accepted: number;
  declined: number;
  average_sort_time: number;
  categories: {
    sip?: { total: number };
    forms?: { total: number };
    chats?: { total: number };
    mail?: { total: number };
    [key: string]: { total: number } | undefined;
  };
}

// METADATA
export interface SipMetadata {
  from: string;
  phone: string;
  called_at: number;
  duration: number;
  link?: string;
  service_code?: string;
  is_call_event_needed?: boolean;
  call_responsible?: string;
}

export interface FormMetadata {
  form_id: string | number;
  form_name: string;
  form_page: string;
  ip: string;
  form_sent_at: number;
  referer?: string;
}

// CREATION PAYLOADS
export interface CreateTagRef {
  id?: number;
  name?: string;
}

export interface CreateUnsortedContact {
  id?: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  responsible_user_id?: number;
  created_by?: number;
  updated_by?: string | number;
  created_at?: number;
  updated_at?: number;
  custom_fields_values?: unknown[] | string;
  request_id?: string;
  tags_to_add?: CreateTagRef[];
}

export interface CreateUnsortedCompany {
  id?: string | number;
  name?: string;
  responsible_user_id?: number;
  created_by?: number;
  updated_by?: number;
  created_at?: number;
  updated_at?: number;
  custom_fields_values?: unknown[] | string;
  _embedded?: CreateTagRef[] | { tags?: CreateTagRef[] };
  request_id?: string;
  tags_to_add?: CreateTagRef[];
}

export interface CreateUnsortedLead {
  name?: string;
  price?: number;
  status_id?: number;
  pipeline_id?: number;
  created_by?: number;
  updated_by?: number;
  created_at?: number;
  updated_at?: number;
  closed_at?: number;
  loss_reason_id?: string | number;
  responsible_user_id?: number;
  custom_fields_values?: unknown[] | string;
  _embedded?: {
    tags?: CreateTagRef[];
    contacts?: Array<{ id: number; is_main?: boolean }>;
    companies?: Array<{ id: number }>;
    source?: {
      external_id?: string;
      type?: string;
    };
  };
  tags_to_add?: CreateTagRef[];
  tags_to_delete?: CreateTagRef[];
}

export interface BaseCreateUnsortedItem<TMetadata> {
  request_id?: string;
  source_uid: string;
  source_name: string;
  pipeline_id: number | string;
  created_at: number | string;
  metadata: TMetadata;
  _embedded?: {
    contacts?: CreateUnsortedContact[];
    companies?: CreateUnsortedCompany[];
    leads?: CreateUnsortedLead[];
  };
}

export type CreateSipUnsortedLeadInput = BaseCreateUnsortedItem<SipMetadata>;
export type CreateFormUnsortedLeadInput = BaseCreateUnsortedItem<FormMetadata>;

// PARAMS FOR METHODS
export interface ListUnsortedLeadsParams {
  page?: number;
  limit?: number;
  uid?: string | string[];
  category?: Array<'sip' | 'mail' | 'forms' | 'chats' | string>;
  pipeline_id?: number;
  order_created_at?: 'asc' | 'desc';
}

export interface UnsortedSummaryParams {
  uid?: string | string[];
  created_at?: number;
  created_at_from?: number;
  created_at_to?: number;
  pipeline_id?: number;
}

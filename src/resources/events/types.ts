export type EventWithParam =
  | 'contact_name'
  | 'lead_name'
  | 'company_name'
  | 'catalog_name'
  | 'catalog_element_name';

export type EventValueChange =
  | Record<string, unknown>
  | {
      task?: { text?: string };
      helpbot?: { id?: number };
      transaction?: { id?: number };
      note?: { id?: number };
      nps?: { rate?: number };
      message?: { id?: string };
      tag?: { name?: string };
      lead_status?: { id?: number; pipeline_id?: number };
      responsible_user?: { id?: number };
      task_deadline?: { timestamp?: number };
      task_type?: { id?: number };
      custom_field_value?: {
        field_id?: number;
        field_type?: number;
        enum_id?: number | null;
        text?: string;
      };
      link?: {
        entity?: {
          type?: string;
          id?: number;
        };
      };
      unlink?: {
        entity?: {
          type?: string;
          id?: number;
        };
      };
    };

export interface Event {
  id: string;
  type: string;
  entity_id: number;
  entity_type: string;
  created_by: number;
  created_at: number;
  value_after: EventValueChange[];
  value_before: EventValueChange[];
  account_id: number;

  _links?: {
    self?: {
      href: string;
    };
  };

  _embedded?: {
    entity?: {
      id: number;
      name?: string;
      _links?: {
        self?: {
          href: string;
        };
      };
    };
  };
}

export type KnownEventType =
  | 'lead_added'
  | 'lead_deleted'
  | 'lead_restored'
  | 'lead_status_changed'
  | 'lead_linked'
  | 'lead_unlinked'
  | 'contact_added'
  | 'contact_deleted'
  | 'contact_restored'
  | 'contact_linked'
  | 'contact_unlinked'
  | 'company_added'
  | 'company_deleted'
  | 'company_restored'
  | 'company_linked'
  | 'company_unlinked'
  | 'task_added'
  | 'task_deleted'
  | 'task_completed'
  | 'task_type_changed'
  | 'task_text_changed'
  | 'task_deadline_changed'
  | 'task_result_added'
  | 'incoming_call'
  | 'outgoing_call'
  | 'incoming_mail'
  | 'outgoing_mail'
  | 'incoming_chat_message'
  | 'outgoing_chat_message'
  | 'entity_direct_message'
  | 'incoming_sms'
  | 'outgoing_sms'
  | 'entity_tag_added'
  | 'entity_tag_deleted'
  | 'entity_linked'
  | 'entity_unlinked'
  | 'sale_field_changed'
  | 'name_field_changed'
  | 'ltv_field_changed'
  | 'custom_field_value_changed'
  | 'entity_responsible_changed'
  | 'robot_replied'
  | 'intent_identified'
  | 'nps_rate_added'
  | 'link_followed'
  | 'common_note_added'
  | 'common_note_deleted'
  | 'attachment_note_added'
  | 'targeting_in_note_added'
  | 'targeting_out_note_added'
  | 'geo_note_added'
  | 'service_note_added'
  | 'site_visit_note_added'
  | 'entity_merged'
  | 'video_opened'
  | 'video_closed'
  | 'picture_opened'
  | 'picture_closed'
  | 'zoom_conference'
  | 'key_action_completed'
  | 'ai_result'
  | 'talk_created'
  | 'talk_closed'
  | 'conversation_answered'
  | 'meta_chat_subscription_added'
  | 'meta_chat_subscription_removed'
  | 'talk_missed_event'
  | 'page_mention'
  | 'dropbox_attachment'
  | `custom_field_${number}_value_changed`
  | string;

export interface EventValueFilters {
  leads_statuses?: Array<{
    pipeline_id: number;
    status_id: number;
  }>;
  responsible_user_id?: number[] | string;
  custom_field_values?: number[] | string;
  value?: string | number;
}

export interface ListEventsParams {
  with?: EventWithParam[] | string;
  page?: number;
  limit?: number; // máximo 250

  filter_id?: string | string[];

  filter_created_at_from?: number;
  filter_created_at_to?: number;

  filter_created_by?: number[]; // até 10 IDs
  filter_entity?: Array<
    'lead' | 'contact' | 'company' | 'task' | `catalog_${number}`
  > | string;

  filter_entity_id?: number[]; // usar com um único filter_entity
  filter_type?: KnownEventType[] | KnownEventType;

  filter_value_before?: EventValueFilters;
  filter_value_after?: EventValueFilters;
}

export interface ListEventsResponse {
  _page: number;
  _links?: {
    self?: { href: string };
    next?: { href: string };
  };
  _embedded?: {
    events?: Event[];
  };
}

export interface EventTypeDefinition {
  key: string;
  type: number;
  lang: string;
}

export interface ListEventTypesParams {
  language_code?: 'en' | 'es' | 'pt' | string;
}

export interface ListEventTypesResponse {
  _total_items?: number;
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    events_types?: EventTypeDefinition[];
  };
}

// Utilitários de Eventos
export const eventUtils = {
  isLeadStatusChanged: (event: Event) => event.type === 'lead_status_changed',
  isCustomFieldChanged: (event: Event) =>
    event.type === 'custom_field_value_changed' ||
    /^custom_field_\d+_value_changed$/.test(event.type),
};

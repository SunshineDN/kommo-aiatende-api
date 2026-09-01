export const KNOWN_WEBHOOK_EVENTS = [
  // Lead
  'add_lead',
  'update_lead',
  'delete_lead',
  'restore_lead',
  'status_lead',
  'responsible_lead',
  'note_lead',
  // Contact
  'add_contact',
  'update_contact',
  'delete_contact',
  'restore_contact',
  'responsible_contact',
  'note_contact',
  // Company
  'add_company',
  'update_company',
  'delete_company',
  'restore_company',
  'responsible_company',
  'note_company',
  // Task
  'add_task',
  'update_task',
  'delete_task',
  'responsible_task',
  // Chat / Talk
  'add_talk',
  'add_message',
  'add_outgoing_message',
  'add_chat_template_review',
] as const;

export type WebhookEvent = typeof KNOWN_WEBHOOK_EVENTS[number] | string;

export interface Webhook {
  id: number;
  destination: string;
  created_at: number;
  updated_at: number;
  account_id: number;
  created_by: number;
  sort: number;
  disabled: boolean;
  settings: WebhookEvent[];
}

export interface ListWebhooksParams {
  filter_destination?: string;
}

export interface ListWebhooksResponse {
  _total_items?: number;
  _embedded?: {
    webhooks?: Webhook[];
  };
}

export interface CreateWebhookInput {
  destination: string;
  settings: WebhookEvent[];
  sort?: number;
}

export interface DeleteWebhookInput {
  destination: string;
}

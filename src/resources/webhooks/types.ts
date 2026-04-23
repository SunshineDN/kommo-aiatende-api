export const KNOWN_WEBHOOK_EVENTS = [
  'add_lead',
  'update_lead',
  'delete_lead',
  'restore_lead',
  'add_contact',
  'update_contact',
  'delete_contact',
  'restore_contact',
  'add_company',
  'update_company',
  'delete_company',
  'restore_company',
  'add_task',
  'update_task',
  'delete_task',
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

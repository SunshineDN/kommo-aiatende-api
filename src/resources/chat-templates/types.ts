export type ChatTemplateType = 'waba' | 'amocrm' | string;
export type ChatTemplateButtonType = 'inline' | 'url' | string;
export type WabaCategory = 'UTILITY' | 'AUTHENTICATION' | 'MARKETING' | string;
export type WabaHeaderType = 'text' | 'media' | string;
export type WabaReviewStatus = 'approved' | 'review' | 'paused' | 'rejected' | string;

export interface ChatTemplateButton {
  type: ChatTemplateButtonType;
  text: string;
  url?: string;
}

export interface ChatTemplateAttachment {
  id: string;
  name: string;
  type: 'picture' | 'file' | 'document' | 'video' | string;
  is_external?: boolean;
}

export interface ChatTemplateReview {
  id: number;
  source_id: number;
  status: WabaReviewStatus;
  reject_reason: string;
}

export interface ChatTemplate {
  id: number;
  account_id: number;
  name: string;
  content: string;
  is_editable: boolean; // limit: "waba" type can only be edited when in draft
  type: ChatTemplateType;
  buttons?: ChatTemplateButton[];
  attachment?: ChatTemplateAttachment | null;
  created_at: number;
  updated_at: number;
  external_id?: string;
  request_id?: string;

  review_status?: WabaReviewStatus | null;
  is_on_review?: boolean | null;

  waba_footer?: string;
  waba_category?: WabaCategory;
  waba_language?: string;
  waba_examples?: Record<string, string>;
  waba_header?: string | null;
  waba_header_type?: WabaHeaderType;

  _embedded?: {
    reviews?: ChatTemplateReview[];
  };

  _links?: {
    self?: {
      href: string;
    };
  };
}

export interface ListChatTemplatesParams {
  page?: number;
  limit?: number; // máximo 50
  filter_external_id?: string[];
  with?: 'reviews' | string;
}

export interface ListChatTemplatesResponse {
  _page: number;
  _links?: {
    self?: { href: string };
    next?: { href: string };
  };
  _embedded?: {
    chat_templates?: ChatTemplate[];
  };
}

export interface CreateChatTemplateInput {
  name: string;
  content: string;
  is_editable?: boolean;
  type?: ChatTemplateType; // "waba" para WhatsApp
  buttons?: ChatTemplateButton[];
  attachment?: ChatTemplateAttachment | null;
  external_id?: string;
  waba_footer?: string;
  waba_category?: WabaCategory;
  waba_language?: string;
  waba_examples?: Record<string, string>;
  waba_header?: string | null;
  waba_header_type?: WabaHeaderType;
  request_id?: string;
}

export interface CreateChatTemplatesResponse {
  _total_items?: number;
  _embedded?: {
    chat_templates?: ChatTemplate[];
  };
}

export interface UpdateChatTemplateInput {
  id: number;
  name?: string;
  content?: string;
  is_editable?: boolean;
  type?: ChatTemplateType;
  buttons?: ChatTemplateButton[];
  attachment?: ChatTemplateAttachment | null;
  external_id?: string;
  waba_footer?: string;
  waba_category?: WabaCategory;
  waba_language?: string;
  waba_examples?: Record<string, string>;
  waba_header?: string | null;
  waba_header_type?: WabaHeaderType;
}

export interface UpdateChatTemplatesResponse {
  _embedded?: {
    chat_templates?: ChatTemplate[];
  };
}

export interface SubmitWhatsAppTemplateReviewResponse {
  _embedded?: {
    reviews?: ChatTemplateReview[];
  };
}

export type WhatsAppTemplateModerationStatus = 'approved' | 'paused' | 'rejected' | string;

export interface UpdateWhatsAppTemplateReviewStatusInput {
  status: WhatsAppTemplateModerationStatus;
  reject_reason?: string;
}

export interface UpdateWhatsAppTemplateReviewStatusResponse {
  id: number;
  source_id: number;
  status: WhatsAppTemplateModerationStatus;
  reject_reason: string;
}

export interface DeleteChatTemplateInput {
  id: number;
}

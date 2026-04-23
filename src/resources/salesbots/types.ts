export type SalesbotFunctionalityType =
  | 'regular'
  | 'greeting'
  | 'marketing'
  | 'nps'
  | string;

export interface Salesbot {
  id: number;
  name: string;
  is_visual_editor: boolean;
  type_functionality: SalesbotFunctionalityType;
  settings: {
    active: boolean;
  };
  is_favorite?: boolean;
  _links?: {
    self?: {
      href: string;
    };
  };
}

export interface ListSalesbotsParams {
  page?: number;
  limit?: number; // máximo 250
  filter_type_functionality?: SalesbotFunctionalityType[];
  filter_id?: number[];
  with?: 'favorite' | string;
}

export interface ListSalesbotsResponse {
  _total_items?: number;
  _page?: number;
  _page_count?: number;
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    items?: Salesbot[]; // A API retorna raw em "items", não "bots".
  };
}

export interface RunSalesbotInput {
  entity_id: number;
  entity_type: 'leads' | 'contacts' | string;
}

export interface RunManySalesbotsItem {
  bot_id: number;
  entity_id: number;
  entity_type: 'leads' | 'contacts' | string;
}

export interface StopSalesbotInput {
  entity_id: number | string;
  entity_type: 'leads' | string;
}

export type SalesbotContinueBotType = 'marketingbot' | 'salesbot' | string;

export type SalesbotExecuteHandler =
  | {
      handler: 'show';
      params:
        | {
            type: 'text';
            value: string;
          }
        | {
            type: 'buttons';
            value: string;
            buttons: string[]; // máx. 25
          }
        | {
            type: 'buttons_url';
            value: string;
            buttons: string[]; // máx. 25
          };
    }
  | {
      handler: 'goto';
      params: {
        type: 'question' | 'answer' | 'finish' | 'question|answer|finish' | string;
        step: number;
      };
    };

export interface SalesbotContinueInput {
  data?: Record<string, unknown>;
  execute_handlers?: SalesbotExecuteHandler[];
}

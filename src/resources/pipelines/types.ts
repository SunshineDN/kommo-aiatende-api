export const KOMMO_PIPELINE_STAGE_COLORS = [
  '#fffeb2',
  '#fffd7f',
  '#fff000',
  '#ffeab2',
  '#ffdc7f',
  '#ffce5a',
  '#ffdbdb',
  '#ffc8c8',
  '#ff8f92',
  '#d6eaff',
  '#c1e0ff',
  '#98cbff',
  '#ebffb1',
  '#deff81',
  '#87f2c0',
  '#f9deff',
  '#f3beff',
  '#ccc8f9',
  '#eb93ff',
  '#f2f3f4',
  '#e6e8ea',
] as const;

export type KommoPipelineStageColor = typeof KOMMO_PIPELINE_STAGE_COLORS[number];

export interface StatusDescription {
  level: 'newbie' | 'candidate' | 'master';
  description: string;
}

export interface PipelineStatus {
  id: number;
  name: string;
  sort: number;
  is_editable: boolean;
  pipeline_id: number;
  color: string;
  type: 0 | 1 | number;
  account_id: number;
  request_id?: string;
  descriptions?: StatusDescription[];
  _links?: {
    self?: { href: string };
  };
}

export interface Pipeline {
  id: number;
  name: string;
  sort: number;
  is_main: boolean;
  is_unsorted_on: boolean;
  is_archive: boolean;
  account_id: number | string;
  request_id?: string;
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    statuses?: PipelineStatus[];
  };
}

export interface ListPipelinesResponse {
  _total_items?: number;
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    pipelines?: Pipeline[];
  };
}

export interface CreatePipelineStatusInput {
  id?: number;
  name?: string;
  sort?: number;
  color?: KommoPipelineStageColor | string;
  request_id?: string;
  descriptions?: StatusDescription[];
}

export interface CreatePipelineInput {
  name: string;
  sort?: number;
  is_main?: boolean;
  is_unsorted_on?: boolean;
  request_id?: string;
  _embedded?: {
    statuses?: CreatePipelineStatusInput[];
  };
}

export interface CreatePipelinesResponse {
  _total_items?: number;
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    pipelines?: Pipeline[];
  };
}

export interface UpdatePipelineInput {
  name?: string;
  sort?: number;
  is_main?: boolean;
  is_unsorted_on?: boolean;
}

export interface ListPipelineStatusesResponse {
  _total_items?: number;
  _embedded?: {
    statuses?: PipelineStatus[];
  };
}

export interface CreateStatusInput {
  name: string;
  sort: number;
  color?: KommoPipelineStageColor | string;
  request_id?: string;
  descriptions?: StatusDescription[];
}

export interface CreateStatusesResponse {
  _total_items?: number;
  _embedded?: {
    statuses?: PipelineStatus[];
  };
}

export interface UpdateStatusInput {
  name?: string;
  sort?: number;
  color?: KommoPipelineStageColor | string;
  descriptions?: StatusDescription[];
}

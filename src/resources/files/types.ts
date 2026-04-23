// Base raw tipos flexíveis recomendados pelas inconsistências documentais da Kommo
export type FileRecord = Record<string, unknown>;
export type FileVersionRecord = Record<string, unknown>;
export type EntityAttachedFileRecord = Record<string, unknown>;
export type FileLinkedEntityRecord = Record<string, unknown>;

export interface ListFilesParams {
  filter_uuid?: string[];
  filter_name?: string;
  filter_extensions?: string[];
  filter_term?: string;
  filter_source_id?: number;
  filter_deleted?: boolean;

  filter_size_unit?: number; // default doc: 1
  filter_size_from?: number;
  filter_size_to?: number;

  filter_date_type?: 'created_at' | 'updated_at';
  filter_date_preset?: string;
  filter_date_from?: number;
  filter_date_to?: number;

  filter_created_by?: number[]; // -1 client, 0 bot, user IDs
  filter_updated_by?: number[]; // -1 client, 0 bot, user IDs
}

export interface ListFilesResponse {
  items?: FileRecord[];
  raw?: unknown; // Mantemos o Raw para flexão
}

export interface CreateFileUploadSessionInput {
  file_name: string;
  file_size: number;
  file_uuid?: string; // para nova versão
  content_type?: string;
  with_preview?: boolean;
}

export type UploadSessionResponse = Record<string, unknown>;

// O Payload pode ser Blob, ArrayBuffer, Uint8Array. 
// A nível de SDK para Node, buffer ou ArrayBuffer.
export type UploadFilePartInput = ArrayBuffer | Uint8Array | any; 
export type UploadFilePartResponse = Record<string, unknown>;

// Um arquivo pode ter o nome editado OU sofrer rollover de versão. Numca os dois.
export type UpdateFileInput =
  | { name: string; version_uuid?: never }
  | { version_uuid: string; name?: never };

export type DeleteFilesItem = Record<string, unknown>;

export type RestoreFilesItem = Record<string, unknown>;

export interface ListFileVersionsResponse {
  items?: FileVersionRecord[];
  raw?: unknown;
}

export type FileAttachEntityType =
  | 'leads'
  | 'contacts'
  | 'companies'
  | 'contatos'
  | 'empresas'
  | string;

export interface ListEntityAttachedFilesParams {
  limit?: number;
  before_id?: number;
}

export interface ListEntityAttachedFilesResponse {
  items?: EntityAttachedFileRecord[];
  raw?: unknown;
}

export type AttachFilesToEntityItem = Record<string, unknown>;

export type DetachFilesFromEntityItem = Record<string, unknown>;

export interface ListFileLinkedEntitiesResponse {
  items?: FileLinkedEntityRecord[];
  raw?: unknown;
}

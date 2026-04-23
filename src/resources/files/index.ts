import qs from 'qs';
import { BaseResource } from '../../base';
import {
  FileRecord,
  ListFilesParams,
  ListFilesResponse,
  CreateFileUploadSessionInput,
  UploadSessionResponse,
  UploadFilePartInput,
  UploadFilePartResponse,
  UpdateFileInput,
  DeleteFilesItem,
  RestoreFilesItem,
  ListFileVersionsResponse,
  FileAttachEntityType,
  ListEntityAttachedFilesParams,
  ListEntityAttachedFilesResponse,
  AttachFilesToEntityItem,
  DetachFilesFromEntityItem,
  ListFileLinkedEntitiesResponse,
} from './types';

// Organizando sub-módulos dentro de FilesResource para refletir a divisão semântica da API

export class FilesServiceResource extends BaseResource {
  async getByUuid(fileUuid: string): Promise<FileRecord | null> {
    const response = await this.client.get(`/v1.0/files/${fileUuid}`);
    if (response.status === 204) {
      return null;
    }
    return response.data;
  }

  async list(params?: ListFilesParams): Promise<ListFilesResponse> {
    const queryParams: any = {};
    if (params) {
      const filter: any = {};
      
      const paramKeys = Object.keys(params) as Array<keyof ListFilesParams>;
      for (const key of paramKeys) {
         if (params[key] !== undefined) {
             const filterKey = key.replace('filter_', '');
             
             if (filterKey.startsWith('size_') || filterKey.startsWith('date_')) {
                 const [prefix, sub] = filterKey.split('_'); // size_unit -> size.unit
                 if (!filter[prefix]) filter[prefix] = {};
                 // Trata o campo do prefixo "date" e "size" com chaves aninhadas (ex: filter[size][unit])
                 
                 // Mas precisamos injetar os subníveis da forma certa:
                if (key === 'filter_size_unit') filter.size = { ...filter.size, unit: params[key]};
                else if (key === 'filter_size_from') filter.size = { ...filter.size, from: params[key]};
                else if (key === 'filter_size_to') filter.size = { ...filter.size, to: params[key]};
                else if (key === 'filter_date_type') filter.date = { ...filter.date, type: params[key]};
                else if (key === 'filter_date_preset') filter.date = { ...filter.date, date_preset: params[key]};
                else if (key === 'filter_date_from') filter.date = { ...filter.date, from: params[key]};
                else if (key === 'filter_date_to') filter.date = { ...filter.date, to: params[key]};
             } else {
                 filter[filterKey] = params[key];
             }
         }
      }

      if (Object.keys(filter).length > 0) {
        queryParams.filter = filter;
      }
    }

    const query = qs.stringify(queryParams, { skipNulls: true, arrayFormat: 'brackets' });
    const qsStr = query ? `?${query}` : '';
    const response = await this.client.get(`/v1.0/files${qsStr}`);
    
    // Tratando 204 sem itens.
    if (response.status === 204 || !response.data) {
       return { items: [], raw: response.data };
    }
    
    // A documentação foi opaca. Para garantir retorno robusto, mapeamos os items com fallback flexível
    return {
        // Se houver um array nativo
        items: Array.isArray(response.data) ? response.data : response.data?._embedded?.files || response.data?.items,
        raw: response.data
    };
  }

  async createUploadSession(payload: CreateFileUploadSessionInput): Promise<UploadSessionResponse> {
    const response = await this.client.post<UploadSessionResponse>('/v1.0/sessions', payload);
    return response.data;
  }

  async uploadPart(sessionToken: string, filePart: UploadFilePartInput): Promise<UploadFilePartResponse> {
    // Para Binários o content type varia via Adapter, manteremos o raw body pass-through:
    const response = await this.client.post<UploadFilePartResponse>(`/v1.0/sessions/upload/${sessionToken}`, filePart, {
        headers: {
            'Content-Type': 'application/octet-stream'
        }
    });
    return response.data;
  }

  async update(fileUuid: string, payload: UpdateFileInput): Promise<FileRecord> {
    if (payload.name !== undefined && payload.version_uuid !== undefined) {
         throw new Error("A Files API não permite alterar 'name' e definir 'version_uuid' na mesma requisição.");
    }
    const response = await this.client.patch<FileRecord>(`/v1.0/files/${fileUuid}`, payload);
    return response.data;
  }

  async delete(items: DeleteFilesItem | DeleteFilesItem[]): Promise<Record<string, unknown>> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.delete(`/v1.0/files`, { data: payload });
    return response.data || {};
  }

  async restore(items: RestoreFilesItem | RestoreFilesItem[]): Promise<Record<string, unknown>> {
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.post(`/v1.0/files/restore`, payload);
    return response.data;
  }

  async listVersions(fileUuid: string): Promise<ListFileVersionsResponse> {
    const response = await this.client.get(`/v1.0/files/${fileUuid}/versions`);
    return {
        items: Array.isArray(response.data) ? response.data : response.data?._embedded?.versions || response.data?.items,
        raw: response.data
    };
  }
}


export class EntityFilesResource extends BaseResource {
  private normalizeEntity(entity: FileAttachEntityType): string {
    if (entity === 'contatos') return 'contacts';
    if (entity === 'empresas') return 'companies';
    return entity;
  }

  async listAttachedToEntity(entity: FileAttachEntityType, entityId: number, params?: ListEntityAttachedFilesParams): Promise<ListEntityAttachedFilesResponse> {
    const normalEntity = this.normalizeEntity(entity);
    const query = qs.stringify(params, { skipNulls: true });
    const qsStr = query ? `?${query}` : '';
    
    const response = await this.client.get(`/api/v4/${normalEntity}/${entityId}/files${qsStr}`);
    if (response.status === 204) {
         return { items: [], raw: null };
    }
    
    return {
         items: Array.isArray(response.data) ? response.data : response.data?._embedded?.files || response.data?.items,
         raw: response.data
    };
  }

  async attachToEntity(entity: FileAttachEntityType, entityId: number, items: AttachFilesToEntityItem | AttachFilesToEntityItem[]): Promise<Record<string, unknown>> {
    const normalEntity = this.normalizeEntity(entity);
    const payload = Array.isArray(items) ? items : [items];
    const response = await this.client.put(`/api/v4/${normalEntity}/${entityId}/files`, payload);
    return response.data;
  }

  async detachFromEntity(entity: FileAttachEntityType, entityId: number, items: DetachFilesFromEntityItem | DetachFilesFromEntityItem[]): Promise<void> {
    const normalEntity = this.normalizeEntity(entity);
    const payload = Array.isArray(items) ? items : [items];
    await this.client.delete(`/api/v4/${normalEntity}/${entityId}/files`, { data: payload });
  }
}

export class FileLinksResource extends BaseResource {
  async listLinkedEntities(fileUuid: string): Promise<ListFileLinkedEntitiesResponse> {
    const response = await this.client.get(`/api/v4/files/${fileUuid}/links`);
    return {
        items: Array.isArray(response.data) ? response.data : response.data?._embedded?.links || response.data?.items,
        raw: response.data
    };
  }
}

// Wrapper Principal para empacotar os 3 submódulos
export class FilesResource extends BaseResource {
   public service: FilesServiceResource;
   public entities: EntityFilesResource;
   public links: FileLinksResource;

   constructor(httpClient: any) {
     super(httpClient);
     this.service = new FilesServiceResource(httpClient);
     this.entities = new EntityFilesResource(httpClient);
     this.links = new FileLinksResource(httpClient);
   }
}

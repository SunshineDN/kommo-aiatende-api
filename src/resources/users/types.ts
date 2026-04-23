export type PermissionLevel = 'A' | 'G' | 'M' | 'D';

export interface EntityRights {
  view?: PermissionLevel;
  edit?: PermissionLevel;
  add?: PermissionLevel;
  delete?: PermissionLevel;
  export?: PermissionLevel;
}

export interface StatusRight {
  entity_type: 'leads' | string;
  pipeline_id: number;
  status_id: number;
  rights: {
    view?: 'A' | 'D';
    edit?: 'A' | 'D';
    delete?: 'A' | 'D';
    export?: 'A' | 'D';
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  lang: 'ru' | 'en' | 'es' | 'pt' | string;

  rights: {
    leads?: EntityRights;
    contacts?: EntityRights;
    companies?: EntityRights;
    tasks?: EntityRights;
    mail_access?: boolean;
    catalog_access?: boolean;
    is_admin?: boolean;
    is_free?: boolean;
    is_active?: boolean;
    group_id?: number | null;
    role_id?: number | null;
    status_rights?: StatusRight[] | null;
  };

  uuid?: string | null;
  amojo_id?: string | null;
  user_rank?: 'newbie' | 'candidate' | 'master' | string;
  phone_number?: string | null;

  _links?: {
    self?: {
      href: string;
    };
  };

  _embedded?: {
    roles?: Array<{
      id: number;
      name: string;
      _links?: {
        self?: { href: string };
      };
    }>;
    groups?: Array<{
      id: number;
      name: string;
    }>;
  };
}

export interface Role {
  id: number;
  name: string;
  rights: {
    leads?: EntityRights;
    contacts?: EntityRights;
    companies?: EntityRights;
    tasks?: EntityRights;
    status_rights?: StatusRight[] | null;
    mail_access?: boolean;
    catalog_access?: boolean;
    is_admin?: boolean;
    is_free?: boolean;
    is_active?: boolean;
  };
  request_id?: string;

  _links?: {
    self?: {
      href: string;
    };
  };

  _embedded?: {
    users?: Array<{
      id: number;
    }>;
  };
}

export type UserWithParam = 'role' | 'group' | 'uuid' | 'amojo_id' | 'user_rank' | 'phone_number';

export type RoleWithParam = 'users';

export interface ListUsersParams {
  with?: UserWithParam[] | string;
  page?: number;
  limit?: number; // máximo 250
}

export interface ListUsersResponse {
  _total_items?: number;
  _page?: number;
  _page_count?: number;
  _links?: {
    self?: { href: string };
  };
  _embedded?: {
    users?: User[];
  };
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  lang?: 'ru' | 'en' | 'es' | 'pt' | string;

  rights?: {
    leads?: EntityRights;
    contacts?: EntityRights;
    companies?: EntityRights;
    tasks?: EntityRights;
    status_rights?: StatusRight[] | null;
    mail_access?: boolean;
    catalog_access?: boolean;
    is_free?: boolean;
    is_admin?: boolean;
    role_id?: number | null;
    group_id?: number | null;
  };
}

export interface ListRolesParams {
  with?: RoleWithParam[] | string;
}

export interface ListRolesResponse {
  _total_items?: number;
  _embedded?: {
    roles?: Role[];
  };
}

export interface CreateRoleInput {
  name: string;
  rights?: {
    leads?: EntityRights;
    contacts?: EntityRights;
    companies?: EntityRights;
    tasks?: EntityRights;
    status_rights?: StatusRight[] | null;
    mail_access?: boolean;
    catalog_access?: boolean;
  };
  request_id?: string;
}

export interface UpdateRoleInput {
  id: number;
  name?: string;
  rights?: {
    leads?: EntityRights;
    contacts?: EntityRights;
    companies?: EntityRights;
    tasks?: EntityRights;
    status_rights?: StatusRight[] | null;
    mail_access?: boolean;
    catalog_access?: boolean;
  };
}

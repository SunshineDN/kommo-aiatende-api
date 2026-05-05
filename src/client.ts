import axios, { AxiosInstance } from 'axios';
import qs from 'qs';
import { KommoConfig } from './types';
import { AuthManager } from './auth';
import { LeadsResource } from './resources/leads';
import { ContactsResource } from './resources/contacts';
import { TasksResource } from './resources/tasks';
import { NotesResource } from './resources/notes';
import { CustomFieldsResource, CustomFieldGroupsResource } from './resources/custom-fields';
import { UnsortedResource } from './resources/unsorted';
import { PipelinesResource } from './resources/pipelines';
import { CompaniesResource } from './resources/companies';
import { CatalogsResource } from './resources/catalogs';
import { UsersResource, RolesResource } from './resources/users';
import { EventsResource } from './resources/events';
import { TagsResource } from './resources/tags';
import { LinksResource } from './resources/links';
import { SalesbotsResource } from './resources/salesbots';
import { SourcesResource, WebsiteButtonsResource } from './resources/sources';
import { ChatTemplatesResource } from './resources/chat-templates';
import { WebhooksResource } from './resources/webhooks';
import { FilesResource } from './resources/files';
import { AccountResource } from './resources/account';
import { KommoApiError } from './errors';

export class KommoClient {
  public config: KommoConfig;
  public auth: AuthManager;
  public httpClient: AxiosInstance;

  public leads: LeadsResource;
  public contacts: ContactsResource;
  public tasks: TasksResource;
  public notes: NotesResource;
  public customFields: CustomFieldsResource;
  public customFieldGroups: CustomFieldGroupsResource;
  public unsorted: UnsortedResource;
  public pipelines: PipelinesResource;
  public companies: CompaniesResource;
  public catalogs: CatalogsResource;
  public users: UsersResource;
  public roles: RolesResource;
  public events: EventsResource;
  public tags: TagsResource;
  public links: LinksResource;
  public salesbots: SalesbotsResource;
  public sources: SourcesResource;
  public websiteButtons: WebsiteButtonsResource;
  public chatTemplates: ChatTemplatesResource;
  public webhooks: WebhooksResource;
  public files: FilesResource;
  public account: AccountResource;

  constructor(config: KommoConfig) {
    this.config = config;
    
    this.auth = new AuthManager(
      config.domain,
      config.clientId,
      config.clientSecret,
      config.redirectUri
    );

    const baseURL = `https://${config.domain}.kommo.com`;

    this.httpClient = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'brackets' });
      }
    });

    this.httpClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const errData = error.response.data;
          throw new KommoApiError(errData?.title || 'Kommo API Error', {
            status: error.response.status,
            title: errData?.title,
            detail: errData?.detail,
            type: errData?.type,
            raw: errData
          });
        }
        throw error;
      }
    );

    if (config.accessToken) {
      this.httpClient.defaults.headers.common['Authorization'] = `Bearer ${config.accessToken}`;
    }

    // Inicializa Módulos
    this.leads = new LeadsResource(this.httpClient);
    this.contacts = new ContactsResource(this.httpClient);
    this.tasks = new TasksResource(this.httpClient);
    this.notes = new NotesResource(this.httpClient);
    this.customFields = new CustomFieldsResource(this.httpClient);
    this.customFieldGroups = new CustomFieldGroupsResource(this.httpClient);
    this.unsorted = new UnsortedResource(this.httpClient);
    this.pipelines = new PipelinesResource(this.httpClient);
    this.companies = new CompaniesResource(this.httpClient);
    this.catalogs = new CatalogsResource(this.httpClient);
    this.users = new UsersResource(this.httpClient);
    this.roles = new RolesResource(this.httpClient);
    this.events = new EventsResource(this.httpClient);
    this.tags = new TagsResource(this.httpClient);
    this.links = new LinksResource(this.httpClient);
    this.salesbots = new SalesbotsResource(this.httpClient);
    this.sources = new SourcesResource(this.httpClient);
    this.websiteButtons = new WebsiteButtonsResource(this.httpClient);
    this.chatTemplates = new ChatTemplatesResource(this.httpClient);
    this.webhooks = new WebhooksResource(this.httpClient);
    this.files = new FilesResource(this.httpClient);
    this.account = new AccountResource(this.httpClient);
  }

  public setAccessToken(token: string) {
    this.config.accessToken = token;
    this.httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

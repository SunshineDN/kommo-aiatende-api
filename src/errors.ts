export class KommoApiError extends Error {
  status?: number;
  title?: string;
  detail?: string;
  type?: string;
  raw?: unknown;

  constructor(message: string, info?: Partial<KommoApiError>) {
    super(message);
    this.name = 'KommoApiError';
    
    if (info) {
      this.status = info.status;
      this.title = info.title;
      this.detail = info.detail;
      this.type = info.type;
      this.raw = info.raw;
    }
  }
}

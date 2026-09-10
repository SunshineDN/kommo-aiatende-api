import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { RetryConfig } from '../types';

// Métodos idempotentes por definição HTTP: repeti-los não muda o resultado final.
const IDEMPOTENT_METHODS = new Set(['get', 'delete', 'patch', 'put', 'head', 'options']);

// Códigos de erro de nível de socket/conexão (nunca chegaram a uma resposta HTTP).
const TRANSIENT_ERROR_CODES = new Set([
  'ECONNRESET',
  'ECONNABORTED',
  'ETIMEDOUT',
  'EAI_AGAIN',
  'EPIPE',
]);

export interface RetryableAxiosRequestConfig extends AxiosRequestConfig {
  /** Marca POSTs que são seguros para retry (payload já carrega request_id para dedupe na Kommo). */
  _idempotentRetry?: boolean;
  _retryCount?: number;
}

function isTransientNetworkError(error: AxiosError): boolean {
  // Se houve resposta HTTP (mesmo 4xx/5xx), a requisição chegou ao servidor: não é falha de socket.
  if (error.response) return false;

  if (error.code && TRANSIENT_ERROR_CODES.has(error.code)) return true;

  return /socket hang up|network error/i.test(error.message || '');
}

function isRetryableRequest(config: RetryableAxiosRequestConfig): boolean {
  const method = (config.method || 'get').toLowerCase();
  if (IDEMPOTENT_METHODS.has(method)) return true;
  return method === 'post' && config._idempotentRetry === true;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Instala retry com backoff exponencial para erros transitórios de rede
 * (ex.: "socket hang up"/ECONNRESET), restrito a requisições idempotentes.
 */
export function attachRetryInterceptor(client: AxiosInstance, retryConfig: RetryConfig = {}): void {
  const { retries = 2, baseDelayMs = 300, maxDelayMs = 3000 } = retryConfig;

  client.interceptors.response.use(undefined, async (error: AxiosError) => {
    const config = error.config as RetryableAxiosRequestConfig | undefined;

    if (!config || retries <= 0 || !isTransientNetworkError(error) || !isRetryableRequest(config)) {
      throw error;
    }

    const attempt = config._retryCount ?? 0;
    if (attempt >= retries) {
      throw error;
    }

    config._retryCount = attempt + 1;

    const backoff = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
    const jitter = backoff * 0.3 * Math.random();
    await wait(backoff + jitter);

    return client.request(config);
  });
}

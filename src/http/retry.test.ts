import { describe, expect, it } from 'vitest';
import axios, { AxiosError } from 'axios';
import { attachRetryInterceptor, RetryableAxiosRequestConfig } from './retry';

function networkError(config: any): AxiosError {
  const err = new Error('socket hang up') as AxiosError;
  err.isAxiosError = true;
  err.code = 'ECONNRESET';
  err.config = config;
  err.toJSON = () => ({});
  return err;
}

function httpError(config: any, status: number, headers: Record<string, string> = {}): AxiosError {
  const err = new Error('Bad Request') as AxiosError;
  err.isAxiosError = true;
  err.config = config;
  err.response = { data: {}, status, statusText: 'Bad Request', headers, config } as any;
  err.toJSON = () => ({});
  return err;
}

function fakeResponse(config: any) {
  return { data: { ok: true }, status: 200, statusText: 'OK', headers: {}, config };
}

describe('attachRetryInterceptor', () => {
  it('retries a GET on transient network error until it succeeds', async () => {
    let calls = 0;
    const client = axios.create();
    client.defaults.adapter = async (config) => {
      calls++;
      if (calls < 3) throw networkError(config);
      return fakeResponse(config);
    };
    attachRetryInterceptor(client, { retries: 3, baseDelayMs: 1, maxDelayMs: 2 });

    const res = await client.get('/leads');
    expect(res.data).toEqual({ ok: true });
    expect(calls).toBe(3);
  });

  it('gives up after the configured number of retries', async () => {
    let calls = 0;
    const client = axios.create();
    client.defaults.adapter = async (config) => {
      calls++;
      throw networkError(config);
    };
    attachRetryInterceptor(client, { retries: 2, baseDelayMs: 1, maxDelayMs: 2 });

    await expect(client.get('/leads')).rejects.toBeTruthy();
    expect(calls).toBe(3); // tentativa original + 2 retries
  });

  it('does not retry POST by default (não é idempotente sem marcação)', async () => {
    let calls = 0;
    const client = axios.create();
    client.defaults.adapter = async (config) => {
      calls++;
      throw networkError(config);
    };
    attachRetryInterceptor(client, { retries: 3, baseDelayMs: 1, maxDelayMs: 2 });

    await expect(client.post('/leads', {})).rejects.toBeTruthy();
    expect(calls).toBe(1);
  });

  it('retries POST quando marcado como idempotente (request_id garante dedupe)', async () => {
    let calls = 0;
    const client = axios.create();
    client.defaults.adapter = async (config) => {
      calls++;
      if (calls < 2) throw networkError(config);
      return fakeResponse(config);
    };
    attachRetryInterceptor(client, { retries: 3, baseDelayMs: 1, maxDelayMs: 2 });

    const config: RetryableAxiosRequestConfig = { _idempotentRetry: true };
    const res = await client.post('/leads', {}, config);
    expect(res.data).toEqual({ ok: true });
    expect(calls).toBe(2);
  });

  it('não faz retry quando o servidor respondeu (erro HTTP, não falha de socket)', async () => {
    let calls = 0;
    const client = axios.create();
    client.defaults.adapter = async (config) => {
      calls++;
      throw httpError(config, 400);
    };
    attachRetryInterceptor(client, { retries: 3, baseDelayMs: 1, maxDelayMs: 2 });

    await expect(client.get('/leads')).rejects.toBeTruthy();
    expect(calls).toBe(1);
  });

  it('não faz nada quando retries é 0', async () => {
    let calls = 0;
    const client = axios.create();
    client.defaults.adapter = async (config) => {
      calls++;
      throw networkError(config);
    };
    attachRetryInterceptor(client, { retries: 0 });

    await expect(client.get('/leads')).rejects.toBeTruthy();
    expect(calls).toBe(1);
  });

  it('faz retry em 429 mesmo em POST não marcado como idempotente (requisição nunca chegou a processar)', async () => {
    let calls = 0;
    const client = axios.create();
    client.defaults.adapter = async (config) => {
      calls++;
      if (calls < 2) throw httpError(config, 429);
      return fakeResponse(config);
    };
    attachRetryInterceptor(client, { retries: 3, baseDelayMs: 1, maxDelayMs: 2 });

    const res = await client.post('/leads', {});
    expect(res.data).toEqual({ ok: true });
    expect(calls).toBe(2);
  });

  it('honra o header Retry-After (segundos) em vez do backoff exponencial', async () => {
    let calls = 0;
    const start = Date.now();
    const client = axios.create();
    client.defaults.adapter = async (config) => {
      calls++;
      if (calls < 2) throw httpError(config, 429, { 'retry-after': '0.05' });
      return fakeResponse(config);
    };
    // baseDelayMs bem maior que o Retry-After, pra provar que é o header que manda, não o backoff.
    attachRetryInterceptor(client, { retries: 3, baseDelayMs: 5000, maxDelayMs: 10000 });

    const res = await client.get('/leads');
    expect(res.data).toEqual({ ok: true });
    expect(calls).toBe(2);
    expect(Date.now() - start).toBeLessThan(1000);
  });

  it('cai no backoff exponencial em 429 sem Retry-After', async () => {
    let calls = 0;
    const client = axios.create();
    client.defaults.adapter = async (config) => {
      calls++;
      if (calls < 2) throw httpError(config, 429);
      return fakeResponse(config);
    };
    attachRetryInterceptor(client, { retries: 3, baseDelayMs: 1, maxDelayMs: 2 });

    const res = await client.get('/leads');
    expect(res.data).toEqual({ ok: true });
    expect(calls).toBe(2);
  });

  it('desiste de 429 depois do número configurado de retries', async () => {
    let calls = 0;
    const client = axios.create();
    client.defaults.adapter = async (config) => {
      calls++;
      throw httpError(config, 429);
    };
    attachRetryInterceptor(client, { retries: 2, baseDelayMs: 1, maxDelayMs: 2 });

    await expect(client.get('/leads')).rejects.toMatchObject({ response: { status: 429 } });
    expect(calls).toBe(3);
  });
});

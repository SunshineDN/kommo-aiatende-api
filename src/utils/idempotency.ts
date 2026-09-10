import { randomUUID } from 'crypto';

/**
 * Garante um request_id no item, gerando um se ausente.
 * A Kommo usa request_id para deduplicar reenvios (ex.: em /leads/complex, retorna `merged: true`),
 * o que torna seguro reexecutar a mesma criação após uma falha de rede (ex.: "socket hang up").
 */
export function ensureRequestId<T extends { request_id?: string }>(item: T): T {
  if (item.request_id) return item;
  return { ...item, request_id: randomUUID() };
}

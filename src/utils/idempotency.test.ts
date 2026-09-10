import { describe, expect, it } from 'vitest';
import { ensureRequestId } from './idempotency';

interface TestItem {
  name: string;
  request_id?: string;
}

describe('ensureRequestId', () => {
  it('gera um request_id quando ausente', () => {
    const result = ensureRequestId<TestItem>({ name: 'Lead' });
    expect(result.request_id).toBeTruthy();
  });

  it('preserva um request_id já definido pelo chamador', () => {
    const result = ensureRequestId<TestItem>({ name: 'Lead', request_id: 'meu-id' });
    expect(result.request_id).toBe('meu-id');
  });

  it('não muta o item original', () => {
    const item: TestItem = { name: 'Lead' };
    ensureRequestId(item);
    expect(item.request_id).toBeUndefined();
  });
});

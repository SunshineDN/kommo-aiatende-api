import { BaseResource } from '../../base';
import { Account, GetAccountParams } from './types';

export class AccountResource extends BaseResource {
  async get(params?: GetAccountParams): Promise<Account> {
    let withParam: string | undefined;

    if (params?.with) {
      withParam = Array.isArray(params.with)
        ? params.with.join(',')
        : params.with;
    }

    const qsStr = withParam ? `?with=${encodeURIComponent(withParam)}` : '';
    const response = await this.client.get<Account>(`/api/v4/account${qsStr}`);
    return response.data;
  }
}

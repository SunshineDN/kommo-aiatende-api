import axios from 'axios';
import { AccessTokenResponse } from './types';

export class AuthManager {
  private domain: string;
  private clientId?: string;
  private clientSecret?: string;
  private redirectUri?: string;

  constructor(domain: string, clientId?: string, clientSecret?: string, redirectUri?: string) {
    this.domain = domain;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  async exchangeCodeForToken(code: string): Promise<AccessTokenResponse> {
    const url = `https://${this.domain}.kommo.com/oauth2/access_token`;
    const response = await axios.post<AccessTokenResponse>(url, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri,
    });
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<AccessTokenResponse> {
    const url = `https://${this.domain}.kommo.com/oauth2/access_token`;
    const response = await axios.post<AccessTokenResponse>(url, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });
    return response.data;
  }
}

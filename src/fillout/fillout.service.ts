import { Injectable, HttpException } from '@nestjs/common';
import { WebhookStoreService } from '../webhook/webhook-store.service';

@Injectable()
export class FilloutService {
  private get filloutBaseUrl() {
    return process.env.FILLOUT_BASE_URL || 'https://api.fillout.com/v1/api';
  }

  private get appBaseUrl() {
    return process.env.APP_BASE_URL || 'http://localhost:3000';
  }

  constructor(private readonly webhookStore: WebhookStoreService) {}

  getConfig() {
    return {
      appBaseUrl: this.appBaseUrl,
      filloutBaseUrl: this.filloutBaseUrl,
    };
  }

  private getHeaders(apiKey: string) {
    if (!apiKey) throw new HttpException('Missing API key', 401);
    return {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async getForms(apiKey: string) {
    const url = `${this.filloutBaseUrl}/forms`;
    const res = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(apiKey),
    });
    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    if (!res.ok) {
      throw new HttpException(
        { message: 'Fillout API error', status: res.status, data },
        res.status,
      );
    }
    const forms = Array.isArray(data) ? data : data.forms || data.data || [];
    const enriched = forms.map((f: any) => {
      const id = f.formId;
      const sub = this.webhookStore.getSubscription(id);
      return {
        ...f,
        webhookSubscribed: !!sub,
        webhookId: sub?.webhookId || null,
        webhookUrl: sub?.url || null,
      };
    });
    return enriched;
  }

  async getFormMetadata(formId: string, apiKey: string) {
    const url = `${this.filloutBaseUrl}/forms/${formId}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(apiKey),
    });
    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    if (!res.ok) {
      throw new HttpException(
        { message: 'Fillout API error', status: res.status, data },
        res.status,
      );
    }
    return data;
  }

  async getSubmissions(formId: string, apiKey: string) {
    const url = `${this.filloutBaseUrl}/forms/${formId}/submissions`;
    const res = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(apiKey),
    });
    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    if (!res.ok) {
      throw new HttpException(
        { message: 'Fillout API error', status: res.status, data },
        res.status,
      );
    }
    return data;
  }

  async createWebhook(formId: string, apiKey: string) {
    const url = `${this.filloutBaseUrl}/webhook/create`;
    const webhookUrl = `${this.appBaseUrl}/webhooks/${formId}`;

    const body = JSON.stringify({ formId, url: webhookUrl });
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(apiKey),
      body,
    });
    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    if (!res.ok) {
      throw new HttpException(
        { message: 'Fillout webhook create failed', status: res.status, data },
        res.status,
      );
    }
    const webhookId = data?.id ? String(data.id) : String(data?.webhookId || Date.now());
    this.webhookStore.setSubscription(formId, webhookId, webhookUrl);
    return { webhookId, url: webhookUrl, raw: data };
  }

  async deleteWebhook(formId: string, apiKey: string, webhookId?: string) {
    const sub = this.webhookStore.getSubscription(formId);
    const idToDelete = webhookId || sub?.webhookId;
    if (!idToDelete) {
      throw new HttpException('No webhook subscription found for this form', 404);
    }
    const url = `${this.filloutBaseUrl}/webhook/delete`;
    const body = JSON.stringify({ webhookId: idToDelete });
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(apiKey),
      body,
    });
    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    if (!res.ok) {
      throw new HttpException(
        { message: 'Fillout webhook delete failed', status: res.status, data },
        res.status,
      );
    }
    this.webhookStore.removeSubscription(formId);
    return { success: true, webhookId: idToDelete, raw: data };
  }
}

import { Injectable } from '@nestjs/common';

export interface WebhookCall {
  id: string;
  formId: string;
  timestamp: string;
  headers: Record<string, string>;
  body: any;
  query: Record<string, any>;
}

export interface WebhookSubscription {
  formId: string;
  webhookId: string;
  url: string;
  createdAt: string;
}

@Injectable()
export class WebhookStoreService {
  private calls: WebhookCall[] = [];
  private subscriptions = new Map<string, WebhookSubscription>();
  private webhookIdToFormId = new Map<string, string>();

  addCall(formId: string, headers: Record<string, string>, body: any, query: Record<string, any>) {
    const call: WebhookCall = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      formId: formId || 'unknown',
      timestamp: new Date().toISOString(),
      headers,
      body,
      query,
    };
    this.calls.unshift(call);
    if (this.calls.length > 500) this.calls.pop();
    return call;
  }

  getCalls(formId?: string) {
    if (formId) {
      return this.calls.filter((c) => c.formId === formId);
    }
    return this.calls;
  }

  getCallsGrouped() {
    const grouped: Record<string, WebhookCall[]> = {};
    for (const c of this.calls) {
      if (!grouped[c.formId]) grouped[c.formId] = [];
      grouped[c.formId].push(c);
    }
    return grouped;
  }

  setSubscription(formId: string, webhookId: string, url: string) {
    const sub: WebhookSubscription = {
      formId,
      webhookId,
      url,
      createdAt: new Date().toISOString(),
    };
    this.subscriptions.set(formId, sub);
    this.webhookIdToFormId.set(webhookId, formId);
    return sub;
  }

  getSubscription(formId: string) {
    return this.subscriptions.get(formId) || null;
  }

  getAllSubscriptions() {
    return Array.from(this.subscriptions.values());
  }

  removeSubscription(formId: string) {
    const sub = this.subscriptions.get(formId);
    if (sub) {
      this.subscriptions.delete(formId);
      this.webhookIdToFormId.delete(sub.webhookId);
    }
    return sub;
  }

  removeByWebhookId(webhookId: string) {
    const formId = this.webhookIdToFormId.get(webhookId);
    if (formId) {
      return this.removeSubscription(formId);
    }
    return null;
  }

  isSubscribed(formId: string) {
    return this.subscriptions.has(formId);
  }

  clearAll() {
    this.calls = [];
    this.subscriptions.clear();
    this.webhookIdToFormId.clear();
  }
}

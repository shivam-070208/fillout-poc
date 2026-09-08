import {
  Controller,
  Get,
  Post,
  Delete,
  Headers,
  Param,
  Query,
  Body,
  HttpException,
} from '@nestjs/common';
import { FilloutService } from '../fillout/fillout.service';
import { WebhookStoreService } from '../webhook/webhook-store.service';
import { WebhookForwardService } from '../webhook/webhook-forward.service';

@Controller('api')
export class ApiController {
  constructor(
    private readonly fillout: FilloutService,
    private readonly webhookStore: WebhookStoreService,
    private readonly forward: WebhookForwardService,
  ) {}

  @Get('config')
  getConfig() {
    return this.fillout.getConfig();
  }

  @Get('forms')
  async getForms(@Headers('authorization') auth: string, @Headers('x-api-key') xApiKey: string) {
    const apiKey = this.extractApiKey(auth, xApiKey);
    return this.fillout.getForms(apiKey);
  }

  @Get('forms/:formId')
  async getFormMeta(
    @Param('formId') formId: string,
    @Headers('authorization') auth: string,
    @Headers('x-api-key') xApiKey: string,
  ) {
    const apiKey = this.extractApiKey(auth, xApiKey);
    return this.fillout.getFormMetadata(formId, apiKey);
  }

  @Get('forms/:formId/submissions')
  async getSubmissions(
    @Param('formId') formId: string,
    @Headers('authorization') auth: string,
    @Headers('x-api-key') xApiKey: string,
  ) {
    const apiKey = this.extractApiKey(auth, xApiKey);
    return this.fillout.getSubmissions(formId, apiKey);
  }

  @Get('webhooks')
  getAllWebhooks() {
    return {
      subscriptions: this.webhookStore.getAllSubscriptions(),
      callsCount: this.webhookStore.getCalls().length,
    };
  }

  @Get('webhooks/:formId')
  getWebhookStatus(@Param('formId') formId: string) {
    const sub = this.webhookStore.getSubscription(formId);
    const calls = this.webhookStore.getCalls(formId);
    return {
      formId,
      subscribed: !!sub,
      subscription: sub,
      callsCount: calls.length,
      calls: calls.slice(0, 50),
    };
  }

  @Get('webhooks/:formId/calls')
  getWebhookCalls(@Param('formId') formId: string) {
    return this.webhookStore.getCalls(formId);
  }

  @Post('webhooks/:formId/subscribe')
  async subscribeWebhook(
    @Param('formId') formId: string,
    @Headers('authorization') auth: string,
    @Headers('x-api-key') xApiKey: string,
  ) {
    const apiKey = this.extractApiKey(auth, xApiKey);
    return this.fillout.createWebhook(formId, apiKey);
  }

  @Delete('webhooks/:formId')
  async unsubscribeWebhook(
    @Param('formId') formId: string,
    @Headers('authorization') auth: string,
    @Headers('x-api-key') xApiKey: string,
    @Query('webhookId') webhookId?: string,
    @Body() body?: any,
  ) {
    const apiKey = this.extractApiKey(auth, xApiKey);
    const id = webhookId || body?.webhookId;
    return this.fillout.deleteWebhook(formId, apiKey, id);
  }

  @Delete('webhooks')
  clearAll() {
    this.webhookStore.clearAll();
    return { success: true };
  }

  @Get('debug/env')
  debugEnv() {
    return {
      WEBHOOK_URL: process.env.WEBHOOK_URL || null,
      TEMPLATE_ID: process.env.TEMPLATE_ID || null,
      APP_BASE_URL: process.env.APP_BASE_URL || null,
      hasWebhook: !!process.env.WEBHOOK_URL,
    };
  }

  @Post('debug/forward-test')
  async debugForward(@Body() body: any) {
    const url = process.env.WEBHOOK_URL;
    if (!url) throw new HttpException('WEBHOOK_URL not set', 500);
    const payload = body && Object.keys(body).length ? body : {
      templateType: 'TEXT',
      campaignName: 'workflow_template',
      templateId: process.env.TEMPLATE_ID || 'debug',
      SKUCodes: [],
      groupIds: [],
      customerData: [{ name: 'DebugTest', phone: '9999999999' }],
    };
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'fillout-integration-poc/1.0' },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      return { status: res.status, ok: res.ok, body: text.slice(0, 2000), sent: payload, url };
    } catch (e: any) {
      return { error: e?.message || String(e), cause: e?.cause?.message || String(e?.cause || ''), stack: e?.stack?.slice(0, 1000), url, sent: payload };
    }
  }

  @Post('debug/fillout-forward')
  async debugFilloutForward(@Body() filloutBody: any) {
    // simulates Fillout -> n8n transform
    await this.forward.forward('debug-form', filloutBody || { questions: [{ name: 'name', value: 'Test' }, { name: 'phone', value: '999' }] });
    return { forwarded: true, checkVercelLogs: 'WebhookForwardService' };
  }

  private extractApiKey(auth?: string, xApiKey?: string): string {
    if (xApiKey) return xApiKey.replace('Bearer ', '').trim();
    if (auth) {
      if (auth.startsWith('Bearer ')) return auth.slice(7).trim();
      return auth.trim();
    }
    throw new HttpException('Missing API key: provide Authorization Bearer <key> or x-api-key header', 401);
  }
}

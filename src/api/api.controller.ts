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

@Controller('api')
export class ApiController {
  constructor(
    private readonly fillout: FilloutService,
    private readonly webhookStore: WebhookStoreService,
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

  private extractApiKey(auth?: string, xApiKey?: string): string {
    if (xApiKey) return xApiKey.replace('Bearer ', '').trim();
    if (auth) {
      if (auth.startsWith('Bearer ')) return auth.slice(7).trim();
      return auth.trim();
    }
    throw new HttpException('Missing API key: provide Authorization Bearer <key> or x-api-key header', 401);
  }
}

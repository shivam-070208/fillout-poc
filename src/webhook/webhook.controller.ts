import { Controller, All, Req, Res, Param } from '@nestjs/common';
import type { Request, Response } from 'express';
import { WebhookStoreService } from './webhook-store.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly store: WebhookStoreService) {}

  private parseBody(raw: any): any {
    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    }
    return raw;
  }

  @All('fillout')
  async handleFilloutWebhook(@Req() req: Request, @Res() res: Response) {
    const rawBody: any = (req as any).body;
    const body: any = this.parseBody(rawBody);
    const query: any = req.query;
    const headers: any = req.headers;
    console.log('[Webhook generic] body:', (JSON.stringify(body) || '').slice(0, 2000));

    let formId = query.formId || query.form_id || body?.formId || body?.form_id || body?.formID || body?.form?.id;
    if (!formId && body?.submissionId) {
      formId = headers['x-fillout-form-id'] as string;
    }
    if (!formId && body && typeof body === 'object') {
      const str = JSON.stringify(body);
      const match = str.match(/form[_-]?id["']?\s*[:=]\s*["']([^"']+)["']/i);
      if (match) formId = match[1];
    }
    if (!formId) {
      formId = (headers['x-fillout-form-id'] as string) || 'unknown';
    }

    const safeHeaders: Record<string, string> = {};
    for (const [k, v] of Object.entries(headers)) {
      safeHeaders[k] = Array.isArray(v) ? v.join(', ') : String(v);
    }

    const call = this.store.addCall(String(formId), safeHeaders, body, query as any);
    console.log(`[Webhook] Received for formId=${formId} id=${call.id}`);

    return res.status(200).json({ received: true, id: call.id, formId });
  }

  @All(':formId')
  async handlePerForm(@Param('formId') formId: string, @Req() req: Request, @Res() res: Response) {
    const rawBody: any = (req as any).body;
    const body: any = this.parseBody(rawBody);
    const query: any = req.query;
    const headers: any = req.headers;
    console.log(`[Webhook per-form ${formId}] body:`, (JSON.stringify(body) || '').slice(0, 2000));
    const safeHeaders: Record<string, string> = {};
    for (const [k, v] of Object.entries(headers)) {
      safeHeaders[k] = Array.isArray(v) ? v.join(', ') : String(v);
    }
    const call = this.store.addCall(String(formId), safeHeaders, body, query as any);
    console.log(`[Webhook] Received for per-form ${formId} id=${call.id}`);
    return res.status(200).json({ received: true, id: call.id, formId });
  }
}

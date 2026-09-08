import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WebhookForwardService {
  private readonly logger = new Logger(WebhookForwardService.name);

  private get webhookUrl(): string | undefined {
    return process.env.WEBHOOK_URL;
  }

  private get templateId(): string | undefined {
    return process.env.TEMPLATE_ID;
  }

  async forward(formId: string, originalBody: any): Promise<void> {
    const url = this.webhookUrl;
    if (!url) {
      this.logger.warn('WEBHOOK_URL not set in .env, skipping forward');
      return;
    }

    const { templateId, name, phone } = this.extractFields(originalBody);

    if (!templateId) {
      this.logger.warn('templateId not found in form submission, forwarding with empty templateId');
    }

    const payload = {
      templateId: templateId || '',
      name: name || '',
      phone: phone || '',
    };

    this.logger.log(`Forwarding webhook for formId=${formId} to ${url} with payload ${JSON.stringify(payload).slice(0, 500)}`);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'fillout-integration-poc/1.0' },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      this.logger.log(`Forward response ${res.status} ${text.slice(0, 1000)}`);
      if (!res.ok) this.logger.warn(`Forward non-2xx ${res.status}`);
    } catch (e: any) {
      this.logger.error(`Forward failed to ${url}: ${e?.message || e} | cause: ${e?.cause?.message || e?.cause || 'n/a'} | stack: ${e?.stack?.slice(0, 500) || 'n/a'}`);
    }
  }

  private extractFields(body: any): { templateId: string; name: string; phone: string } {
    if (!body || typeof body !== 'object') return { templateId: this.templateId || '', name: '', phone: '' };

    // direct fields
    if (typeof body.templateId === 'string' || typeof body.name === 'string' || typeof body.phone === 'string') {
      return {
        templateId: String(body.templateId || this.templateId || ''),
        name: String(body.name || ''),
        phone: String(body.phone || ''),
      };
    }

    const questions: any[] =
      body.questions ||
      body.submission?.questions ||
      body.data?.questions ||
      body.response?.questions ||
      body.payload?.questions ||
      body.answers?.questions ||
      [];

    if (Array.isArray(questions) && questions.length > 0) {
      let templateIdVal = '';
      let nameVal = '';
      let phoneVal = '';

      for (const q of questions) {
        const qName = String(q.name || q.title || q.label || q.id || '').toLowerCase();
        const qId = String(q.id || '').toLowerCase();
        const qType = String(q.type || '').toLowerCase();
        const val = q.value ?? q.answer ?? q.response ?? '';

        if (!templateIdVal && (qName.includes('template') || qId.includes('template') || qId.includes('templateid'))) {
          templateIdVal = String(val);
        }
        if (!nameVal && (qName.includes('name') || qId.includes('name') || qType === 'name')) {
          nameVal = String(val);
        }
        if (!phoneVal && (qName.includes('phone') || qName.includes('mobile') || qName.includes('number') || qId.includes('phone') || qId.includes('mobile') || qType.includes('phone'))) {
          phoneVal = String(val);
        }
      }

      // also check if templateId stored as hidden field/value not in questions naming
      if (!templateIdVal) {
        // fallback to env or direct extraction from body string
        const str = JSON.stringify(body);
        const m = str.match(/"templateId"\s*:\s*"([^"]+)"/i);
        if (m) templateIdVal = m[1];
        else if (this.templateId) templateIdVal = this.templateId;
      }

      return {
        templateId: String(templateIdVal || this.templateId || ''),
        name: String(nameVal || ''),
        phone: String(phoneVal || ''),
      };
    }

    // fallback deep search
    let templateId = body.templateId || (this.templateId as string) || '';
    let name = body.name || body.customerName || body.fullName || '';
    let phone = body.phone || body.phoneNumber || body.mobile || body.customerPhone || '';

    const str = JSON.stringify(body);
    if (!templateId) {
      const m = str.match(/"templateId"\s*:\s*"([^"]+)"/i);
      if (m) templateId = m[1];
      else if (this.templateId) templateId = this.templateId;
    }
    if (!name) {
      const m = str.match(/"name"\s*:\s*"([^"]+)"/i);
      if (m) name = m[1];
    }
    if (!phone) {
      const m = str.match(/"phone"\s*:\s*"([^"]+)"/i);
      if (m) phone = m[1];
    }

    return { templateId: String(templateId || ''), name: String(name || ''), phone: String(phone || '') };
  }

  private extractNamePhone(body: any): { name: string; phone: string } {
    const { name, phone } = this.extractFields(body);
    return { name, phone };
  }
}

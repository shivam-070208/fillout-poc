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

    const templateId = this.templateId;
    if (!templateId) {
      this.logger.warn('TEMPLATE_ID not set in .env, forwarding with empty templateId');
    }

    const { name, phone } = this.extractNamePhone(originalBody);

    const payload = {
      templateId: templateId || '',
      name: name || '',
      phone: phone || '',

    };

    this.logger.log(`Forwarding webhook for formId=${formId} to ${url} with payload ${JSON.stringify(payload).slice(0, 500)}`);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      this.logger.log(`Forward response ${res.status} ${text.slice(0, 1000)}`);
    } catch (e: any) {
      this.logger.error(`Forward failed to ${url}: ${e?.message || e}`);
    }
  }

  private extractNamePhone(body: any): { name: string; phone: string } {
    if (!body || typeof body !== 'object') return { name: '', phone: '' };

    // direct fields (if Fillout already mapped or custom)
    if (typeof body.name === 'string' && typeof body.phone === 'string') {
      return { name: body.name, phone: body.phone };
    }

    // try questions array locations
    const questions: any[] =
      body.questions ||
      body.submission?.questions ||
      body.data?.questions ||
      body.response?.questions ||
      body.payload?.questions ||
      body.answers?.questions ||
      [];

    if (Array.isArray(questions) && questions.length > 0) {
      let nameVal = '';
      let phoneVal = '';

      for (const q of questions) {
        const qName = String(q.name || q.title || q.label || q.id || '').toLowerCase();
        const qId = String(q.id || '').toLowerCase();
        const qType = String(q.type || '').toLowerCase();
        const val = q.value ?? q.answer ?? q.response ?? '';

        // name detection
        if (!nameVal && (qName.includes('name') || qId.includes('name') || qType === 'name')) {
          nameVal = String(val);
        }
        // phone detection - check phone, mobile, number
        if (!phoneVal && (qName.includes('phone') || qName.includes('mobile') || qName.includes('number') || qId.includes('phone') || qId.includes('mobile') || qType.includes('phone'))) {
          phoneVal = String(val);
        }
      }

      // fallback: if not found by name, try first two values
      if (!nameVal && questions[0]?.value) nameVal = String(questions[0].value);
      if (!phoneVal && questions[1]?.value) phoneVal = String(questions[1].value);

      // also check body directly for those keys inside questions values
      return { name: nameVal, phone: phoneVal };
    }

    // fallback: search deep for name/phone keys in body
    let name = body.name || body.customerName || body.fullName || '';
    let phone = body.phone || body.phoneNumber || body.mobile || body.customerPhone || '';

    if (!name || !phone) {
      const str = JSON.stringify(body);
      if (!name) {
        const m = str.match(/"name"\s*:\s*"([^"]+)"/i);
        if (m) name = m[1];
      }
      if (!phone) {
        const m = str.match(/"phone"\s*:\s*"([^"]+)"/i);
        if (m) phone = m[1];
        if (!phone) {
          const m2 = str.match(/"value"\s*:\s*"(\+?\d{7,15})"/);
          if (m2) phone = m2[1];
        }
      }
    }

    return { name: String(name || ''), phone: String(phone || '') };
  }
}

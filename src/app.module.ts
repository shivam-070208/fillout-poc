import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilloutService } from './fillout/fillout.service';
import { ApiController } from './api/api.controller';
import { WebhookController } from './webhook/webhook.controller';
import { WebhookStoreService } from './webhook/webhook-store.service';

@Module({
  imports: [],
  controllers: [AppController, ApiController, WebhookController],
  providers: [AppService, FilloutService, WebhookStoreService],
})
export class AppModule {}

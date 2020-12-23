import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentRepository } from './services/payment/PaymentRepository';

export const appModuleMetadata = {
  imports: [],
  controllers: [AppController],
  providers: [AppService, PaymentRepository],
};

@Module(appModuleMetadata)
export class AppModule {}

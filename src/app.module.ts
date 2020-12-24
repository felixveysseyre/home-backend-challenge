import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { PaymentResolver } from './API/payment/PaymentResolver';
import { PaymentRepository } from './services/payment/PaymentRepository';

export const appModuleMetadata = {
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      debug: false,
      playground: true,
    }),
  ],
  controllers: [],
  providers: [PaymentRepository, PaymentResolver],
};

@Module(appModuleMetadata)
export class AppModule {}

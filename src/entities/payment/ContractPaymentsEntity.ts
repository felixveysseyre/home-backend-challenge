import { Field, ObjectType } from '@nestjs/graphql';

import { Payment } from './Payment';
import { PaymentEntity } from './PaymentEntity';

@ObjectType('ContractPayments')
export class ContractPaymentsEntity {
  @Field(() => Number, { nullable: false })
  sum: Payment['value'];

  @Field(() => [PaymentEntity], { nullable: false })
  items: Payment[];
}

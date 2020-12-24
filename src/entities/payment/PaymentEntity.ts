import { Field, ObjectType } from '@nestjs/graphql';

import { Payment } from './Payment';

@ObjectType('Payment')
export class PaymentEntity {
  @Field(() => String, { nullable: false })
  id: Payment['id'];

  @Field(() => String, { nullable: false })
  contractId: Payment['contractId'];

  @Field(() => String, { nullable: false })
  description: Payment['description'];

  @Field(() => Number, { nullable: false })
  value: Payment['value'];

  @Field(() => Date, { nullable: false })
  time: Payment['time'];

  @Field(() => Date, { nullable: false })
  createdAt: Payment['createdAt'];

  @Field(() => Date, { nullable: true })
  updatedAt: Payment['updatedAt'];

  @Field(() => Date, { nullable: true })
  deletedAt: Payment['deletedAt'];
}

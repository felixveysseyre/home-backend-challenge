import { Field, InputType } from '@nestjs/graphql';
import { Payment } from '../Payment';

@InputType()
export class CreatePaymentInput {
  @Field(() => String, { nullable: false })
  contractId: Payment['contractId'];

  @Field(() => String, { nullable: false })
  description: Payment['description'];

  @Field(() => Number, { nullable: false })
  value: Payment['value'];

  @Field(() => Date, { nullable: false })
  time: Payment['time'];
}

import { Field, InputType } from '@nestjs/graphql';
import { Payment } from '../Payment';

@InputType()
export class UpdatePaymentInput {
  @Field(() => String, { nullable: false })
  id: Payment['id'];

  @Field(() => String, { nullable: true })
  contractId?: Payment['contractId'];

  @Field(() => String, { nullable: true })
  description?: Payment['description'];

  @Field(() => Number, { nullable: true })
  value?: Payment['value'];

  @Field(() => Date, { nullable: true })
  time?: Payment['time'];
}

import { Field, InputType } from '@nestjs/graphql';
import { Payment } from '../Payment';

@InputType()
export class GetPaymentsTimeIntervalInput {
  @Field(() => Date, { nullable: true })
  after?: Payment['time'];

  @Field(() => Date, { nullable: true })
  before?: Payment['time'];
}

@InputType()
export class GetPaymentsInput {
  @Field(() => [String], { nullable: true })
  ids?: Payment['id'][];

  @Field(() => [String], { nullable: true })
  contractIds?: Payment['contractId'][];

  @Field(() => GetPaymentsTimeIntervalInput, { nullable: true })
  timeInterval?: GetPaymentsTimeIntervalInput;
}

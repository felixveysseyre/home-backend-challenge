import { Field, InputType } from '@nestjs/graphql';
import { Payment } from '../Payment';
import { GetPaymentsTimeIntervalInput } from './GetPaymentsInput';

@InputType()
export class GetContractPaymentsInput {
  @Field(() => String, { nullable: false })
  contractId: Payment['contractId'];

  @Field(() => GetPaymentsTimeIntervalInput, { nullable: true })
  timeInterval?: GetPaymentsTimeIntervalInput;
}

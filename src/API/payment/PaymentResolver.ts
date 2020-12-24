import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContractPaymentsEntity } from '../../entities/payment/ContractPaymentsEntity';
import { CreatePaymentInput } from '../../entities/payment/inputs/CreatePaymentInput';
import { GetContractPaymentsInput } from '../../entities/payment/inputs/GetContractPaymentsInput';
import { GetPaymentsInput } from '../../entities/payment/inputs/GetPaymentsInput';
import { UpdatePaymentInput } from '../../entities/payment/inputs/UpdatePaymentInput';
import { PaymentEntity } from '../../entities/payment/PaymentEntity';
import { PaymentRepository } from '../../services/payment/PaymentRepository';

@Resolver()
export class PaymentResolver {
  private readonly paymentRepository: PaymentRepository;

  constructor(paymentRepository: PaymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  /* Mutations */

  @Mutation(() => PaymentEntity)
  public createPayment(@Args('payment') payment: CreatePaymentInput) {
    return this.paymentRepository.add({ payment });
  }

  @Mutation(() => PaymentEntity)
  public updatePayment(@Args('update') update: UpdatePaymentInput) {
    return this.paymentRepository.update({ update });
  }

  @Mutation(() => PaymentEntity)
  public deletePayment(@Args('id') id: string) {
    return this.paymentRepository.delete({ id });
  }

  /* Queries */

  @Query(() => [PaymentEntity])
  public payments(@Args('filters') filters: GetPaymentsInput) {
    return this.paymentRepository.get(filters);
  }

  @Query(() => ContractPaymentsEntity)
  public contractPayments(@Args('filters') filters: GetContractPaymentsInput) {
    const payments = this.paymentRepository.get({
      contractIds: [filters.contractId],
      timeInterval: filters.timeInterval,
    });

    return {
      sum: payments.reduce((accumulator, payment) => {
        return accumulator + payment.value;
      }, 0),
      items: payments,
    };
  }
}

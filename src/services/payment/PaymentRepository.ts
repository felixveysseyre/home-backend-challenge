import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

import { Payment } from '../../entities/Payment';

@Injectable()
export class PaymentRepository {
  private store: Payment[] = [];

  public add({
    payment,
  }: {
    payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
  }) {
    const paymentCreated = {
      ...payment,
      id: nanoid(),
      createdAt: new Date(),
      updatedAt: undefined,
      deletedAt: undefined,
    };

    this.store.push(paymentCreated);

    return paymentCreated;
  }

  public get({
    ids,
    contractIds,
    timeInterval,
  }: {
    ids?: Payment['id'][];
    contractIds?: Payment['contractId'][];
    timeInterval?: {
      after?: Payment['time'];
      before?: Payment['time'];
    };
  }) {
    /* Checkers */

    const checkId = (payment: Payment) => {
      return ids ? ids.includes(payment.id) : true;
    };

    const checkContractId = (payment: Payment) => {
      return contractIds ? contractIds.includes(payment.contractId) : true;
    };

    const checkTime = (payment: Payment) => {
      if (!timeInterval) {
        return true;
      }

      if (timeInterval.after && timeInterval.before) {
        return (
          payment.time.valueOf() >= timeInterval.after.valueOf() &&
          payment.time.valueOf() <= timeInterval.before.valueOf()
        );
      }

      if (timeInterval.after) {
        return payment.time.valueOf() >= timeInterval.after.valueOf();
      }

      if (timeInterval.before) {
        return payment.time.valueOf() <= timeInterval.before.valueOf();
      }
    };

    /* Return */

    return this.store.filter((payment) => {
      return checkId(payment) && checkContractId(payment) && checkTime(payment);
    });
  }

  public getById({ id }: { id: Payment['id'] }) {
    const payments = this.get({ ids: [id] });

    if (payments.length !== 1) {
      throw new Error(`Payment not found: ${id}`);
    }

    return payments[0];
  }

  public update({
    update,
  }: {
    update: Pick<Payment, 'id'> & Partial<Omit<Payment, 'id'>>;
  }) {
    const paymentFound = this.getById({ id: update.id });
    const paymentUpdated = {
      ...paymentFound,
      updatedAt: new Date(),
      ...update,
    };

    this.store = this.store.map((payment) => {
      return payment.id === update.id ? paymentUpdated : payment;
    });

    return paymentUpdated;
  }

  public delete({ id }: { id: Payment['id'] }) {
    return this.update({ update: { id, deletedAt: new Date() } });
  }

  private clear() {
    this.store = [];
  }
}

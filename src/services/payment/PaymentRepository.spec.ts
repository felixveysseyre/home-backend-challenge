import { Test } from '@nestjs/testing';
import { appModuleMetadata } from '../../app.module';
import { Payment } from '../../entities/Payment';

import { PaymentRepository } from './PaymentRepository';

describe('PaymentRepository', () => {
  let paymentRepository: PaymentRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule(appModuleMetadata).compile();

    paymentRepository = module.get<PaymentRepository>(PaymentRepository);
  });

  beforeEach(() => {
    // @ts-expect-error: Method is private
    paymentRepository.clear();
  });

  describe('add', () => {
    it('succeeds to add a payment', () => {
      const paymentCreated = paymentRepository.add({
        payment: {
          contractId: 'fakeContractId',
          description: 'Fake description',
          value: 123,
          time: new Date(),
        },
      });

      expect(paymentCreated).toMatchSnapshot({
        id: expect.any(String),
        time: expect.any(Date),
        createdAt: expect.any(Date),
      });
    });
  });

  describe('get', () => {
    let payments: Payment[];

    beforeEach(() => {
      payments = [
        paymentRepository.add({
          payment: {
            contractId: 'fakeContractId1',
            description: 'Fake description',
            value: 123,
            time: new Date(1),
          },
        }),
        paymentRepository.add({
          payment: {
            contractId: 'fakeContractId2',
            description: 'Fake description',
            value: 123,
            time: new Date(2),
          },
        }),
      ];
    });

    it('succeeds to get payments, filtered by id', () => {
      expect(paymentRepository.get({ ids: [payments[0].id] })).toEqual([
        payments[0],
      ]);
    });

    it('succeeds to get payments, filtered by contractId', () => {
      expect(
        paymentRepository.get({ contractIds: [payments[0].contractId] }),
      ).toEqual([payments[0]]);
    });

    it('succeeds to get payments, filtered by timeInterval after', () => {
      expect(
        paymentRepository.get({ timeInterval: { after: payments[1].time } }),
      ).toEqual([payments[1]]);
    });

    it('succeeds to get payments, filtered by timeInterval before', () => {
      expect(
        paymentRepository.get({ timeInterval: { before: payments[0].time } }),
      ).toEqual([payments[0]]);
    });

    it('succeeds to get payments, filtered by timeInterval after and before', () => {
      expect(
        paymentRepository.get({
          timeInterval: { after: payments[0].time, before: payments[1].time },
        }),
      ).toEqual(payments);
    });
  });

  describe('getById', () => {
    let payment: Payment;

    beforeEach(() => {
      payment = paymentRepository.add({
        payment: {
          contractId: 'fakeContractId',
          description: 'Fake description',
          value: 123,
          time: new Date(1),
        },
      });
    });

    it('succeeds to get payment', () => {
      expect(paymentRepository.getById({ id: payment.id })).toEqual(payment);
    });

    it('fails to get payment, if not existing', () => {
      expect(() => paymentRepository.getById({ id: 'falseId' })).toThrow(
        'Payment not found',
      );
    });
  });

  describe('update', () => {
    let payment: Payment;

    beforeEach(() => {
      payment = paymentRepository.add({
        payment: {
          contractId: 'fakeContractId',
          description: 'Fake description',
          value: 123,
          time: new Date(1),
        },
      });
    });

    it('succeeds to update payment', () => {
      const update = {
        id: payment.id,
        contractId: 'updateFakeContractId',
        description: 'Updated fake description',
        value: 1234,
        time: new Date(2),
      };

      const updatedPayment = paymentRepository.update({ update });

      expect(updatedPayment.id).toBe(payment.id);
      expect(updatedPayment).toMatchSnapshot({
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(paymentRepository.getById({ id: payment.id })).toEqual(
        updatedPayment,
      );
    });

    it('fails to update payment, if not existing', () => {
      expect(() =>
        paymentRepository.update({
          update: {
            id: 'falseId',
          },
        }),
      ).toThrow('Payment not found');
    });
  });

  describe('delete', () => {
    let payment: Payment;

    beforeEach(() => {
      payment = paymentRepository.add({
        payment: {
          contractId: 'fakeContractId',
          description: 'Fake description',
          value: 123,
          time: new Date(1),
        },
      });
    });

    it('succeed to delete a payment', () => {
      const deletedPayment = paymentRepository.delete({ id: payment.id });

      expect(deletedPayment.id).toBe(payment.id);
      expect(deletedPayment).toMatchSnapshot({
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: expect.any(Date),
      });

      expect(paymentRepository.getById({ id: payment.id })).toEqual(
        deletedPayment,
      );
    });

    it('fails to delete payment, if not existing', () => {
      expect(() =>
        paymentRepository.delete({
          id: 'falseId',
        }),
      ).toThrow('Payment not found');
    });
  });
});

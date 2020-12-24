import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { gql } from 'apollo-server-express';

import { appModuleMetadata } from '../../app.module';
import { Payment } from '../../entities/payment/Payment';
import { requestAPI } from '../../helpers/requestAPI';
import { PaymentRepository } from '../../services/payment/PaymentRepository';

describe('PaymentResolver', () => {
  let application: NestExpressApplication;
  let paymentRepository: PaymentRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule(appModuleMetadata).compile();

    application = module.createNestApplication<NestExpressApplication>();
    paymentRepository = module.get<PaymentRepository>(PaymentRepository);

    await application.init();
  });

  beforeEach(() => {
    // @ts-expect-error: Method is private
    paymentRepository.clear();
  });

  describe('createPayment', () => {
    const query = gql`
      mutation createPayment($payment: CreatePaymentInput!) {
        createPayment(payment: $payment) {
          id
          contractId
          description
          value
          time
          createdAt
          updatedAt
          deletedAt
        }
      }
    `;

    it('succeeds to create a payment', async () => {
      const payment = {
        contractId: 'fakeContractId',
        description: 'Fake description',
        value: 123,
        time: new Date(),
      };

      const response = await requestAPI({
        application,
        query,
        variables: {
          payment,
        },
      });

      expect(response.status).toEqual(200);
      expect(response.body.errors).not.toBeDefined();
      expect(response.body.data).toEqual({
        createPayment: {
          id: expect.any(String),
          contractId: payment.contractId,
          description: payment.description,
          value: payment.value,
          time: payment.time.toISOString(),
          createdAt: expect.any(String),
          updatedAt: null,
          deletedAt: null,
        },
      });
    });
  });

  describe('getPayments', () => {
    const query = gql`
      query payments($filters: GetPaymentsInput!) {
        payments(filters: $filters) {
          id
        }
      }
    `;

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

    it('succeeds to get payments, filtered by id', async () => {
      const response = await requestAPI({
        application,
        query,
        variables: {
          filters: {
            ids: [payments[0].id],
          },
        },
      });

      expect(response.status).toEqual(200);
      expect(response.body.errors).not.toBeDefined();
      expect(response.body.data).toEqual({
        payments: [
          {
            id: payments[0].id,
          },
        ],
      });
    });

    it('succeeds to get payments, filtered by contractId', async () => {
      const response = await requestAPI({
        application,
        query,
        variables: {
          filters: {
            contractIds: [payments[0].contractId],
          },
        },
      });

      expect(response.status).toEqual(200);
      expect(response.body.errors).not.toBeDefined();
      expect(response.body.data).toEqual({
        payments: [
          {
            id: payments[0].id,
          },
        ],
      });
    });

    it('succeeds to get payments, filtered by timeInterval after', async () => {
      const response = await requestAPI({
        application,
        query,
        variables: {
          filters: {
            timeInterval: { after: payments[1].time },
          },
        },
      });

      expect(response.status).toEqual(200);
      expect(response.body.errors).not.toBeDefined();
      expect(response.body.data).toEqual({
        payments: [
          {
            id: payments[1].id,
          },
        ],
      });
    });

    it('succeeds to get payments, filtered by timeInterval before', async () => {
      const response = await requestAPI({
        application,
        query,
        variables: {
          filters: {
            timeInterval: { before: payments[0].time },
          },
        },
      });

      expect(response.status).toEqual(200);
      expect(response.body.errors).not.toBeDefined();
      expect(response.body.data).toEqual({
        payments: [
          {
            id: payments[0].id,
          },
        ],
      });
    });

    it('succeeds to get payments, filtered by timeInterval after and before', async () => {
      const response = await requestAPI({
        application,
        query,
        variables: {
          filters: {
            timeInterval: { after: payments[0].time, before: payments[1].time },
          },
        },
      });

      expect(response.status).toEqual(200);
      expect(response.body.errors).not.toBeDefined();
      expect(response.body.data).toEqual({
        payments: [
          {
            id: payments[0].id,
          },
          {
            id: payments[1].id,
          },
        ],
      });
    });
  });

  describe('update', () => {
    const query = gql`
      mutation updatePayment($update: UpdatePaymentInput!) {
        updatePayment(update: $update) {
          id
          contractId
          description
          value
          time
          createdAt
          updatedAt
          deletedAt
        }
      }
    `;

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

    it('succeeds to update payment', async () => {
      const update = {
        id: payment.id,
        contractId: 'updateFakeContractId',
        description: 'Updated fake description',
        value: 1234,
        time: new Date(2),
      };

      const response = await requestAPI({
        application,
        query,
        variables: {
          update,
        },
      });

      expect(response.status).toEqual(200);
      expect(response.body.errors).not.toBeDefined();
      expect(response.body.data).toEqual({
        updatePayment: {
          id: expect.any(String),
          contractId: update.contractId,
          description: update.description,
          value: update.value,
          time: update.time.toISOString(),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          deletedAt: null,
        },
      });
    });
  });

  describe('delete', () => {
    const query = gql`
      mutation deletePayment($id: String!) {
        deletePayment(id: $id) {
          id
          contractId
          description
          value
          time
          createdAt
          updatedAt
          deletedAt
        }
      }
    `;

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

    it('succeeds to update payment', async () => {
      const response = await requestAPI({
        application,
        query,
        variables: {
          id: payment.id,
        },
      });

      expect(response.status).toEqual(200);
      expect(response.body.errors).not.toBeDefined();
      expect(response.body.data).toEqual({
        deletePayment: {
          id: expect.any(String),
          contractId: payment.contractId,
          description: payment.description,
          value: payment.value,
          time: payment.time.toISOString(),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          deletedAt: expect.any(String),
        },
      });
    });
  });

  describe('contractPayments', () => {
    const query = gql`
      query contractPayments($filters: GetContractPaymentsInput!) {
        contractPayments(filters: $filters) {
          sum
          items {
            id
          }
        }
      }
    `;

    let payments: Payment[];

    beforeEach(() => {
      payments = [
        paymentRepository.add({
          payment: {
            contractId: 'fakeContractId1',
            description: 'Fake description',
            value: 1,
            time: new Date(1),
          },
        }),
        paymentRepository.add({
          payment: {
            contractId: 'fakeContractId1',
            description: 'Fake description',
            value: 2,
            time: new Date(2),
          },
        }),
        paymentRepository.add({
          payment: {
            contractId: 'fakeContractId2',
            description: 'Fake description',
            value: 3,
            time: new Date(3),
          },
        }),
        paymentRepository.add({
          payment: {
            contractId: 'fakeContractId2',
            description: 'Fake description',
            value: 4,
            time: new Date(4),
          },
        }),
      ];
    });

    it.each([
      {
        filters: {
          contractId: 'fakeContractId1',
          timeInterval: { after: new Date(2) },
        },
        expectedSum: 2,
        expectedItemsNumber: 1,
      },
      {
        filters: {
          contractId: 'fakeContractId1',
          timeInterval: { after: new Date(3) },
        },
        expectedSum: 0,
        expectedItemsNumber: 0,
      },
      {
        filters: {
          contractId: 'fakeContractId2',
          timeInterval: { after: new Date(3) },
        },
        expectedSum: 7,
        expectedItemsNumber: 2,
      },
      {
        filters: {
          contractId: 'fakeContractId2',
          timeInterval: { before: new Date(3) },
        },
        expectedSum: 3,
        expectedItemsNumber: 1,
      },
    ])(
      'succeeds to get contract payments',
      async ({ filters, expectedSum, expectedItemsNumber }) => {
        const response = await requestAPI({
          application,
          query,
          variables: {
            filters,
          },
        });

        expect(response.status).toEqual(200);
        expect(response.body.errors).not.toBeDefined();
        expect(response.body.data.contractPayments.sum).toBe(expectedSum);
        expect(response.body.data.contractPayments.items).toHaveLength(
          expectedItemsNumber,
        );
      },
    );
  });
});

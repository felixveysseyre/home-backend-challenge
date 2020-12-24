export type Payment = {
  id: string;
  contractId: string;
  description: string;
  value: number;
  time: Date;
  createdAt: Date;
  updatedAt: Date | undefined;
  deletedAt: Date | undefined;
};

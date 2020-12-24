import { DocumentNode, print } from 'graphql';
import * as request from 'supertest';

export function requestAPI({
  application,
  operationName,
  query,
  variables,
}: {
  application: any;
  operationName?: string;
  query: DocumentNode;
  variables?: Record<string, any>;
}) {
  return request(application.getHttpServer())
    .post('/graphql')
    .send({
      operationName,
      query: print(query),
      variables,
    });
}
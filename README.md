# Installation #

```
npm install
```

# Run #

## Development ##

```
npm run start:dev
```

## Production ##

```
npm run build
npm run start:prod
```

# API #

The API has been implemented using GraphQL

The GraphQL endpoint is: [http://localhost:3000/graphql](http://localhost:3000/graphql)

The GraphQL playground has been enabled for project testing purposes

# Tests #

The project has been tested when required using Jest.

The fake data store (`PaymentRepository`) has been [fully tested](src/services/payment/PaymentRepository.spec.ts)

The API (`PaymentResolver`) has been [fully tested](src/API/payment/PaymentResolver.spec.ts)
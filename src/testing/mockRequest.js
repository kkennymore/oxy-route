// src/testing/mockRequest.js

const supertest = require('supertest');

function mockRequest(appOrRouter) {
  return supertest(appOrRouter.handler ? appOrRouter.handler() : appOrRouter);
}

module.exports = mockRequest;

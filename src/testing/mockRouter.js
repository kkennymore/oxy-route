// src/testing/mockRouter.js

const { Router } = require('../Router');

function mockRouter(routeCallback) {
  const router = new Router();
  routeCallback(router);
  return router;
}

module.exports = mockRouter;

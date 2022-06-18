// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

// polyfill necessary for jsdom test environment
import { TextDecoder, TextEncoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { resetDb } from "./__tests__/__mocks__/db/utils/reset-db.ts";
// src/setupTests.js
import { server } from "@/__tests__/__mocks__/msw/server.js";

// Establish API mocking before all tests
beforeAll(() => server.listen());

beforeEach(async () => {
  await resetDb();
});

// reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => server.resetHandlers());

// clean up after the tests are finsihed
afterAll(() => server.close());

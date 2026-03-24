function authHeaders(overrides = {}) {
  return {
    "x-test-auth": "true",
    "x-test-user-id": "user-123",
    "x-test-user-name": "Test User",
    "x-test-user-email": "test@example.com",
    ...overrides,
  };
}

module.exports = { authHeaders };
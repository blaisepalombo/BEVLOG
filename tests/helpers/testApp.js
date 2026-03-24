const { createApp } = require("../../src/config/app");

function createTestApp() {
  return createApp({
    authMode: "test",
    enableSwagger: false,
  });
}

module.exports = { createTestApp };
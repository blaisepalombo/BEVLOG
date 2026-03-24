require("dotenv").config();

const swaggerDocument = require("./swagger-output.json");
const { connectToMongo } = require("./src/db/mongodb");
const { createApp } = require("./src/config/app");

const PORT = process.env.PORT || 3000;
const isRender = !!process.env.RENDER_EXTERNAL_HOSTNAME;

const app = createApp({ swaggerDocument });

async function start() {
  await connectToMongo();

  return app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    const baseUrl = isRender
      ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`
      : `http://localhost:${PORT}`;

    console.log(`Docs: ${baseUrl}/api-docs`);
  });
}

if (require.main === module) {
  start().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}

module.exports = { app, start };
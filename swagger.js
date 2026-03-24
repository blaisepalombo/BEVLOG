const swaggerAutogen = require("swagger-autogen")();

const isRender = !!process.env.RENDER_EXTERNAL_HOSTNAME;

const doc = {
  info: {
    title: "Energy Drink Log API",
    description:
      "REST API for tracking energy drinks with MongoDB, Google OAuth, filtering, pagination, stats, and full CRUD operations.",
    version: "1.1.0",
  },
  host: isRender
    ? process.env.RENDER_EXTERNAL_HOSTNAME
    : `localhost:${process.env.PORT || 3000}`,
  schemes: isRender ? ["https"] : ["http"],
  tags: [
    { name: "Drinks", description: "Energy drink logging endpoints" },
    { name: "Auth", description: "Google OAuth and session endpoints" },
  ],
  securityDefinitions: {
    cookieAuth: {
      type: "apiKey",
      in: "cookie",
      name: "sid",
      description:
        "Session cookie set after logging in via /auth/google. Open /auth/google in the browser first, then use Swagger in the same browser session.",
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger JSON generated:", outputFile);
});
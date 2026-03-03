// swagger.js
const swaggerAutogen = require("swagger-autogen")();

const isRender = !!process.env.RENDER_EXTERNAL_HOSTNAME;

const doc = {
  info: {
    title: "Energy Drink Log API",
    description:
      "CRUD API for logging energy drinks. Write routes require Google login via /auth/google.",
    version: "1.0.0",
  },
  host: isRender
    ? process.env.RENDER_EXTERNAL_HOSTNAME
    : `localhost:${process.env.PORT || 3000}`,
  schemes: isRender ? ["https"] : ["http"],

  // Swagger 2.0 security definitions
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
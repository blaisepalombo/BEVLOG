const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const connectMongo = require("connect-mongo");
const MongoStore = connectMongo.default || connectMongo;
const passport = require("passport");
const swaggerUi = require("swagger-ui-express");

const router = require("../routes");
const { configurePassport } = require("../auth/passport");

function createApp(options = {}) {
  const {
    authMode = "normal",
    enableSwagger = true,
    swaggerDocument = null,
  } = options;

  const app = express();
  const isRender = !!process.env.RENDER_EXTERNAL_HOSTNAME;
  const publicPath = path.join(process.cwd(), "public");

  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (authMode === "test") {
    app.use((req, res, next) => {
      const isAuthenticated = req.headers["x-test-auth"] === "true";

      req.isAuthenticated = () => isAuthenticated;

      req.logout = (callback) => {
        req.user = null;
        if (typeof callback === "function") callback(null);
      };

      req.session = {
        destroy: (callback) => {
          if (typeof callback === "function") callback(null);
        },
      };

      if (isAuthenticated) {
        req.user = {
          id: req.headers["x-test-user-id"] || "user-123",
          displayName: req.headers["x-test-user-name"] || "Test User",
          email: req.headers["x-test-user-email"] || "test@example.com",
        };
      } else {
        req.user = null;
      }

      next();
    });
  } else {
    app.use(
      session({
        name: "sid",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        proxy: isRender,
        store: MongoStore.create({
          mongoUrl: process.env.MONGODB_URI,
          dbName: process.env.DB_NAME,
          collectionName: "sessions",
        }),
        cookie: {
          httpOnly: true,
          sameSite: "lax",
          secure: isRender,
          maxAge: 1000 * 60 * 60 * 24 * 7,
        },
      })
    );

    configurePassport();
    app.use(passport.initialize());
    app.use(passport.session());
  }

  app.use(express.static(publicPath));

  app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });

  app.use("/", router);

  if (enableSwagger && swaggerDocument) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(publicPath, "dashboard.html"));
  });

  app.get("/form", (req, res) => {
    res.sendFile(path.join(publicPath, "form.html"));
  });

  app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || "Internal server error" });
  });

  return app;
}

module.exports = { createApp };
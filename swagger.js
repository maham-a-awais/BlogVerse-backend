const { BASE_URL } = require("./config/index");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerJson = require("./swagger.json");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description: "API for managing the Blog application",
    },
    servers: [
      {
        url: BASE_URL,
      },
    ],
  },
  apis: ["./routes/*.js"],
  authAction: {
    Bearer: {
      name: "Bearer",
      schema: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: "Enter your Bearer token",
      },
      value: "", // Replace with a default token or leave empty
    },
  },
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  // Swagger Page
  // app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerJson, {
      cors: false,
      explorer: true,
      url: BASE_URL,
      validatorUrl: null,
    })
  );

  // Documentation in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    // res.send(swaggerSpec);
    res.send(swaggerJson);
  });
}

module.exports = swaggerDocs;

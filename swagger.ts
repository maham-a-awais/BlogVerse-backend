import { config } from "./config";
import swaggerUi from "swagger-ui-express";
import swaggerJson from "./swagger.json";
import { Request, Response, Express } from "express";

const { BASE_URL, CUSTOM_CSS_URL } = config;

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Blog API",
//       version: "1.0.0",
//       description: "API for managing the Blog application",
//     },
//     servers: [
//       {
//         url: BASE_URL,
//       },
//     ],
//   },
//   apis: ["./routes/*.js"],
//   authAction: {
//     Bearer: {
//       name: "Bearer",
//       schema: {
//         type: "apiKey",
//         in: "header",
//         name: "Authorization",
//         description: "Enter your Bearer token",
//       },
//       value: "",
//     },
//   },
// };

export const swaggerDocs = (app: Express): void => {
  // Swagger Page
  // app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerJson, {
      explorer: true,
      swaggerUrl: BASE_URL,
      customCss: CUSTOM_CSS_URL,
    })
  );
  // Documentation in JSON format
  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerJson);
  });
};

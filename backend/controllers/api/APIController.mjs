import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import * as ApiValidator from "express-openapi-validator";
import { APIAuthenticationController } from "./APIAuthenticationController.mjs";
import { APIUserController } from "./APIUserController.mjs";
import { APISessionController } from "./APISessionController.mjs"
import { APIPostsController } from "./APIPostsController.mjs";

const options = {
  failOnErrors: true,
  definition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Highstreet Gym API",   
      description:
        "JSON REST API for interacting with the highstreet gym app backend.",
    },
    components: {
      securitySchemes: {
        ApiKey: {
          type: "apiKey",
          in: "header",
          name: "x-auth-key",
        },
      },
    },
  },
  apis: ["./controllers/**/*.{js,mjs,yaml}", "./components.yaml"],
};
const specification = swaggerJSDoc(options);

export class APIController {
  static routes = express.Router();

  static {
    /**
     * @openapi
     * /api/docs:
     *  get:
     *    summary: "View automatically generated documentation pages"
     *    tags: [Documentation]
     *    responses:
     *      '200':
     *        description: "The documentation page"
     *
     */
    this.routes.use("/docs", swaggerUI.serve, swaggerUI.setup(specification));
    // Set up validator
    this.routes.use(
      ApiValidator.middleware({
        apiSpec: specification,
        validateRequests: true,
        validateResponses: true,
      })
    );
    // Set up error response handling (in JSON format)
    this.routes.use((err, req, res, next) => {
      res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
      });
    });

    // API authentication middleware and routes
    this.routes.use(APIAuthenticationController.middleware);
    this.routes.use(APIAuthenticationController.routes);
    this.routes.use("/user", APIUserController.routes);

    this.routes.use("/sessions", APISessionController.routes);
    this.routes.use("/posts", APIPostsController.routes);

    // TODO: Add the API controllers
  }
}

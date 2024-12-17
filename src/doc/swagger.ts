import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

export const setupSwagger = (app: Application) => {
  // Swagger definition
  const options = {
    definition: {
      openapi: '3.0.0', // Use OpenAPI 3.0 specification
      info: {
        title: 'import POI Data', // API title
        version: '1.0.0', // API version
        description: 'API documentation for the POI import service', // API description
      },
    },
    // Paths to files where your API routes and models are defined
    apis: ['./src/routes/*.ts'], // Adjust path according to your project structure
  };

  // Generate Swagger specification
  const swaggerSpec = swaggerJSDoc(options);

  // Serve Swagger UI at /api-docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

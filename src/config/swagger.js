// src/config/swagger.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node Tree API',
      version: '1.0.0',
      description: 'API para manejar árboles binarios de nodos',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor local',
      },
    ],
    components: {
      schemas: {
        Node: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            title: {
              type: 'string',
              example: 'one'
            },
            parent: {
              type: 'integer',
              nullable: true,
              example: null
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z'
            },
            children_count: {
              type: 'integer',
              example: 2
            }
          }
        }
      }
    }
  },
  apis: ['./src/controllers/*.js'], // Ruta a tus controladores
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
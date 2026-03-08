const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Orders API',
      version: '1.0.0',
      description: 'API de pedidos com CRUD, mapeamento e autenticacao JWT'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        OrderInput: {
          type: 'object',
          required: ['numeroPedido', 'valorTotal', 'items'],
          properties: {
            numeroPedido: { type: 'string', example: 'v10089015vdb-01' },
            valorTotal: { type: 'number', example: 10000 },
            dataCriacao: { type: 'string', format: 'date-time', example: '2023-07-19T12:24:11.5299601+00:00' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['idItem', 'quantidadeItem', 'valorItem'],
                properties: {
                  idItem: { type: 'string', example: '2434' },
                  quantidadeItem: { type: 'integer', example: 1 },
                  valorItem: { type: 'number', example: 1000 }
                }
              }
            }
          }
        },
        OrderResponse: {
          type: 'object',
          properties: {
            numeroPedido: { type: 'string' },
            valorTotal: { type: 'number' },
            dataCriacao: { type: 'string', format: 'date-time' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  idItem: { type: 'string' },
                  quantidadeItem: { type: 'integer' },
                  valorItem: { type: 'number' }
                }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ms-auth API',
            version: '1.0.0',
            description: 'Documentación del microservicio de autenticación',
        },
        servers: [{ url: 'http://localhost:3005/api/v1' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/**/*.routes.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
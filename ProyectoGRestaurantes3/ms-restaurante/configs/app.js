'use strict';
// ms-restaurante/configs/app.js

import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { dbConnection } from './db.js';
import { swaggerSpec } from './swagger.js';
import { initSocket } from './socket.js';
import { corsOptions } from './cors-configuration.js';
import '../src/users/user.model.js';
import '../src/roles/role.model.js';

import { requestLimit } from '../middlewares/request-limit.js';
import { helmetConfiguration } from './helmet-configuration.js';
import { errorHandler, notFound } from '../middlewares/server-genericError-handler.js';

import clientesRoutes from '../src/clientes/clientes.routes.js';
import menuRoutes from '../src/menu/menu.routes.js';
import pedidosRoutes from '../src/pedidos/pedido.routes.js';
import reservacionesRoutes from '../src/reservaciones/reservacion.routes.js';
import eventosRoutes from '../src/eventos/evento.routes.js';
import experienciaRoutes from '../src/experiencia/experiencia.routes.js';
import restauranteRoutes from '../src/restaurante/restaurante.routes.js';
import reportesRoutes from '../src/reportes/reportes.routes.js';
import notificacionesRoutes from '../src/notificaciones/notificaciones.routes.js';
import resenasRoutes from '../src/resenas/resena.routes.js';

const BASE_PATH = '/api/v1';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(cors(corsOptions));
    app.use(helmet(helmetConfiguration));
    app.use(requestLimit);
    app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
};

const routes = (app) => {
    app.use(`${BASE_PATH}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use(`${BASE_PATH}/clientes`, clientesRoutes);
    app.use(`${BASE_PATH}/menu`, menuRoutes);
    app.use(`${BASE_PATH}/pedidos`, pedidosRoutes);
    app.use(`${BASE_PATH}/reservaciones`, reservacionesRoutes);
    app.use(`${BASE_PATH}/eventos`, eventosRoutes);
    app.use(`${BASE_PATH}/experiencia`, experienciaRoutes);
    app.use(`${BASE_PATH}/restaurante`, restauranteRoutes);
    app.use(`${BASE_PATH}/reportes`, reportesRoutes);
    app.use(`${BASE_PATH}/notificaciones`, notificacionesRoutes);
    app.use(`${BASE_PATH}/resenas`, resenasRoutes);

    app.get(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'Healthy',
            timestamp: new Date().toISOString(),
            service: 'ms-restaurante',
        });
    });

    app.use(notFound);
};

export const initServer = async () => {
    const app = express();
    // ← http.createServer para que Socket.io comparta el mismo puerto
    const httpServer = createServer(app);
    const PORT = process.env.PORT;

    app.set('trust proxy', 1);

    try {
        await dbConnection();

        middlewares(app);
        routes(app);
        app.use(errorHandler);

        // Inicializar Socket.io
        initSocket(httpServer, corsOptions);

        // ← httpServer.listen en lugar de app.listen
        httpServer.listen(PORT, () => {
            console.log(`✅ ms-restaurante corriendo en puerto ${PORT}`);
            console.log(`🔌 Socket.io activo en puerto ${PORT}`);
            console.log(`Health: http://localhost:${PORT}${BASE_PATH}/health`);
            console.log(`Docs:   http://localhost:${PORT}${BASE_PATH}/docs`);
        });
    } catch (err) {
        console.error(`❌ Error iniciando ms-restaurante: ${err.message}`);
        process.exit(1);
    }
};
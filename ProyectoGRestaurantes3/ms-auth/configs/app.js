'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { dbConnection } from './db.js';
import { swaggerSpec } from './swagger.js';

// Modelos necesarios para ms-auth
import '../src/users/user.model.js';
import '../src/roles/role.model.js';

import { requestLimit } from '../middlewares/request-limit.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';
import {
  errorHandler,
  notFound,
} from '../middlewares/server-genericError-handler.js';

// Rutas de ms-auth
import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/users/user.routes.js';

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
  // Swagger docs
  app.use(`${BASE_PATH}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(`${BASE_PATH}/auth`, authRoutes);
  app.use(`${BASE_PATH}/users`, userRoutes);

  app.get(`${BASE_PATH}/health`, (req, res) => {
    res.status(200).json({
      status: 'Healthy',
      timestamp: new Date().toISOString(),
      service: 'ms-auth',
    });
  });

  app.use(notFound);
};

export const initServer = async () => {
  const app = express();
  const PORT = process.env.PORT;
  app.set('trust proxy', 1);

  try {
    await dbConnection();

    const { seedRoles } = await import('../helpers/role-seed.js');
    await seedRoles();

    const { ensureAdminUser } = await import('../helpers/admin-seed.js');
    await ensureAdminUser();

    middlewares(app);
    routes(app);

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`✅ ms-auth corriendo en puerto ${PORT}`);
      console.log(`Health: http://localhost:${PORT}${BASE_PATH}/health`);
      console.log(`Auth:   http://localhost:${PORT}${BASE_PATH}/auth`);
      console.log(`Users:  http://localhost:${PORT}${BASE_PATH}/users`);
      console.log(`Docs:   http://localhost:${PORT}${BASE_PATH}/docs`);
    });
  } catch (err) {
    console.error(`❌ Error iniciando ms-auth: ${err.message}`);
    process.exit(1);
  }
};
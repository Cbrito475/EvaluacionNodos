import express from 'express';
import nodeRoutes from './routes/NodeRoutes.js';
import { languageMiddleware } from './middlewares/languageMiddleware.js';
import { timezoneMiddleware } from './middlewares/timezoneMiddleware.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { setupSwagger } from './config/swagger.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(languageMiddleware); // Para manejo de idiomas
app.use(timezoneMiddleware); // Para manejo de zonas horarias
// Rutas
app.use('/api', nodeRoutes);
// Configuración de Swagger
setupSwagger(app);

// Manejo de errores (debe ser el último middleware)
app.use(errorHandler);


// Exportar la aplicación configurada
export default app;
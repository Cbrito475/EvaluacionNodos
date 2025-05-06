import dotenv from 'dotenv';
dotenv.config(); // Esto debe ir PRIMERO

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('No se pudo iniciar la aplicación:', err);
    process.exit(1);
  }
};

startServer();
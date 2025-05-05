import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';


dotenv.config();


const PORT = process.env.PORT || 3000;

// Conectar a DB y luego iniciar servidor
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('No se pudo iniciar la aplicación:', err);
    process.exit(1);
  }
};

startServer();
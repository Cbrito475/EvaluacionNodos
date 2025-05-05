import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

const seedNodes = async () => {
  try {
    // IDs para crear (ejemplo de árbol binario)
    const nodesToCreate = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45, 55, 65, 75, 85];

    // 1. Eliminar todos los nodos existentes (opcional)
    //await axios.delete(`${API_BASE_URL}/nodes/clear-all`); // Necesitarás implementar este endpoint

    // 2. Crear nodos mediante peticiones POST a tu API
    for (const id of nodesToCreate) {
      try {
        const response = await axios.post(`${API_BASE_URL}/nodes`, { id });
        console.log(`✅ Nodo ${id} creado:`, response.data);
      } catch (error) {
        if (error.response?.status === 409) {
          console.log(`ℹ️ Nodo ${id} ya existe, omitiendo...`);
        } else {
          console.error(`❌ Error creando nodo ${id}:`, error.response?.data || error.message);
        }
      }
    }

    console.log('🌱 Seeder completado usando API real');
  } catch (error) {
    console.error('❌ Error fatal:', error.message);
    process.exit(1);
  }
};

seedNodes();
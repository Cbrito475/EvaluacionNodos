# 🌳 Node Tree API

Una API REST para gestionar un árbol binario de nodos con soporte para internacionalización y zonas horarias.

## Estructura del Proyecto

```
src/
├── controllers/    # Lógica de endpoints
├── middlewares/    # Autenticación, validaciones
├── models/         # Modelos de MongoDB
├── routes/         # Definición de rutas
├── scripts/        # Seeders y utilidades
├── utils/          # Helpers y librerías
├── app.js          # Configuración de Express
└── server.js       # Punto de entrada
```

## 🚀 Cómo Ejecutar Localmente

### Requisitos
- Node.js 16+
- MongoDB
- npm o yarn

### Instalación
```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
npm install
```

### Configuración
1. Crea un archivo `.env` basado en `.env.example`
2. Configura tu conexión a MongoDB

### Ejecución
```bash
npm run dev  # Modo desarrollo con nodemon
# o
npm start    # Producción
```

## 🌱 Seeder de Datos

Para poblar la base de datos con nodos de ejemplo:
" Valida estes en la Ruta ./src"
```bash
node seeders/nodeSeeder.js
```

Este script:
1. Elimina todos los nodos existentes
2. Crea una estructura de árbol binario con IDs predefinidos
3. Asigna automáticamente padres según las reglas del árbol

## 📚 Documentación API

Accede a la documentación interactiva en desarrollo:
```
http://localhost:3000/api-docs
```

## 🛠 Endpoints Principales

- `POST /nodes` - Crear nodo
- `POST /nodes/roots` - Listar nodos raíz
- `POST /nodes/children` - Obtener subárbol
- `POST /nodes/delete` - Eliminar nodo

## 🌐 Internacionalización

Envía en los headers:
- `accept-language`: `es` o `en`
- `timezone`: Ej. `America/Mexico_City`

## 🐛 Troubleshooting

Si el seeder falla:
1. Verifica la conexión a MongoDB
2. Ejecuta primero `npm run clear-db` (si está disponible)
3. Asegúrate que no haya procesos usando el puerto 3000

## 📄 Licencia

MIT

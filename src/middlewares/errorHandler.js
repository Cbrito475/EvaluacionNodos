export const errorHandler = (err, req, res, next) => {
    console.error('[Error]', err.stack);
    
    // Errores de validación de Mongoose
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: Object.values(err.errors).map(e => e.message)
      });
    }
    
    // Errores personalizados
    if (err.name === 'AppError') {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message
      });
    }
    
    // Error al eliminar nodo con hijos
    if (err.message.includes('No se puede eliminar un nodo con hijos')) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    
    // Error genérico
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  };
  
  // Clase para errores personalizados
  export class AppError extends Error {
    constructor(message, statusCode = 400) {
      super(message);
      this.name = 'AppError';
      this.statusCode = statusCode;
    }
  }
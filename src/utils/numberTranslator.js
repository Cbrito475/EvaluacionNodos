import writtenNumber from 'written-number';

// Configuración global
writtenNumber.defaults.lang = 'en'; // Idioma por defecto

/**
 * Traduce un número a palabras en el idioma especificado
 * @param {number} number - Número a traducir
 * @param {string} language - Código ISO 639-1 (ej: 'es', 'en')
 * @returns {string} Número traducido a palabras
 */
export const translateNumber = (number, language = 'en') => {
  try {
    // Convertir a número por si viene como string
    const num = typeof number === 'string' ? parseInt(number) : number;
    
    // Validar que sea un número válido
    if (isNaN(num)) return number.toString();
    
    // Traducir el número
    return writtenNumber(num, { 
      lang: language,
      noAnd: true // Opcional: elimina "and" en inglés (ej: "one hundred one" en lugar de "one hundred and one")
    });
  } catch (error) {
    console.error(`Error traduciendo número ${number} a ${language}:`, error);
    return number.toString(); // Fallback seguro
  }
};
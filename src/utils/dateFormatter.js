import { format, toZonedTime } from 'date-fns-tz';

/**
 * Formatea una fecha según la zona horaria especificada
 * @param {Date} date - Fecha a formatear
 * @param {string} timezone - Zona horaria (ej: 'America/Mexico_City')
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, timezone = 'UTC') => {
  try {
    const zonedDate = toZonedTime(date, timezone);
    return format(zonedDate, 'yyyy-MM-dd HH:mm:ss', { timeZone: timezone });
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return date.toISOString();
  }
};
export const timezoneMiddleware = (req, res, next) => {
  // Zonas horarias soportadas (puedes ampliar esta lista)
  const supportedTimezones = [
      'UTC', 
      'America/Mexico_City', 
      'America/New_York',
      'Europe/Madrid'
  ];
  
  const tz = req.headers['timezone'] || 'UTC';
  req.timezone = supportedTimezones.includes(tz) ? tz : 'UTC';
  
  next();
};
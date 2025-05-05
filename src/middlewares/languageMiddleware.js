export const languageMiddleware = (req, res, next) => {
    const supportedLangs = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ar'];
    const acceptLanguage = req.headers['accept-language'] || 'en';
    const languageCode = acceptLanguage.split('-')[0].split(',')[0].toLowerCase();
    req.language = supportedLangs.includes(languageCode) ? languageCode : 'en';
    next();
};
import writtenNumber from 'written-number';

writtenNumber.defaults.lang = 'en';

export const translateNumber = (number, language = 'en') => {
  try {
    const num = typeof number === 'string' ? parseInt(number) : number;
    if (isNaN(num)) return number.toString();
    
    writtenNumber.defaults.lang = language;
    return writtenNumber(num, { noAnd: true });
  } catch (error) {
    console.error(`Error traduciendo número ${number} a ${language}:`, error);
    return number.toString();
  }
};
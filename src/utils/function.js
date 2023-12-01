
export const rounded = (number, length = 3) => {
  return parseFloat(parseFloat(number).toFixed(length));
}

export const genRandonString = (length) => {
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charLength = chars.length;
  var result = '';
  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charLength));
  }
  return result;
}

export function customFormatNumber(number) {
  if(typeof number !='number' || number==NaN){
    return 0;
  }
  // Convertir le nombre en une chaîne de caractères

  let numberString = number.toFixed(2).toString();

  // Remplacer le point par une virgule
  numberString = numberString.replace('.', ',');

  // Ajouter des espaces pour séparer les milliers
  numberString = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return numberString;
}

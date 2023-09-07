export const rounded = (number, length = 3) => {
  return parseFloat(parseFloat(number).toFixed(length));
}
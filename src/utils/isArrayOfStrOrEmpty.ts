export default function isArrayOfStrOrEmpty(array: string[]) {
  if (Array.isArray(array)) {
    return array.every((item) => typeof item === 'string');
  }
  return false;
}

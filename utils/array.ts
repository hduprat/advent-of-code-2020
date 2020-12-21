export const intersect = <T>(...arrays: T[][]): T[] => {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return arrays[0];
  const intersectedArray = arrays[0].filter((elt) => arrays[1].includes(elt));
  if (arrays.length === 2) return intersectedArray;
  return intersect(intersectedArray, ...arrays.slice(2));
};

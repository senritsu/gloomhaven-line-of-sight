export const pick = (array, indices) => indices.map(i => array[i < 0 ? array.length + i : i])

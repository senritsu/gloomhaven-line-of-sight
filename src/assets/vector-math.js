export const sqrt3 = Math.sqrt(3)

export const normalize = ([x, y]) => {
  const length = Math.sqrt(x * x + y * y)
  return [x / length, y / length]
}

export const add = ([x1, y1], [x2, y2]) => [x1 + x2, y1 + y2]
export const subtract = ([x1, y1], [x2, y2]) => [x1 - x2, y1 - y2]
export const multiply = ([x, y], factor) => [factor * x, factor * y]
export const scale = (v, factor) => multiply(normalize(v), factor)

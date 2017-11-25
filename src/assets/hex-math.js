import {sqrt3, subtract} from './vector-math'

export const toOffsetCoords = (coords, {evenOffset = false, flatTop = false}) => {
  if (coords.length === 2) {
    return coords
  }
  const x = coords[0]
  const z = coords[2]
  return flatTop
    ? evenOffset
      ? [x, z + (x + (x & 1)) / 2]
      : [x, z + (x - (x & 1)) / 2]
    : evenOffset
      ? [x + (z + (z & 1)) / 2, z]
      : [x + (z - (z & 1)) / 2, z]
}

// TODO maybe add invert flag to also support bottom-to-top y axis
export const toCartesianCoords = (offsetCoords, {radius, evenOffset = false, flatTop = false}) => {
  const [x, y] = offsetCoords
  const r = radius
  const h = 0.5 * sqrt3 * r
  const even = evenOffset
  return flatTop
    ? [x * 1.5 * r, (y * 2 + ((even ? x + 1 : x) & 1)) * h]
    : [(x * 2 + ((even ? y + 1 : y) & 1)) * h, y * 1.5 * r]
}

export const calculateCorners = (position, {radius, flatTop = false}) => {
  const [x, y] = position
  const r = radius
  const h = 0.5 * sqrt3 * r
  const a = r / 2
  return flatTop
    ? [
      [x - a, y - h],
      [x + a, y - h],
      [x + r, y],
      [x + a, y + h],
      [x - a, y + h],
      [x - r, y]
    ]
    : [
      [x, y - r],
      [x + h, y - a],
      [x + h, y + a],
      [x, y + r],
      [x - h, y + a],
      [x - h, y - a]
    ]
}

export const relativeAngle = (hex, referenceHex, {flatTop = false}) => {
  const v = subtract(hex.position, referenceHex.position)
  const angle = 180 * Math.atan2(-v[1], v[0]) / Math.PI - (flatTop ? 30 : 0)
  return (angle + 360) % 360
}

<template lang="html">
  <g @click="toggle">
    <polygon class="outline" :class="{solid, origin}" :points="corners | points" />
    <template v-if="solid">
      <circle v-for="corner in projectionCorners" :cx="corner[0]" :cy="corner[1]" r="0.03rem" stroke="none" fill="black" />
      <circle :cx="position[0]" :cy="position[1]" r="0.03rem" stroke="none" fill="red" />
      <text :x="position[0]" :y="position[1]" dy="0.05rem" text-anchor="middle" alignment-baseline="central">{{ Math.round(angle) }}</text>
      <text :x="position[0]" :y="position[1]" dy="-0.15rem"text-anchor="middle" alignment-baseline="central">{{ sextant }}</text>
      <polygon class="shadow" :points="shadowPoints | points" />
    </template>
  </g>
</template>

<script>
const sqrt3 = Math.sqrt(3)

const normalize = ([x, y]) => {
  const length = Math.sqrt(x * x + y * y)
  return [x / length, y / length]
}

const add = ([x1, y1], [x2, y2]) => [x1 + x2, y1 + y2]
const subtract = ([x1, y1], [x2, y2]) => [x1 - x2, y1 - y2]

const multiply = ([x, y], factor) => [factor * x, factor * y]

const scale = (v, factor) => multiply(normalize(v), factor)

export default {
  props: {
    coords: Array,
    grid: Object,
    pointShadowSource: Boolean
  },
  data () {
    return {
      solid: false
    }
  },
  computed: {
    origin () {
      return this.coords[0] === 0 && this.coords[1] === 0
    },
    offsetCoords () {
      if (this.coords.length === 2) {
        return this.coords
      }
      const x = this.coords[0]
      const z = this.coords[2]
      return this.grid.flatTop
        ? this.grid.offset === 'even'
          ? [x, z + (x + (x & 1)) / 2]
          : [x, z + (x - (x & 1)) / 2]
        : this.grid.offset === 'even'
          ? [x + (z + (z & 1)) / 2, z]
          : [x + (z - (z & 1)) / 2, z]
    },
    height () { return 0.5 * sqrt3 * this.grid.radius },
    position () {
      const [x, y] = this.offsetCoords
      const r = this.grid.radius
      const h = this.height
      const even = this.grid.offset === 'even'
      return this.grid.flatTop
        ? [x * 1.5 * r, (y * 2 + ((even ? x + 1 : x) & 1)) * h]
        : [(x * 2 + ((even ? y + 1 : y) & 1)) * h, y * 1.5 * r]
    },
    corners () {
      const [x, y] = this.position
      const h = this.height
      const r = this.grid.radius
      const a = r / 2
      return this.grid.flatTop
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
    },
    distance () {
      return Math.sqrt(this.position[0] * this.position[0] + this.position[1] * this.position[1])
    },
    angle () {
      const angle = 180 * Math.atan2(-this.position[1], this.position[0]) / Math.PI - (this.grid.flatTop ? 30 : 0)
      return (angle + 360) % 360
    },
    normalizedAngle () {
      return this.angle % 60
    },
    sextant () {
      return Math.floor(this.angle / 60)
    },
    normalizedProjectionIndices () {
      if (Math.abs(this.normalizedAngle - 30) < 10E-9) {
        return [3, 5]
      }
      else if (this.normalizedAngle > 30) {
        return [2, 5]
      }
      else {
        return [0, 3]
      }
    },
    projectionIndices () {
      return this.normalizedProjectionIndices.map(i => (i - this.sextant + 6) % 6)
    },
    projectionCorners () {
      return this.projectionIndices.map(i => this.corners[i])
    },
    shadowPoints () {
      const scaleOutward = v => scale(v, 100)

      let projected
      if (this.pointShadowSource) {
        projected = this.projectionCorners.map(scaleOutward)
      }
      else {
        const originCorners = this.projectionCorners.map(v => subtract(v, this.position))
        const rays = this.projectionCorners.map((v, i) => subtract(v, originCorners[i])).map(scaleOutward)
        projected = this.projectionCorners.map((v, i) => add(v, rays[i]))
      }

      projected.reverse()
      return [...this.projectionCorners, ...projected]
    }
  },
  filters: {
    points (coords) {
      return coords.map(x => x.join(',')).join(' ')
    }
  },
  methods: {
    toggle () {
      if (this.origin) return

      this.solid = !this.solid
    }
  }
}
</script>

<style lang="scss" scoped>
.outline {
  fill: transparent;
  stroke: black;
  stroke-width: 0.01rem;

  transition: fill 0.25s;

  &:hover {
    fill: #DDD;
  }

  &.solid {
    fill: #777;

    &:hover {
      fill: #999;
    }
  }

  &.origin {
    fill: #a20000;

    &:hover {
      fill: #cd1a1a;
    }
  }
}

.shadow {
  fill: rgba(#000000, 0.2);
  stroke: none;
  pointer-events: none;
}

text {
  font-size: 0.15rem;
  fill: white;
}
</style>

<template lang="html">
  <g :class="{solid: hex.solid, source: hex.source}">
    <polygon class="outline" :points="corners | points" />
    <template v-if="hex.source">
      <circle class="light" v-for="i in 3" :cx="position[0]" :cy="position[1]" :r="`${0.1 * i * i}rem`" :fill="`rgba(255, 230, 0, ${0.5 - i * i * 0.05})`" />
    </template>
    <template v-if="hex.solid">
      <circle v-for="corner in projectionCorners" :cx="corner[0]" :cy="corner[1]" r="0.03rem" stroke="none" fill="black" />
      <circle :cx="position[0]" :cy="position[1]" r="0.03rem" stroke="none" fill="red" />
      <text class="label" :x="position[0]" :y="position[1]" dy="0.05rem" text-anchor="middle" alignment-baseline="central">{{ Math.round(angle) }}</text>
      <text class="label" :x="position[0]" :y="position[1]" dy="-0.15rem"text-anchor="middle" alignment-baseline="central">{{ sextant }}</text>
      <polygon class="shadow" :points="shadowPoints | points" />
    </template>
    <template v-else>
      <text class="label" :x="position[0]" :y="position[1]" dy="-0.075rem" text-anchor="middle" alignment-baseline="central">
        {{ hex.x }}, {{ hex.y }}
      </text>
    </template>
  </g>
</template>

<script>
import {add, subtract, scale} from 'assets/vector-math'
import {toCartesianCoords, toOffsetCoords, calculateCorners} from 'assets/hex-math'

export default {
  props: {
    hex: Object,
    grid: Object,
    pointShadowSource: Boolean
  },
  computed: {
    coords () { return [this.hex.x, this.hex.y] },
    offsetCoords () {
      return toOffsetCoords(this.coords, this.grid)
    },
    position () {
      return toCartesianCoords(this.offsetCoords, this.grid)
    },
    corners () {
      return calculateCorners(this.position, this.grid)
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
}

.solid {
  .label {
    fill: white;
    font-size: 0.15rem;
  }

  .outline {
    fill: #777;

    &:hover {
      fill: #999;
    }
  }
}

.source .outline {
  fill: #a20000;

  &:hover {
    fill: #cd1a1a;
  }
}

.shadow {
  fill: rgba(#000000, 0.2);
  stroke: none;
  pointer-events: none;
}

.light {
  stroke: none;
  pointer-events: none;
}

text {
  fill: lightgray;
  font-size: 0.1rem;
  user-select: none;
}
</style>

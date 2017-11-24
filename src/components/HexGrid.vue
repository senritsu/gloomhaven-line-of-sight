<template lang="html">
  <div class="hex-grid">
    <svg viewBox="-50 -50 100 100" shape-rendering="geometricPrecision">
      <hex v-for="coord in coords" :pointShadowSource="pointShadowSource" :key="`${coord[0]}/${coord[1]}`" :coords="coord" :grid="grid" />
    </svg>
    <button @click="grid.flatTop = !grid.flatTop">{{ grid.flatTop ? 'Flat' : 'Pointy' }}</button>
    <button @click="pointShadowSource = !pointShadowSource">{{ pointShadowSource ? 'Point Shadows' : 'Area Shadows' }}</button>
    <input type="range" min="2" max="5" step="1" v-model.number="grid.radius">
    <input type="range" min="1" max="20" step="1" v-model.number="grid.width">
    <input type="range" min="1" max="20" step="1" v-model.number="grid.height">
  </div>
</template>

<script>
import Hex from './Hex'

export default {
  components: {
    Hex
  },
  data () {
    return {
      grid: {radius: 3, flatTop: false, width: 10, height: 6},
      pointShadowSource: false
    }
  },
  computed: {
    sqrt3 () { return Math.sqrt(3) },
    coords () {
      const xOffset = Math.floor(this.grid.width / 2)
      const yOffset = Math.floor(this.grid.height / 2)
      return this.span(this.range(-xOffset, this.grid.width - xOffset), this.range(-yOffset, this.grid.height - yOffset))
    }
  },
  methods: {
    range (from, to) {
      return new Array(to - from + 1).fill(null).map((x, i) => from + i)
    },
    span (range1, range2) {
      return range1.map(x => range2.map(y => [x, y])).reduce((all, coords) => all.concat(coords), [])
    },
    gridPos ([x, y], {radius, flatTop = false}) {
      const height = 0.5 * this.sqrt3 * radius
      return flatTop
        ? [x * 1.5 * radius, (y * 2 + (x % 2)) * height]
        : [(x * 2 + (y % 2)) * height, y * 1.5 * radius]
    },
    hex ([x, y], {radius, flatTop = false}) {
      const halfRadius = 0.5 * radius
      const height = 0.5 * this.sqrt3 * radius
      return flatTop
        ? [
          [x + halfRadius, y + height],
          [x + radius, y],
          [x + halfRadius, y - height],
          [x - halfRadius, y - height],
          [x - radius, y],
          [x - halfRadius, y + height]
        ]
        : [
          [x, y + radius],
          [x + height, y + halfRadius],
          [x + height, y - halfRadius],
          [x, y - radius],
          [x - height, y - halfRadius],
          [x - height, y + halfRadius]
        ]
    },
    toPoints (coordinates) {
      return coordinates.map(x => x.join(',')).join(' ')
    }
  }
}
</script>

<style lang="scss" scoped>
.hex-grid {
  width: 30%;
  border: 1px solid gray;
}

svg {
  width: 100%;
}
</style>

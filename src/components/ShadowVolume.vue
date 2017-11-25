<template lang="html">
  <g>
    <polygon class="shadow" :points="coords | points" />
  </g>
</template>

<script>
import {add, subtract, normalize, scale} from 'assets/vector-math'
import {pick} from 'assets/array-utils'

export default {
  props: {
    volume: Object
  },
  computed: {
    coords () {
      // relative to source
      const [first, last] = pick(this.volume.points, [0, -1])
      const [firstHex, lastHex] = this.volume.borderHexPositions
      const [firstRayOrigin, lastRayOrigin] = [subtract(first, firstHex), subtract(last, lastHex)]
      const [firstRay, lastRay] = [normalize(subtract(first, firstRayOrigin)), normalize(subtract(last, lastRayOrigin))]
      const coords = this.volume.points.concat([add(last, scale(lastRay, 10)), add(first, scale(firstRay, 10))])
      // transform into absolute coordinates
      return coords.map(v => add(v, this.volume.source))
    }
  },
  filters: {
    points (coords) {
      return coords.map(x => x.join(',')).join(' ')
    }
  }
}
</script>

<style lang="scss" scoped>
.shadow {
  fill: rgba(#000000, 0.2);
  stroke: none;
  pointer-events: none;
}
</style>

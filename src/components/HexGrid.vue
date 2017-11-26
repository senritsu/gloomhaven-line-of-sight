<template lang="html">
  <div class="hex-grid">
    <QList dense>
      <QCollapsible icon="settings" label="Settings" class="settings">
        <QItemSeparator></QItemSeparator>
        <QList no-border>
          <QListHeader>Grid</QListHeader>
          <RangeOption v-model="grid.radius" label="Hex radius" :min="1" :max="5" />
          <RangeOption v-model="grid.width" label="Grid width" :min="1" :max="20" />
          <RangeOption v-model="grid.height" label="Grid height" :min="1" :max="20" />
          <BinaryOption v-model="grid.evenOffset" label="Offset behaviour" :options="['Even', 'Odd']"/>
          <BinaryOption v-model="grid.flatTop" label="Orientation" :options="['Flat top', 'Pointy top']"/>
          <QItemSeparator></QItemSeparator>
          <QListHeader>Shadowcasting</QListHeader>
          <BinaryOption v-model="pointShadowSource" label="Type" :options="['Area light', 'Point light']"/>
        </QList>
      </QCollapsible>
    </QList>
    <br>
    <svg viewBox="-50 -50 100 100" shape-rendering="geometricPrecision">
      <hex v-for="hex in hexes" :pointShadowSource="pointShadowSource" :key="`${hex.x}/${hex.y}`" :hex="hex" :grid="grid" @click.native="hex.solid = !hex.solid" />
    </svg>
  </div>
</template>

<script>
import Hex from './Hex'
import BinaryOption from './BinaryOption'
import RangeOption from './RangeOption'
import {QCollapsible, QList, QListHeader, QItem, QItemMain, QItemSide, QToggle, QSlider, QItemSeparator} from 'quasar'

export default {
  components: {
    QCollapsible,
    QList,
    QListHeader,
    QItem,
    QItemMain,
    QItemSide,
    QToggle,
    QSlider,
    QItemSeparator,
    BinaryOption,
    RangeOption,
    Hex
  },
  data () {
    return {
      grid: {
        radius: 4,
        flatTop: false,
        width: 13,
        height: 15,
        evenOffset: false
      },
      cells: [],
      pointShadowSource: false
    }
  },
  computed: {
    sqrt3 () { return Math.sqrt(3) },
    coords () {
      const xOffset = Math.floor(this.grid.width / 2)
      const yOffset = Math.floor(this.grid.height / 2)
      return this.span(this.range(-xOffset, this.grid.width - xOffset), this.range(-yOffset, this.grid.height - yOffset))
    },
    hexes () {
      return this.cells.reduce((all, column) => all.concat(column), [])
    }
  },
  methods: {
    range (from, to) {
      return new Array(to - from + 1).fill(null).map((x, i) => from + i)
    },
    span (range1, range2) {
      return range1.map(x => range2.map(y => [x, y])).reduce((all, coords) => all.concat(coords), [])
    },
    recalculateGrid () {
      const xOffset = Math.floor(this.grid.width / 2)
      const yOffset = Math.floor(this.grid.height / 2)
      const previousGrid = this.cells.length && this.cells[0].length
      const oldOrigin = previousGrid ? this.cells[0][0] : {}
      const oldMax = previousGrid ? this.cells[this.cells.length - 1][this.cells[this.cells.length - 1].length - 1] : {}

      this.cells = new Array(this.grid.width).fill(null).map((_, x0) => new Array(this.grid.height).fill(null).map((_, y0) => {
        const x = x0 - xOffset
        const y = y0 - yOffset
        const existingCell = x >= oldOrigin.x && x <= oldMax.x && y >= oldOrigin.y && y <= oldMax.y
          ? this.cells[x - oldOrigin.x][y - oldOrigin.y]
          : {}
        // data to keep on redraw
        const {solid} = existingCell
        const defaults = {solid: false}
        const data = Object.assign(defaults, {solid})
        return {
          x,
          y,
          source: x === 0 && y === 0,
          ...data
        }
      }))
    }
  },
  watch: {
    'grid.width': 'recalculateGrid',
    'grid.height': 'recalculateGrid'
  },
  created () {
    this.recalculateGrid()
  }
}
</script>

<style lang="scss" scoped>
.hex-grid {
  padding: 5px;
  width: 100%;
  max-width: 500px;

  // for nested list inside collapsible
  .settings /deep/ .q-collapsible-sub-item {
    padding: 0;
  }

  svg {
    width: 100%;
    border: 1px solid #e0e0e0;
  }
}
</style>

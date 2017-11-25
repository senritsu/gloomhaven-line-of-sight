<template lang="html">
  <QItem link tag="label">
    <QItemMain :label="label">
      <QSlider :value="value" @input="$emit('input', $event)" :min="min" :max="max" :step="1" label />
    </QItemMain>
  </QItem>
</template>

<script>
import {QItem, QItemMain, QSlider} from 'quasar'

export default {
  components: {
    QItem,
    QItemMain,
    QSlider
  },
  props: ['value', 'label', 'min', 'max']
}
</script>

<style lang="scss" scoped>
</style>

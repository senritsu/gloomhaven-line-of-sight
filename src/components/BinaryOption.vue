<template lang="html">
  <QItem link tag="label">
    <QItemMain :label="label" />
    <QItemSide right>
      <QToggle :value="value" @input="$emit('input', $event)" :label="value ? options[0] : options[1]" left-label />
    </QItemSide>
  </QItem>
</template>

<script>
import {QItem, QItemMain, QItemSide, QToggle} from 'quasar'

export default {
  components: {
    QItem,
    QItemMain,
    QItemSide,
    QToggle
  },
  props: ['value', 'label', 'options']
}
</script>

<style lang="scss" scoped>
</style>

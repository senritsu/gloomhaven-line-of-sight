<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <header></header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
/*
 * Root component
 */
export default {}
</script>

<style lang="stylus">
@import '~variables'

main
  margin-top 40px
  display flex
  flex-direction column
  align-items center

header
  margin 0
  height 10px
  background-color $primary
</style>

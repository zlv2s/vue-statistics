<template>
  <div id="app">
    <c-header></c-header>
    <router-view/>
    <c-footer></c-footer>
  </div>
</template>

<script>
import CHeader from '_c/Header'
import CFooter from '_c/Footer'
export default {
  components: {
    CHeader,
    CFooter
  }
}
</script>

<style lang="scss">
.Cookie__button {
  background: color(robin-egg-blue) !important;
  @include hover-active-states() {
    background: darken(color(robin-egg-blue), 10%) !important;
  }
}
</style>

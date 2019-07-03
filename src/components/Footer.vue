<template>
  <footer>
    <span>
      Build with
      <a href="https://vuejs.org/" target="_new">Vue.js</a>,
      <a href="http://vue-chartjs.org/#/" target="_new">vue-chartjs</a>,
      <a href="https://www.chartjs.org/" target="_new">chartjs</a>
    </span>
  </footer>
</template>

<script>
export default {}
</script>

<style lang="scss">
footer {
  background-color: color(fjord);
  color: #fff;
  font-size: rem(16);
  padding: rem(30) rem(40);
  display: flex;
  justify-content: center;
  flex-flow: row nowrap;
  a {
    color: color(robin-egg-blue);
    @include hover-active-states {
      background: darken(color(robin-egg-blue), 20%);
    }
  }
}
</style>
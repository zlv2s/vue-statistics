<template>
  <div class="Header">
    <span class="Header__logo">
      <span class="icon">
        <i class="fa fa-cloud-download"></i>
      </span>
      npm statics
    </span>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.Header {
  padding: 30px;
  display: flex;
  justify-content: center;

  .Header__logo {
    font-size: 40px;
    font-weight: 600;
    color: #4f5566;
    .icon {
      color: #00c4c9;
      margin-right: 10px;
    }
  }
}
</style>
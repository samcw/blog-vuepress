<template>
  <div class="less-container">
    <div class="less-main-left">

    </div>
      <div class="less-main-mid">
        <Content></Content>
      </div>
    <div class="less-main-right">
    </div>
  </div>
</template>

<script>
export default {
  mounted () {

  }
}
</script>

<style scoped>
  .less-container {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  .less-main-left {
    justify-content: center;
  }
  .less-main-mid {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .less-main-right {
    justify-content: center;
  }
  @media screen and (min-width: 800px) {
    .less-main-left {
      display: flex;
      width: 25%;
    }
    .less-main-mid {
      width: 50%;
    }
    .less-main-right {
      display: flex;
      width: 25%;
    }
  }
  @media screen and (max-width: 800px) {
    .less-main-left {
      display: none;
    }
    .less-main-right {
      display: none;
    }
    .less-main-mid {
      padding: 0 15px 0 20px;
    }
  }
</style>

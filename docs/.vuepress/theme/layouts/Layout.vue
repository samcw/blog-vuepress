<template>
  <div class="less-container">
    <div class="less-main-left">
      <div class="less-home-profile">
        <h2>Samcw</h2>
        <p class="less-home-address"><a href="https://github.com/samcw" target="_block">Github Address</a></p>
        <p class="less-home-address"><a href="https://weibo.com/5645270312/profile" target="_block">Weibo Address</a></p>
      </div>
    </div>
    <div class="less-main-mid">
      <Content></Content>
    </div>
    <div class="less-main-right">
      <h2>right</h2>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>
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
  }
  .less-main-right {
    justify-content: center;
  }
  .less-home-profile {
    position: fixed;
    top: 200px;
  }
  .less-home-address {
    margin: 10px 0 10px 0;
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

<template>
  <div class="less-container">
    <div class="less-main-left">
      <div class="less-home-profile">
        <h2>Samcw</h2>
        <p class="less-home-address"><a href="https://github.com/samcw" target="_block" class="less-navbar-item">Github</a></p>
        <p class="less-home-address"><a href="https://weibo.com/5645270312/profile" target="_block" class="less-navbar-item">Weibo</a></p>
      </div>
      <div ref="leftMenu" style="transition: opacity 1s" class="less-home-left">
        <p v-for="(item, key) in $themeConfig.nav" :key="key"><a :href="item.link" class="less-navbar-item">{{item.text}}</a></p>
      </div>
    </div>
    <div class="less-main-mid">
      <Content></Content>
    </div>
    <div class="less-main-right">
      <!-- <h2>right</h2> -->
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        toTopHeight: 0
      }
    },
    watch: {
      toTopHeight: function (newVal, oldVal) {
        if (newVal >= 55)
          this.$refs.leftMenu.className = 'less-home-left-show';
        else
          this.$refs.leftMenu.className = 'less-home-left-hide';
      }
    },
    methods: {
      handleScroll: function () {
        this.toTopHeight = document.documentElement.scrollTop | document.body.scrollTop;
      }
    },
    mounted () {
      window.addEventListener('scroll', this.handleScroll);
    },
    destroyed () {
      window.removeEventListener('scroll', this.handleScroll);
    }
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
  .less-home-profile a {
    color: #2f3d4a;
  }
  .less-home-profile h2 {
    padding-left: 10px;
  }
  .less-home-left-hide {
    position: fixed;
    top: 350px;
    width: 90px;
    pointer-events: none;
    opacity: 0;
  }
  .less-home-left-show {
    position: fixed;
    top: 350px;
    width: 90px;
    pointer-events: auto;
    opacity: 1;
  }
  .less-home-left {
    position: fixed;
    top: 350px;
    width: 90px;
    opacity: 0;
  }
  /* .less-home-left a {
    color: #2f3d4a;
    transition: border 0.5s;
    border-bottom: 1px transparent solid;
  }
  .less-home-left a:hover {
    border-bottom: 2px #005cc5 solid;
  } */
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

<template>
  <div id="less-container">
    <div class="less-navbar">
      <strong class="less-title">{{$site.title}}</strong>
      <div class="less-navbar-right">
        <a :href="item.link"
        v-for="(item, key) in $themeConfig.nav"
        class="less-navbar-item"
        :key="key"
        v-if="navBarShow">{{item.text}}</a>
        <SearchBox></SearchBox>
      </div>
    </div>
    <div class="less-main">
      <transition name="fade">
        <component :is="layout"/>
      </transition>
    </div>
    <!-- <div class="less-footer">
      <span class="less-footer-content">@Samcw</span>
    </div> -->
  </div>
</template>

<script>
import SearchBox from '@SearchBox'
export default {
  data () {
    return {
      navBarShow: true
    }
  },
  components: {
    SearchBox
  },
  computed: {
    layout () {
      if (this.$page.path) {
        if (this.$frontmatter.layout) {
          // 你也可以像默认的 globalLayout 一样首先检测 layout 是否存在
          return this.$frontmatter.layout
        }
        return 'Layout'
      }
      return 'NotFound'
    }
  },
  methods: {
    handleInputFocus () {
      let width = document.documentElement.clientWidth | document.body.clientWidth;
      if (width < 960)
        this.navBarShow = false;
    },
    handleInputBlur () {
      setTimeout(function () {
        this.navBarShow = true
      }.bind(this), 300);
    }
  },
  mounted () {
    let input = document.getElementsByClassName('search-box')[0].children[0];
    input.onfocus = this.handleInputFocus;
    input.onblur = this.handleInputBlur;
  }
}
</script>

<style>
  a {
    text-decoration: none;
    color: inherit;
  }
  .less-container {
    margin-bottom: 10px;
    word-break: break-all;
  }
  .less-navbar {
    clear: both;
    border-bottom: 1px #f3f5f4 solid;
    padding: 10px 5px 10px 5px;
  }
  .less-title {
    font-size: 20px;
    margin-left: 10px;
    line-height: 34px;
  }
  .less-navbar-right {
    display: inline-block;
    float: right;
    line-height: 34px;
  }
  .less-navbar-item {
    color: #2f3d4a !important;
    font-size: 14px;
    transition: border 0.5s;
    border-bottom: 2px transparent solid;
  }
  .less-navbar-item:hover {
    border-bottom: 2px #005cc5 solid;
  }
  .less-footer {
    display: flex;
    justify-content: center;
    border-top: 1px #f3f5f4 solid;
    margin-top: 10px;
  }
  .less-footer-content {
    color: #8e8e8e;
    font-size: 10px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s ease;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-to {
    opacity: 1;
  }
  .content__default img {
    max-width: 95%;
  }
  @media screen and (max-width: 500px) {
    .search-box input {
      position: initial;
    }
    .less-navbar-item {
      padding: 2px 0 2px 0;
      margin: 0 5px 0 5px;
    }
  }
  @media screen and (min-width: 500px){
    .less-navbar-item {
      padding: 2px 0 2px 0;
      margin: 0 10px 0 10px;
    }
    .less-main {
      display: flex;
    }
  }
</style>

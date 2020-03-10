<template>
  <div id="less-container">
    <div class="less-navbar">
      <strong class="less-title">{{$site.title}}</strong>
      <div class="less-navbar-right">
        <a :href="item.link"
        v-for="(item, key) in $themeConfig.nav"
        class="less-navbar-item">{{item.text}}</a>
        <SearchBox></SearchBox>
      </div>
    </div>
    <div class="less-main">
      <component :is="layout"/>
    </div>
    <div></div>
  </div>
</template>

<script>
import SearchBox from '@SearchBox'
export default {
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
  }
}
</script>

<style lang="stylus">
  a {
    text-decoration: none;
    color: inherit;
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
    border-bottom: 1px transparent solid;
  }
  .less-navbar-item:hover {
    border-bottom: 2px #005cc5 solid;
  }
  .less-main {
    display: flex;
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
  }
</style>

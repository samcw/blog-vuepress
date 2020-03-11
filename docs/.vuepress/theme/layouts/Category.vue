<template>
  <div class="less-category-home">
    <div class="less-category-main">
      <div class="less-category-list" v-for="(item, key) in list" :key="key">
        <a :href="item.path">{{item.name}}</a>
        <span>{{item.pages.length}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        list: ''
      }
    },
    created () {
      this.list = this.$category.list;
    }
  }
</script>

<style>
  .less-category-home {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  .less-category-main {
    margin-top: 50px;
  }
  .less-category-list {
    margin: 30px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px #f3f5f4 solid;
  }
  .less-category-list a {
    color: #2f3d4a;
  }
  @media screen and (max-width: 800px) {
    .less-category-main {
      width: 70%;
    }
  }
  @media screen and (min-width: 800px){
    .less-category-main {
      width: 30%;
    }
  }
</style>

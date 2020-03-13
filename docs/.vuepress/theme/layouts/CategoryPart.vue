<template>
  <div class="less-container">
    <div class="less-main-left">
      <div class="less-category-profile">
        <p v-for="(item, key) in list"><a :href="item.path" class="less-navbar-item" :ref="item.name">{{item.name}}</a></p>
      </div>
    </div>
    <div class="less-main-mid">
      <div class="less-midBar-isShow"><p v-for="(item, key) in list"><a :href="item.path" class="less-navbar-item" :ref="item.name + 'top'">{{item.name}}</a></p></div>
      <Item v-for="(item, key) in categoryList" :key="key" :item="item"></Item>
      <div class="less-pagination">
        <router-link v-if="$pagination.hasPrev" :to="$pagination.prevLink">Prev</router-link>
        <router-link v-if="$pagination.hasNext" :to="$pagination.nextLink">Next</router-link>
      </div>
    </div>
    <div class="less-main-right">

    </div>
  </div>
</template>

<script>
import Item from '../components/Item';

export default {
  data () {
    return {
      list: [],
      categoryName: '',
      categoryList: ''
    }
  },
  components: {
    Item
  },
  created () {
    //获得当前分类名
    this.categoryName =  this.$route.meta.id;
    //获得分类列表
    this.list = this.$category.list;
    //获得当前分类文章列表
    this.categoryList = this.$pagination.pages;
    // console.log(this.categoryList);
  },
  mounted () {
    this.$refs[this.categoryName][0].className = 'less-category-left-active less-navbar-item';
    this.$refs[this.categoryName + 'top'][0].className = 'less-category-left-active less-navbar-item';
  },
  watch: {
    $route: function () {
      this.categoryName =  this.$route.meta.id;
      this.list = this.$category.list;
      this.categoryList = this.$pagination.pages;
    }
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
    flex-direction: column;
  }
  .less-main-right {
    justify-content: center;
  }
  .less-category-profile {
    position: fixed;
    top: 200px;
  }
  .less-category-left-active {
    border-bottom: 2px #005cc5 solid;
  }
  .less-pagination {
    margin-top: 20px;
    margin-bottom: 10px;
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
    .less-midBar-isShow {
      display: none;
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
    .less-midBar-isShow {
      display: flex;
    }
  }
</style>

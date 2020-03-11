<template>
  <div>
    <h2><a :href="item.path" class="less-category-item">{{items.title}}</a></h2>
    <div class="less-category-item-content">{{items.description}}</div>
    <div class="less-category-item-bottom"><span class="less-category-tag">{{items.category}}</span><span class="less-category-time">{{items.time.slice(0, 10)}}</span></div>
  </div>
</template>

<script>
export default {
  props: {
    item: {}
  },
  computed: {
    items: function () {
      return this.item.frontmatter;
    }
  }
}
</script>

<style>
  .less-category-item {
    color: #2f3d4a;
    font-size: 20px;
  }
  .less-category-item-bottom {
    margin: 20px 0 15px 0;
  }
  .less-category-tag {
    color: #005cc5;
    border: 1px #005cc5 solid;
    border-radius: 5px;
    padding: 1px 4px 1px 4px;
    margin-right: 20px;
    font-size: 14px;
  }
  .less-category-item-content {
    font-size: 14px;
    line-height: 22px;
  }
  .less-category-time {
    font-size: 14px;
  }
</style>

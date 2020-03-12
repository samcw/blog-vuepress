<template>
  <div class="less-container">
    <div class="less-main-left">
      <div style="transition: opacity 1s" class="less-home-left" ref="articleLeft">
        <p class="less-category-time">{{article.date.slice(0, 10)}}</p>
        <span class="less-category-tag">{{article.category}}</span>
      </div>
    </div>
      <div class="less-main-mid">
        <div class="less-article-top">
          <span class="less-category-tag">{{article.category}}</span><span class="less-category-time">{{article.date.slice(0, 10)}}</span>
        </div>
        <Content></Content>
      </div>
    <div class="less-main-right">
    </div>
  </div>
</template>

<script>
import Transition from '../components/Transition'
export default {
  data () {
    return {
      toTopHeight: 0,
    }
  },
  components: {
    Transition
  },
  computed: {
    article: function () {
      return this.$page.frontmatter;
    }
  },
  watch: {
    toTopHeight: function (newVal, oldVal) {
      if (newVal >= 55)
        this.$refs.articleLeft.className = 'less-home-left-show';
      else
        this.$refs.articleLeft.className = 'less-home-left-hide';
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
  },
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
  .less-category-time {
    font-size: 14px;
  }
  .less-category-tag {
    color: #005cc5;
    border: 1px #005cc5 solid;
    border-radius: 5px;
    padding: 1px 4px 1px 4px;
    margin-right: 20px;
    font-size: 14px;
  }
  .less-article-top {
    margin-top: 20px;
  }
  .less-home-left-hide {
    position: fixed;
    top: 250px;
    width: 90px;
    pointer-events: none;
    opacity: 0;
  }
  .less-home-left-show {
    position: fixed;
    top: 250px;
    width: 90px;
    pointer-events: auto;
    opacity: 1;
  }
  .less-home-left {
    position: fixed;
    top: 250px;
    width: 90px;
    opacity: 0;
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

module.exports = {
  title: 'HISTO',
  description: 'Samcw Personal blog powered by VuePress',
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      { text: '分类', link: '/category' },
      { text: '关于', link: '/about' }
    ]
  },
  plugins: {
    '@vuepress/back-to-top': {},
    // '@vuepress/active-header-links': {
    //   sidebarLinkSelector: '.sidebar-link',
    //   headerAnchorSelector: '.header-anchor'
    // },
    // '@vuepress/blog': {},
    // '@vuepress/nprogress': {},
    // 'vuepress-plugin-container': {
    //   type: 'tip',
    //   defaultTitle: {
    //     '/': 'TIP',
    //     '/zh/': '提示',
    //   },
    // },
  },
}

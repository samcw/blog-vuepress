module.exports = {
  // extend: '@vuepress/theme-default'
  plugins: {
    '@vuepress/search': {
      searchMaxSuggestions: 10
    },
    '@vuepress/back-to-top': {},
    // '@vuepress/active-header-links': {
    //   sidebarLinkSelector: '.sidebar-link',
    //   headerAnchorSelector: '.header-anchor'
    // },
    '@vuepress/blog': {
      frontmatters: [
        {
          id: 'category',
          keys: ['category'],
          path: '/category/',
          layout: 'Category',
          scopeLayout: 'CategoryPart',
          pagination: {
            lengthPerPage: 7,
            layout: 'CategoryPart'
          }
        }
      ],
      directories: [
        {
          id: 'article',
          dirname: 'article',
          path: '/',
          layout: 'Layout',
          itemLayout: 'Article',
          pagination: {
            lengthPerPage: 5,
            layout: 'Layout'
          }
        }
      ],
      sitemap: {
        hostname: 'https://samchow.cn'
      },
    },
    // '@vuepress/nprogress': {},
    'vuepress-plugin-container': {
      type: 'tip',
      defaultTitle: {
        '/': 'TIP',
        '/zh/': '提示',
      },
    },
  },
}

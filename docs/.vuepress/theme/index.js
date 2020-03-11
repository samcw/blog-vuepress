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
            lengthPerPage: 1,
          },
        }
      ]
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

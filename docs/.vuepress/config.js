module.exports = {
  title: 'SAMCW BLOG',
  description: 'Samcw Personal blog powered by VuePress',
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      { text: '分类', link: '/category' },
      { text: '关于', link: '/about/index.html' }
    ]
  },
  plugins: {

  },
  head: [
    ['link', { rel: 'icon', href: '/avatar.png' }]
  ],
  markdown: {
    extendMarkdown: md => {
      // 使用更多的 markdown-it 插件!
      md.use(require('markdown-it-katex'))
    }
  }
}

const markdownPath = 'ref/STARRED_REPOS.md'
const converter = new showdown.Converter({
  tables: true,
  ghCompatibleHeaderId: true,
  openLinksInNewWindow: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
})

new Vue({
  el: '#app',
  template: '#main',
  vuetify: new Vuetify(),
  data () {
    return {
      error: '',
      isLoading: true,
      renderedMarkdown: '',
    }
  },
  methods: {
    async loadMarkdown () {
      try {
        const response = await fetch(markdownPath, {
          cache: 'no-store',
          headers: {
            Accept: 'text/markdown, text/plain;q=0.9, */*;q=0.8',
          },
        })

        if (!response.ok) {
          throw new Error(`Unable to load ${markdownPath} (${response.status})`)
        }

        const markdown = await response.text()
        this.renderedMarkdown = converter.makeHtml(markdown)
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },
  },
  mounted () {
    this.loadMarkdown()
  },
})

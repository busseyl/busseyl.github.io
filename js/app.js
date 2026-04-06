const dataPath = 'ref/repos-data.json'

new Vue({
  el: '#app',
  template: '#main',
  vuetify: new Vuetify(),

  data () {
    return {
      isLoading:      true,
      error:          '',
      reposData:      null,
      selectedTopics: [],
      searchQuery:    '',
      filterExpanded: true,
    }
  },

  computed: {
    snapshotDate () {
      return this.reposData ? this.reposData.snapshot_date : ''
    },

    totalRepos () {
      return this.reposData ? this.reposData.total_repos : 0
    },

    /** { topicName: count } across all repos */
    topicCounts () {
      if (!this.reposData) return {}
      const counts = {}
      for (const cat of this.reposData.categories) {
        for (const repo of cat.repos) {
          for (const t of repo.topics) {
            counts[t] = (counts[t] || 0) + 1
          }
        }
      }
      return counts
    },

    /** Sorted by count desc, shape: [{ name, count }] */
    sortedTopics () {
      return Object.entries(this.topicCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count }))
    },

    filteredCategories () {
      if (!this.reposData) return []
      const query = this.searchQuery ? this.searchQuery.trim().toLowerCase() : ''

      return this.reposData.categories
        .map(cat => {
          let repos = cat.repos

          // Topic filter (AND logic: repo must have ALL selected topics)
          if (this.selectedTopics.length) {
            repos = repos.filter(r =>
              this.selectedTopics.every(t => r.topics.includes(t))
            )
          }

          // Full-text search on name + description
          if (query) {
            repos = repos.filter(r =>
              r.full_name.toLowerCase().includes(query) ||
              (r.description || '').toLowerCase().includes(query)
            )
          }

          return { ...cat, repos }
        })
        .filter(cat => cat.repos.length > 0)
    },

    totalFiltered () {
      return this.filteredCategories.reduce((s, c) => s + c.repos.length, 0)
    },
  },

  methods: {
    async loadData () {
      try {
        const res = await fetch(dataPath, { cache: 'no-store' })
        if (!res.ok) throw new Error(`Unable to load data (${res.status})`)
        this.reposData = await res.json()
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },

    isSelected (topic) {
      return this.selectedTopics.includes(topic)
    },

    toggleTopic (topic) {
      const idx = this.selectedTopics.indexOf(topic)
      if (idx === -1) {
        this.selectedTopics.push(topic)
      } else {
        this.selectedTopics.splice(idx, 1)
      }
    },

    clearTopics () {
      this.selectedTopics = []
    },

    clearAll () {
      this.selectedTopics = []
      this.searchQuery    = ''
    },

    formatNum (n) {
      if (!n) return 'n/a'
      return n.toLocaleString()
    },
  },

  mounted () {
    this.loadData()
  },
})

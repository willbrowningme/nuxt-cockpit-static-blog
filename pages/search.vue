<template>
  <section class="my-8">
    <div class="text-center">
      <h2 class="mb-6">Search Page</h2>
      <p class="mb-4">
        This is a live search example using Algolia and Cockpit!
      </p>
      <a href="https://www.algolia.com" target="_blank" rel="nofollow noreferrer noopener">
        <img src="search-by-algolia-light-background.png" class="inline-block h-6">
      </a>

      <div class="my-8">

        <input type="text" name="searchTerm" v-model="searchTerm" placeholder="Search Posts..." class="text-center block mt-2 bg-gray-200 rounded w-full py-2 px-3">

        <div v-if="results.length !==0" class="search-results">
          <a v-for='result in results' :key="result.title_slug" :href="'/'+result.title_slug" class="block text-gray-800 p-3 text-left">
            <span v-html="result._highlightResult.title.value" class="block font-bold mb-1"></span>
            <span v-html="result._snippetResult.excerpt.value"></span>
          </a>
        </div>

        <div v-else-if="searchTerm.length >= 3">
          <span class="block text-gray-800 p-3 text-left">
            No results found
          </span>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  data: function () {
    return {
      searchTerm: '',
      results:[]
    }
  },

  watch: {
    searchTerm: 'search'
  },

  methods: {
    search() {
      if(this.searchTerm.length < 3){
        return this.results = []
      }

      axios.get(process.env.searchUrl+this.searchTerm)
      .then(response => {
        this.results = response.data.hits
      })
    }
  }
}
</script>
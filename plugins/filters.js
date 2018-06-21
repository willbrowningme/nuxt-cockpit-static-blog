import Vue from 'vue'
import highlightjs from 'highlight.js'
import marked, { Renderer } from 'marked'
const moment = require('moment')


// Create your custom renderer.
const renderer = new Renderer()
renderer.code = (code, language) => {
  // Check whether the given language is valid for highlight.js.
  const validLang = !!(language && highlightjs.getLanguage(language))
  // Highlight only if the language is valid.
  const highlighted = validLang ? highlightjs.highlight(language, code).value : code
  // Render the highlighted code with `hljs` class.
  return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`
};

// Set the renderer to marked.
marked.setOptions({ renderer })

Vue.filter('parseMd', function(content) {
    return marked(content)
})

Vue.filter('toDate', function(timestamp) {
  return moment(timestamp*1000).format('Do MMM YY')
})
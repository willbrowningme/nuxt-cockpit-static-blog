import Vue from 'vue'
import highlightjs from 'highlight.js'
import marked, { Renderer } from 'marked'
const dayjs = require('dayjs')
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)

// Only import the languages that you need to keep our js bundle small
highlightjs.registerLanguage('php', require('highlight.js/lib/languages/php'))
highlightjs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
highlightjs.registerLanguage('css', require('highlight.js/lib/languages/css'))

// Create your custom renderer.
const renderer = new Renderer()
renderer.code = (code, language) => {
  // Check whether the given language is valid for highlight.js.
  const validLang = !!(language && highlightjs.getLanguage(language))
  // Highlight only if the language is valid.
  const highlighted = validLang ? highlightjs.highlight(language, code).value : code
  // Render the highlighted code with `hljs` class.
  return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`
}

// Set the renderer to marked.
marked.setOptions({ renderer })

Vue.filter('parseMd', function(content) {
    return marked(content)
})

Vue.filter('toDate', function(timestamp) {
  return dayjs(timestamp*1000).format('Do MMM YY')
})
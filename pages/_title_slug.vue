<template>
  <section>
    <article class="my-8">
      <div class="text-grey-dark font-bold text-sm tracking-wide">
        {{ post._created | toDate }} |
        <a v-for="(tag, key) in post.tags" :key="key" :href="'/category/'+tag" class="ml-1 no-underline">{{ tag }}</a>
      </div>
      <h1 class="mt-2">
        {{ post.title }}
      </h1>
      <div class="mt-4" v-html="$options.filters.parseMd(post.excerpt + '\n' + post.content)">
      </div>
    </article>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  async asyncData ({ params, error, payload }) {
    if (payload) {
      return { post: payload }
    } else {
      let { data } = await axios.post(process.env.POSTS_URL, 
      JSON.stringify({
          filter: { published: true, title_slug: params.title_slug },
          sort: {_created:-1},
          populate: 1
        }),  
      {
        headers: { 'Content-Type': 'application/json' }
      })

      if (!data.entries[0]) {
        return error({ message: '404 Page not found', statusCode: 404 })
      }

      return { post: data.entries[0] }
    }
  },
  head () {
    return {
    title: this.post.title,
      meta: [
       { hid: 'description', name: 'description', content: this.post.excerpt },
      ]
    }
  }
}
</script>

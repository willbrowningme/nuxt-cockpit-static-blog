<template>
  <section>
    <div class=my-8>
      <h1 class="mb-6">Blog Page {{ page }}</h1>
      <ul class="flex flex-col w-full p-0">
        <li class="mb-6 w-full list-reset" v-for="(post, key) in posts" :key="key">
          <div class="text-grey-dark font-bold text-sm tracking-wide">
            {{ post._created | toDate }}
            <a v-for="(tag, key) in post.tags" :key="key" :href="'/category/'+tag" class="ml-1 no-underline">{{ tag }}</a>
          </div>

          <a :href="'/'+post.title_slug" class="no-underline">
            <h2 class="my-2 text-grey-darkest text-lg lg:text-xl">
              {{ post.title }}
            </h2>
          </a>

          <div class="page-content hidden md:block text-base mb-2" v-html="post.excerpt">
          </div>
          <a class="text-sm text-blue-light no-underline" :href="'/'+post.title_slug">
            Read more
          </a>
        </li>
      </ul>
      <div class="flex justify-center mt-8">
        <a :href="page === '2' ? '/' : `/blog/${Number(page)-1}`" class="text-sm no-underline pr-2">
          Previous Page
        </a>
        <a v-if="hasNext" :href="`/blog/${Number(page)+1}`" class="text-sm no-underline pl-2">
          Next Page
        </a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  async asyncData ({ app, params, error, payload }) {
    if (payload) {
      return { posts: payload.posts, page: params.page, hasNext: payload.hasNext }
    } else {
      let { data } = await app.$axios.post(process.env.POSTS_URL,
      JSON.stringify({
          filter: { published: true },
          limit: process.env.PER_PAGE,
          skip: (params.page-1)*process.env.PER_PAGE,
          sort: {_created:-1},
          populate: 1
        }),
      {
        headers: { 'Content-Type': 'application/json' }
      })

      if (!data.entries[0]) {
        return error({ message: '404 Page not found', statusCode: 404 })
      }

      return { posts: data.entries, page: params.page, hasNext: Number((params.page-1)*process.env.PER_PAGE) + Number(process.env.PER_PAGE) < data.total }
    }
  },
  head () {
    return {
      title: `Nuxt Cockpit Static Blog - Page ${this.page}`
    }
  }
}
</script>
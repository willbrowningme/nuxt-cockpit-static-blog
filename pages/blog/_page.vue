<template>
  <section>
    <div class=my-8>
      <h2 class="mb-6">Blog Page {{ page }}</h2>
      <ul class="flex flex-col w-full p-0">
        <li class="mb-6 w-full list-reset" v-for="(post, key) in posts" :key="key">
          <div class="text-grey-dark font-bold text-sm tracking-wide">
            {{ post._created | toDate }}
            <span class="ml-1 text-xs">•</span>
            <a v-for="tag in post.tags" :key="tag" :href="'/category/'+tag" class="ml-1">#{{ tag }}</a>
            <span class="mx-1 text-xs">•</span>
            <span>
              {{ post.comments ? post.comments.length : 0 }}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="12" height="12" preserveAspectRatio="xMinYMin" class="text-grey-dark fill-current">
                <path d="M3 .565h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-6.958l-6.444 4.808A1 1 0 0 1 2 18.57v-4.006a2 2 0 0 1-2-2v-9a3 3 0 0 1 3-3z"></path>
              </svg>
            </span>
          </div>

          <a :href="'/'+post.title_slug" class="no-underline">
            <h2 class="my-2 text-grey-darkest text-lg lg:text-xl">
              {{ post.title }}
            </h2>
          </a>

          <div class="page-content hidden md:block text-base mb-2" v-html="post.excerpt">
          </div>
          <a class="text-sm" :href="'/'+post.title_slug">
            Read more
          </a>
        </li>
      </ul>
      <div class="flex justify-center mt-8">
        <a :href="page === '2' ? '/' : `/blog/${Number(page)-1}`" class="text-sm pr-2">
          Previous Page
        </a>
        <a v-if="hasNext" :href="`/blog/${Number(page)+1}`" class="text-sm pl-2">
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

      if (!data.entries) {
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
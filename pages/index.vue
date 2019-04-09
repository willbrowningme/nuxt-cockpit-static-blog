<template>
  <section>
    <div class=my-8>
      <ul class="flex flex-col w-full p-0">
        <li class="mb-6 w-full list-reset" v-for="(post, key) in posts" :key="key">
          <div class="text-grey-dark font-bold text-sm tracking-wide">
            {{ post._created | toDate }}
            <span class="ml-1 text-xs">•</span>
            <a v-for="tag in post.tags" :key="tag" :href="'/category/'+tag" class="text-blue-light ml-1 no-underline">#{{ tag }}</a>
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
          <a class="text-sm text-blue-light no-underline" :href="'/'+post.title_slug">
            Read more
          </a>
        </li>
      </ul>
      <div v-if="hasNext" class="flex justify-center mt-8">
        <a href="/blog/2" class="text-sm no-underline text-blue-light">
          Next Page
        </a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  async asyncData ({ app, error }) {
    const { data } = await app.$axios.post(process.env.POSTS_URL,
    JSON.stringify({
        filter: { published: true },
        limit: process.env.PER_PAGE,
        sort: {_created:-1},
        populate: 1
      }),
    {
      headers: { 'Content-Type': 'application/json' }
    })

    if (!data.entries) {
      return error({ message: '404 Page not found', statusCode: 404 })
    }

    return { posts: data.entries, hasNext: process.env.PER_PAGE < data.total }
  }
}
</script>
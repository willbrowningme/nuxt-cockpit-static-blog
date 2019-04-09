<template>
  <section>
    <article class="my-8">
      <div class="text-grey-dark font-bold text-sm tracking-wide">
        {{ post._created | toDate }}
        <span class="ml-1 text-xs">•</span>
        <a v-for="tag in post.tags" :key="tag" :href="'/category/'+tag" class="ml-1 no-underline">#{{ tag }}</a>
        <span class="mx-1 text-xs">•</span>
        <a href="#comments" class="no-underline text-grey-dark">
          {{ post.comments ? post.comments.length : 0 }}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="12" height="12" preserveAspectRatio="xMinYMin" class="text-grey-dark fill-current">
            <path d="M3 .565h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-6.958l-6.444 4.808A1 1 0 0 1 2 18.57v-4.006a2 2 0 0 1-2-2v-9a3 3 0 0 1 3-3z"></path>
          </svg>
        </a>
      </div>
      <h1 class="mt-2">
        {{ post.title }}
      </h1>
      <div class="mt-4 markdown" v-html="$options.filters.parseMd(post.excerpt + '\n' + post.content)">
      </div>

      <div id="comments" class="mt-8 mb-4 pt-3 border-t-2">
        <h2 class="mb-2">
          Comments
        </h2>
        <comment-form class="border-b-2" :post_id="post._id"/>
      </div>

      <ul class="list-reset">
        <comment
        v-for="comment in comments"
        :key="comment._id"
        :post_id="post._id"
        :all="post.comments"
        :comment="comment"
        />
      </ul>
    </article>
  </section>
</template>

<script>
import CommentForm from '~/components/CommentForm.vue'
import Comment from '~/components/Comment.vue'

export default {
  async asyncData ({ app, params, error, payload }) {
    if (payload) {
      return { post: payload }
    } else {
      let { data } = await app.$axios.post(process.env.POSTS_URL,
      JSON.stringify({
          filter: { published: true, title_slug: params.title_slug },
          sort: {_created:-1},
          populate: 1
        }),
      {
        headers: { 'Content-Type': 'application/json' }
      })

      if (!data.entries) {
        return error({ message: '404 Page not found', statusCode: 404 })
      }

      return { post: data.entries[0] }
    }
  },

  components: {
    CommentForm,
    Comment
  },

  head () {
    return {
      title: this.post.title,
      meta: [
        { hid: 'description', name: 'description', content: this.post.excerpt },
      ]
    }
  },

  computed: {
    comments: function () {
      return this.post.comments ? this.post.comments.filter(comment => !comment.parent_id) : []
    }
  }
}
</script>
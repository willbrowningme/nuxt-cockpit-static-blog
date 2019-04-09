<template>
  <li class="mb-4" :class="!parent ? 'border-b-2' : ''">
    <div ref="parent">
      <div class="text-grey-dark text-sm mb-2">
        <span class="text-grey-darkest font-semibold">
          {{comment.name}}
        </span>
        <span class="mx-1 text-xs">•</span>
        {{ comment._created | toDate }}
        <span v-if="parent">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 24 24" width="12" height="12" preserveAspectRatio="xMinYMin" class="text-grey-dark fill-current">
            <path d="M10.586 5.657l-3.95-3.95A1 1 0 0 1 8.05.293l5.657 5.657a.997.997 0 0 1 0 1.414L8.05 13.021a1 1 0 1 1-1.414-1.414l3.95-3.95H1a1 1 0 1 1 0-2h9.586z"></path>
          </svg>
          {{ parent.name }}
        </span>
      </div>

      <div class="comment text-grey-darkest text-base" v-html="$options.filters.parseMd(comment.body)"></div>

      <div class="text-grey-dark text-sm mt-2 mb-4 cursor-pointer" @click="toggleReply">
        <span v-if="replyOpen">Cancel</span>
        <span v-else>Reply</span>
      </div>
    </div>

    <ul class="ml-10 list-reset comment-list" v-if="children(comment._id).length">
      <comment
      v-for="child in children(comment._id)"
      :key="child._id"
      :post_id="post_id"
      :all="all"
      :comment="child"
      :parent="comment"
      />
    </ul>
  </li>
</template>

<script>
import Vue from 'vue'
import CommentForm from '~/components/CommentForm.vue'

export default {
  name: "comment",
  props: {
    post_id: String,
    all: Array,
    comment: Object,
    parent: Object
  },

  data: function () {
    return {
      replyOpen: false
    }
  },

  methods: {
    children: function (parent_id) {
      return this.all.filter(comment => comment.parent_id === parent_id)
    },

    toggleReply: function () {
      if(!this.replyOpen){
        let ComponentClass = Vue.extend(CommentForm)
        let instance = new ComponentClass({
            propsData: {
              post_id: this.post_id,
              parent_id: this.comment._id,
              parent_name: this.comment.name
            }
        })
        instance.$mount()
        this.$refs.parent.appendChild(instance.$el)

        this.replyOpen = true
      } else {
        // remove the reply form from the DOM
        let form = document.getElementById(`reply-${this.comment._id}`)

        if(form){
          this.$refs.parent.removeChild(form)

          this.replyOpen = false
        }
      }
    }
  }
}
</script>
<template>
  <form @submit="checkForm" method="post" :id="parent_id ? `reply-${parent_id}` : ''">
    <div class="flex flex-col md:flex-row mb-4">
    <div class="w-full md:w-1/2 md:mr-2">
      <input v-model="name" type="text" name="name" placeholder="Your Name" class="block bg-grey-lighter mt-2 rounded w-full py-2 px-3">
    </div>
    <div class="w-full md:w-1/2 md:ml-2">
      <input v-model="email" type="email" name="email" placeholder="Your Email" class="block bg-grey-lighter mt-2 rounded w-full py-2 px-3">
    </div>
    </div>
    <div class="mb-4">
      <textarea v-model="comment" name="comment" rows="6" :placeholder="parent_id ? `Reply to ${parent_name}...` : 'Add a comment'" class="bg-grey-lighter rounded resize-none w-full h-20 py-2 px-3">
      </textarea>
    </div>
    <div class="mb-4">
      <input v-model="notify_replies" class="mr-2" type="checkbox">
      <span class="text-sm">
        Notify me when anyone replies
      </span>
    </div>
    <input type="text" name="website" v-model="website" class="hidden opacity-0 z-0" tabindex="-1" autocomplete="off">
    <div class="mb-4">
      <input type="submit" value="Add Comment" :class="{ 'cursor-not-allowed opacity-50': loading }" class="cursor-pointer bg-blue hover:bg-blue-light text-white font-bold py-2 px-4 border-b-4 border-blue-dark hover:border-blue rounded">
    </div>
    <div v-if="errors.length" class="mb-4 text-red">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors" :key="error">
          {{ error }}
        </li>
      </ul>
    </div>
    <div v-if="success" class="text-green mb-4">
      <b>Your comment is currently awaiting moderation</b>
    </div>
  </form>
</template>

<script>
import axios from 'axios'

export default {
  name: "commentForm",
  props: {
    post_id: String,
    parent_id: String,
    parent_name: String
  },

  data: function () {
    return {
      errors: [],
      name: null,
      email: null,
      comment: null,
      notify_replies: false,
      website: null,
      loading: false,
      success: false
    }
  },

  methods: {
    checkForm: function (e) {
      this.errors = []
      this.success = false

      if (!this.name) {
        this.errors.push("Name required")
      }
      if (!this.email) {
        this.errors.push('Email required')
      } else if (!this.validEmail(this.email)) {
        this.errors.push('Valid email required')
      }
      if (!this.comment) {
        this.errors.push("Comment required")
      }

      if (!this.errors.length) {
        this.submitForm()
      }

      e.preventDefault()
    },

    submitForm: function () {
      this.loading = true

      axios.post(process.env.commentUrl,
      JSON.stringify({
          form: {
            post_id: this.post_id,
            parent_id: this.parent_id,
            name: this.name,
            email: this.email,
            comment: this.comment,
            notify_replies: this.notify_replies,
            website: this.website //honeypot field
          }
        }),
      {
        headers: { 'Content-Type': 'application/json' }
      })
      .then(({ data }) => {
        this.loading = false

        if(data.error){
          this.errors.push(data.error)
        } else if(data.name && data.email && data.comment) {
          this.name = this.email = this.comment = null
          this.success = true
        }
      }).catch(error => {
        this.loading = false

        this.errors.push('An error occured, please try again later')
      })
    },

    validEmail: function (email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    }
  }
}
</script>


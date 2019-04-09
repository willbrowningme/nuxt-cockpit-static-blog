<template>
  <section class="my-8">
    <div class="text-center">
      <h2 class="mb-6">Contact Page</h2>
      <p class="mb-8">
        This is a basic contact form working with Cockpit CMS!
      </p>
    </div>

    <form @submit="checkForm" method="post">
      <div class="mb-4">
        <label for="name">Name:</label>
        <input v-model="name" type="text" name="name" placeholder="Your Name" class="block mt-2 bg-grey-lighter rounded w-full py-2 px-3">
      </div>
      <div class="mb-4">
        <label for="mail">Email:</label>
        <input v-model="email" type="email" name="email" placeholder="Your Email" class="block mt-2 bg-grey-lighter rounded w-full py-2 px-3">
      </div>
      <div class="mb-4">
        <label for="msg">Message:</label>
        <textarea v-model="message" name="message" placeholder="Your Message" class="block mt-2 bg-grey-lighter rounded w-full py-2 px-3"></textarea>
      </div>
      <input type="text" name="website" v-model="website" class="hidden opacity-0 z-0" tabindex="-1" autocomplete="off">
      <div class="mb-4">
        <input type="submit" value="Send message" :class="{ 'cursor-not-allowed opacity-50': loading }" class="cursor-pointer bg-blue hover:bg-blue-light text-white font-bold py-2 px-4 border-b-4 border-blue-dark hover:border-blue rounded">
      </div>
      <div v-if="errors.length" class="mb-4 text-red">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error">
            {{ error }}
          </li>
        </ul>
      </div>
      <div v-if="success" class="text-green">
        <b>Your message has been sent succesfully</b>
      </div>
    </form>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  head () {
    return {
      title: 'Contact',
      meta: [
        { hid: 'description', name: 'description', content: 'This is the contact page!' }
      ]
    }
  },

  data: function () {
    return {
      errors: [],
      name: null,
      email: null,
      message: null,
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
      if (!this.message) {
        this.errors.push("Message required")
      }

      if (!this.errors.length) {
        this.submitForm()
      }

      e.preventDefault()
    },

    submitForm: function () {
      this.loading = true

      axios.post(process.env.contactUrl,
      JSON.stringify({
          form: {
            name: this.name,
            email: this.email,
            message: this.message,
            website: this.website
          }
        }),
      {
        headers: { 'Content-Type': 'application/json' }
      })
      .then(({ data }) => {
        this.loading = false

        if(data.error){
          this.errors.push(data.error)
        } else if(data.name && data.email && data.message) {
          this.name = this.email = this.message = null
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
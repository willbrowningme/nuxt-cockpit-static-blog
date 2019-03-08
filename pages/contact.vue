<template>
  <section class="my-8">
    <div class="text-center">
      <h1 class="mb-6">Contact Page</h1>
      <p class="mb-8">
        This is a basic contact form working with Cockpit CMS!
      </p>
    </div>

    <form @submit="checkForm" method="post">
      <div v-if="errors.length" class="mb-4 text-red">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error">
            {{ error }}
          </li>
        </ul>
      </div>
      <div class="mb-4">
        <label for="name">Name:</label>
        <input v-model="name" type="text" name="name" placeholder="Your Name" class="block mt-2 shadow rounded w-full py-2 px-3 text-dark-grey">
      </div>
      <div class="mb-4">
        <label for="mail">Email:</label>
        <input v-model="email" type="email" name="email" placeholder="Your Email" class="block mt-2 shadow rounded w-full py-2 px-3 text-dark-grey">
      </div>
      <div class="mb-4">
        <label for="msg">Message:</label>
        <textarea v-model="message" name="message" placeholder="Your Message" class="block mt-2 shadow rounded w-full py-2 px-3 text-dark-grey"></textarea>
      </div>
      <input type="text" name="website" v-model="website" class="hidden opacity-0 z-0" tabindex="-1" autocomplete="off">
      <div class="mb-4">
        <input type="submit" value="Send message" :class="{ 'cursor-not-allowed opacity-50': loading }" class="cursor-pointer bg-blue hover:bg-blue-light text-white font-bold py-2 px-4 border-b-4 border-blue-dark hover:border-blue rounded">
      </div>
      <div v-if="formResponse">
        <b>{{ formResponse }}</b>
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
      formResponse: null
    }
  },

  methods: {
    checkForm: function (e) {
      this.errors = []
      this.formResponse = null

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
          this.formResponse = data.error
        } else if(data.name && data.email && data.message) {
          this.name = this.email = this.message = null
          this.formResponse = 'Your message has been sent succesfully'
        } else {
          this.formResponse = 'One or more fields are not valid, please try again'
        }
      })
    },

    validEmail: function (email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    }
  }
}
</script>
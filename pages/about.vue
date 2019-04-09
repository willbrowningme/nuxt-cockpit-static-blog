<template>
  <section class="my-8">
    <div class="text-center">
      <h2 class="mb-6">About Page</h2>
      <p>
        This is a static blog made with Nuxt.js, Cockpit and Tailwindcss! This site is hosted on Netlify.
      </p>
    </div>
  </section>
</template>

<script>
export default {
  head () {
    return {
      title: 'About',
      meta: [
        { hid: 'description', name: 'description', content: 'This is the about page!' }
      ]
    }
  }
}
</script>
<template>
  <div class="flex flex-row justify-center w-screen">
    <div class="overflow-hidden content flex flex-col p-4 md:p-8">
      <page-header/>
      <page-nav/>
      <nuxt/>
      <page-footer/>
    </div>
  </div>
</template>

<script>
import PageHeader from '~/components/PageHeader.vue'
import PageNav from '~/components/PageNav.vue'
import PageFooter from '~/components/PageFooter.vue'

export default {
  components: {
    PageHeader,
    PageNav,
    PageFooter
  }
}
</script>
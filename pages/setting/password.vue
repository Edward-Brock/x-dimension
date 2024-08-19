<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `密码 - ${titleChunk}` : '密码'
  },
})
</script>

<template>
  <u-container class="my-5">
    Password
  </u-container>
</template>

<style scoped>

</style>

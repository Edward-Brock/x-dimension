<script setup lang="ts">
const { status, data, refresh } = useAuth()
</script>

<template>
  <UContainer class="my-5">
    <div>You are currently {{ status }}.</div>
    <div v-if="data">
      Hello {{ data.nickname }}!
    </div>
    <div v-else>
      You are not logged in.
    </div>

    <button @click="() => refresh()">
      Refresh
    </button>
  </UContainer>
</template>

<style scoped>

</style>

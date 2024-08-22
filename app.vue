<script setup lang="ts">
const projectName = useRuntimeConfig().public.projectName
const projectDescription = useRuntimeConfig().public.projectDescription

useSeoMeta({
  title: projectName,
  ogTitle: projectName,
  description: projectDescription,
  ogDescription: projectDescription,
})
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <UNotifications />
</template>

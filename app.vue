<script setup lang="ts">
const projectName = useRuntimeConfig().public.projectName as string
const projectDescription = useRuntimeConfig().public.projectDescription as string

useSeoMeta({
  title: projectName,
  ogTitle: projectName,
  description: projectDescription,
  ogDescription: projectDescription,
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

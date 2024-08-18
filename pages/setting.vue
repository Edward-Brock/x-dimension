<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `设置 - ${titleChunk}` : '设置'
  },
})

const links = [{
  label: '通用',
  icon: 'i-heroicons-user-circle',
  to: '/setting',
}, {
  label: '密码',
  icon: 'i-heroicons-lock-closed',
}]
</script>

<template>
  <main>
    <header
      class="h-14 border-b -mb-px border-gray-200 flex items-center dark:border-gray-800"
    >
      <UContainer class="flex items-center justify-between flex-1 gap-x-1.5 min-w-0">
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200">
          设置
        </h1>
      </UContainer>
    </header>

    <nav>
      <header
        class="h-12 border-b -mb-px border-gray-200 flex items-center dark:border-gray-800"
      >
        <UContainer class="flex items-center justify-between flex-1 gap-x-1.5 min-w-0">
          <div class="tracking-tight text-gray-900 dark:text-gray-200">
            <UHorizontalNavigation
              :links="links"
              class="border-b border-gray-200 dark:border-gray-800"
            />
          </div>
        </UContainer>
      </header>
    </nav>

    <NuxtPage />
  </main>
</template>

<style scoped>

</style>

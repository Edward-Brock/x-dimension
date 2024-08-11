<script setup lang="ts">
import { Disclosure } from '@headlessui/vue'

const { status } = useAuth()
</script>

<template>
  <Disclosure
    as="nav"
  >
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex flex-shrink-0 items-center">
            <img
              class="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=green&shade=500"
              alt="Your Company"
            >
          </div>
        </div>

        <!-- 右侧注册登录、个人信息展示区 -->
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <!-- 注册登录 -->
          <div
            v-if="status==='unauthenticated'"
            class="flex flex-wrap items-center justify-center"
          >
            <UButton
              size="md"
              color="gray"
              variant="solid"
              :ui="{ rounded: 'rounded-full' }"
              to="/signup"
            >
              注册
            </UButton>

            <UButton
              class="ml-2"
              size="md"
              variant="solid"
              :ui="{ rounded: 'rounded-full' }"
              to="/login"
            >
              <template #trailing>
                <UIcon
                  name="i-heroicons-arrow-right-20-solid"
                  class="w-5 h-5"
                />
              </template>
              登录
            </UButton>
          </div>

          <!-- 个人信息 -->
          <div
            v-else-if="status==='authenticated'"
            class="flex items-center"
          >
            <!-- Profile dropdown -->
            <UserDropdown />
          </div>
        </div>
      </div>
    </div>
  </Disclosure>
</template>

<style scoped>

</style>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const { signUp } = useAuth()
const toast = useToast()
const projectName = useRuntimeConfig().public.projectName

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `注册 - ${titleChunk}` : '注册'
  },
})

definePageMeta({
  layout: 'single',
  auth: false,
})

const schema = z.object({
  nickname: z.string({ required_error: '需要昵称' })
    .max(80, { message: '不能超过80个字符' }),
  username: z.string({ required_error: '需要用户名' })
    .max(32, { message: '不能超过32个字符' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: '只能包含字母、数字和下划线' }),
  password: z.string({ required_error: '需要密码' })
    .min(6, { message: '必须至少包含6个字符' })
    .max(128, { message: '不能超过128个字符' }),
}).refine(data => data.nickname && data.username && data.password, {
  message: '所有字段都是必填的',
})

type Schema = z.output<typeof schema>

const state = reactive({
  nickname: undefined,
  username: undefined,
  password: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const credentials = { nickname: event.data.nickname, username: event.data.username, password: event.data.password }
    // 注册成功即成功登录，无需引导至登录页面
    await signUp(credentials, { callbackUrl: '/', redirect: true })
    toast.add({
      icon: 'i-heroicons-check-circle',
      id: 'signup_success',
      title: '注册成功',
      description: `欢迎使用 ${projectName}`,
    })
  }
  catch (error: any) {
    if (error.response) {
      // 获取并显示后端返回的具体错误信息
      toast.add({
        icon: 'i-heroicons-x-circle',
        id: 'signup_error',
        color: 'red',
        title: '注册失败',
        description: error.response._data?.message || '发生了未知错误',
      })
    }
    else {
      console.error(error)
    }
  }
}
</script>

<template>
  <div class="h-screen flex flex-col items-center overlay">
    <!-- 首页跳转按钮 -->
    <UButton
      class="font-medium my-8"
      icon="i-heroicons-home"
      size="md"
      color="black"
      variant="solid"
      to="/"
      label="首页"
      :trailing="false"
      :ui="{ rounded: 'rounded-full' }"
    />

    <main
      class="rounded-xl divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur"
    >
      <div class="px-4 py-5 sm:p-6">
        <div class="w-full max-w-sm space-y-6">
          <!-- 描述区 -->
          <div class="text-center">
            <div class="text-2xl text-gray-900 dark:text-white font-bold">
              注册 IMP 账户
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400 mt-1">已有帐户？</span>
              <span><NuxtLink to="/login">登录</NuxtLink></span>
            </div>
          </div>

          <!-- 注册表单 -->
          <div>
            <UForm
              :schema="schema"
              :state="state"
              class="space-y-4"
              @submit="onSubmit"
            >
              <UFormGroup
                label="昵称"
                name="nickname"
              >
                <UInput
                  v-model="state.nickname"
                  icon="i-heroicons-at-symbol"
                  placeholder="输入昵称"
                  size="md"
                />
              </UFormGroup>

              <UFormGroup
                label="用户名"
                name="username"
              >
                <UInput
                  v-model="state.username"
                  icon="i-heroicons-user"
                  placeholder="输入用户名"
                  size="md"
                />
              </UFormGroup>

              <UFormGroup
                label="密码"
                name="password"
              >
                <UInput
                  v-model="state.password"
                  icon="i-heroicons-key"
                  placeholder="输入密码"
                  size="md"
                  type="password"
                />
              </UFormGroup>

              <UButton
                block
                type="submit"
                :ui="{ rounded: 'rounded-full' }"
              >
                创建账号
              </UButton>
            </UForm>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>

</style>

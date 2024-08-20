<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from "#ui/types";

// 定义密码数据的类型
interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `密码 - ${ titleChunk }` : '密码'
  },
})

// 定义表单验证规则
const schema = z.object({
  currentPassword: z.string({ required_error: '需要当前密码' })
      .min(6, { message: '必须至少包含6个字符' })
      .max(128, { message: '不能超过128个字符' }),
  newPassword: z.string({ required_error: '需要新密码' })
      .min(6, { message: '必须至少包含6个字符' })
      .max(128, { message: '不能超过128个字符' }),
  confirmPassword: z.string({ required_error: '需要确认密码' })
      .min(6, { message: '必须至少包含6个字符' })
      .max(128, { message: '不能超过128个字符' })
}).superRefine((data, ctx) => {
  if (data.newPassword !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '两次输入的密码不一致',
      path: ['confirmPassword'], // 指定错误发生的路径
    });
  }
});

const { data } = useAuthState()

type Schema = z.output<typeof schema>

const state = reactive({
  currentPassword: undefined,
  newPassword: undefined,
  confirmPassword: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const response = await $fetch('/api/user/password', {
      method: 'PATCH',
      body: {
        userId: data.value.sub,
        currentPassword: event.data.currentPassword,
        newPassword: event.data.newPassword,
      },
    });

    // 处理响应
    console.log('密码更新成功:', response);
  }
  catch (error) {
    // 处理错误
    console.error('密码更新失败:', error);
  }
}
</script>

<template>
  <u-container class="my-5">
    <div class="flex-1 flex flex-col pb-24">
      <UForm
          :schema="schema"
          :state="state"
          @submit="onSubmit"
      >
        <UFormGroup
            name="submit"
            class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b -mb-px border-gray-200 dark:border-gray-800">
          <template #label>
            <p class="text-lg text-gray-900 dark:text-white font-semibold">密码</p>
          </template>

          <template #description class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            在此更改你的账号密码
          </template>

          <UButton size="md" type="submit">
            更改密码
          </UButton>
        </UFormGroup>

        <div
            class="divide-y divide-gray-200 dark:divide-gray-800 pb-6 space-y-6 *:pt-6 mb-6 border-b -mb-px border-gray-200 dark:border-gray-800">
          <UFormGroup
              name="currentPassword"
              label="当前密码"
              required
              class="grid grid-cols-2 gap-2 items-center"
          >
            <UInput icon="i-heroicons-lock-open" size="md" type="password" placeholder="输入你的当前密码"
                    v-model="state.currentPassword"/>
          </UFormGroup>

          <UFormGroup
              name="newPassword"
              label="新密码"
              required
              class="grid grid-cols-2 gap-2 items-center"
          >
            <UInput icon="i-heroicons-lock-closed" size="md" type="password" placeholder="输入你的新密码"
                    v-model="state.newPassword"/>
          </UFormGroup>

          <UFormGroup
              name="confirmPassword"
              label="确认密码"
              required
              class="grid grid-cols-2 gap-2 items-center"
          >
            <UInput icon="i-heroicons-lock-closed" size="md" type="password" placeholder="重复输入你的新密码"
                    v-model="state.confirmPassword"/>
          </UFormGroup>
        </div>
      </UForm>
    </div>
  </u-container>
</template>

<style scoped>

</style>

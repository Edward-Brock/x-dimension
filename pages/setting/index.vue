<script setup lang="ts">
import { z } from 'zod'

// 定义用户数据的类型
interface UserData {
  username: string
  nickname: string
  email?: string
  mobile?: string
  gender: string
}

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `通用 - ${titleChunk}` : '通用'
  },
})

// 定义表单验证规则
const schema = z.object({
  nickname: z.string({ required_error: '需要昵称' })
    .min(1, '不能少于1个字符')
    .max(80, { message: '不能超过80个字符' }),
  email: z.string()
    .email('请输入有效的电子邮箱地址')
    .optional(),
  mobile: z.string()
    .length(11, { message: '需要11位电话号码' })
    .startsWith('1', { message: '请输入正确的手机号码' })
    .optional(),
})

const { data, rawToken } = useAuthState()
const { refresh } = useAuth()

// 使用 useAsyncData 获取用户初始数据
const { data: initialData } = await useAsyncData<UserData>('user-data', () =>
  $fetch<UserData>('/api/auth/user', {
    headers: {
      Authorization: `Bearer ${rawToken.value}`,
    },
    query: { type: 'info' },
  }),
)

// 反应式的 state 对象
const state = reactive<UserData>({
  username: initialData.value?.username || '',
  nickname: initialData.value?.nickname || '',
  email: initialData.value?.email || undefined,
  mobile: initialData.value?.mobile || undefined,
  gender: initialData.value?.gender || 'Unknown',
})

// 性别选项
const genders = [{
  name: '未知',
  value: 'Unknown',
}, {
  name: '男',
  value: 'Male',
}, {
  name: '女',
  value: 'Female',
}, {
  name: '其他',
  value: 'Other',
}]

async function onSubmit() {
  const changedData: Partial<UserData> = {}

  // 手动排除空值的字段
  const validatedState: Partial<UserData> = {
    ...state,
    email: state.email?.trim() || undefined,
    mobile: state.mobile?.trim() || undefined,
    gender: state.gender,
  }

  // 找出更改的部分并排除 undefined
  for (const key in validatedState) {
    const newValue = validatedState[key as keyof UserData]
    const originalValue = initialData.value?.[key as keyof UserData]

    if (newValue !== originalValue && newValue !== undefined) {
      changedData[key as keyof UserData] = newValue
    }
  }

  if (Object.keys(changedData).length > 0) {
    console.log('提交的更改数据:', changedData)
    const response = await fetch(`/api/user/${data.value.sub}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${rawToken.value}`,
      },
      body: JSON.stringify(changedData),
    })

    if (response.ok) {
      const result = await response.json()
      console.log('更新成功:', result)
      await refresh()
    }
    else {
      console.error('更新失败:', await response.json())
    }
  }
  else {
    console.log('没有任何更改，不需要提交')
  }
}
</script>

<template>
  <UContainer class="my-5">
    <div class="flex-1 flex flex-col pb-24">
      <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit"
      >
        <UFormGroup
          name="submit"
          class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b -mb-px border-gray-200 dark:border-gray-800"
        >
          <template #label>
            <p class="text-lg text-gray-900 dark:text-white font-semibold">
              个人信息
            </p>
          </template>

          <template #description>
            这些信息部分将公开显示，请小心您分享的内容
          </template>

          <template #default>
            <UButton
              size="md"
              type="submit"
            >
              保存更改
            </UButton>
          </template>
        </UFormGroup>

        <div
          class="divide-y divide-gray-200 dark:divide-gray-800 pb-6 space-y-6 *:pt-6 mb-6 border-b -mb-px border-gray-200 dark:border-gray-800"
        >
          <UFormGroup
            name="username"
            label="用户名"
            required
            class="grid grid-cols-2 gap-2 items-center"
          >
            <UInput
              v-model="state.username"
              icon="i-heroicons-user"
              size="md"
              disabled
              placeholder="这是你的用户名"
            />
          </UFormGroup>

          <UFormGroup
            name="nickname"
            label="昵称"
            required
            class="grid grid-cols-2 gap-2 items-center"
          >
            <UInput
              v-model="state.nickname"
              icon="i-heroicons-at-symbol"
              size="md"
              placeholder="输入你的昵称"
            />
          </UFormGroup>

          <UFormGroup
            name="email"
            label="电子邮箱"
            class="grid grid-cols-2 gap-2 items-center"
          >
            <UInput
              v-model="state.email"
              icon="i-heroicons-envelope"
              size="md"
              placeholder="输入你的电子邮箱"
            />
          </UFormGroup>

          <UFormGroup
            name="mobile"
            label="电话号码"
            class="grid grid-cols-2 gap-2 items-center"
          >
            <UInput
              v-model="state.mobile"
              icon="i-heroicons-device-phone-mobile"
              size="md"
              placeholder="输入你的电话号码"
            />
          </UFormGroup>

          <UFormGroup
            name="gender"
            label="性别"
            class="grid grid-cols-2 gap-2 items-center"
          >
            <USelect
              v-model="state.gender"
              :options="genders"
              option-attribute="name"
            />
          </UFormGroup>
        </div>
      </UForm>
    </div>
  </UContainer>
</template>

<style scoped>

</style>

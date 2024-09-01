<script setup lang="ts">
import COS from 'cos-js-sdk-v5'
import { ref } from 'vue'
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()
let selectedFile: File | null = null
const taskId = ref('')

const cos = new COS({
  getAuthorization: async function (options, callback) {
    try {
      // 调用后端 API 获取临时密钥
      const data = await $fetch<any>('/api/getTmpKey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          scope: [
            {
              bucket: options.Bucket,
              region: options.Region,
              prefix: options.Key,
            },
          ],
        },
      })

      // 打印完整的返回数据
      // console.log('API 返回的数据:', JSON.stringify(data, null, 2))

      // 判断是否包含 tmpSecretId, tmpSecretKey, sessionToken
      if (!data.tmpSecretId || !data.tmpSecretKey || !data.sessionToken) {
        console.error('临时密钥无效，返回的数据没有包含必要字段：', JSON.stringify(data, null, 2))
        return
      }

      // 解析返回的临时密钥
      const { tmpSecretId, tmpSecretKey, sessionToken, startTime, expiredTime } = data

      // 使用回调函数将凭证传递给 COS SDK
      callback({
        TmpSecretId: tmpSecretId,
        TmpSecretKey: tmpSecretKey,
        SecurityToken: sessionToken,
        StartTime: startTime,
        ExpiredTime: expiredTime,
        ScopeLimit: true,
      })
    }
    catch (error) {
      console.error('获取临时密钥失败', error)
    }
  },
})

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile = target.files[0]
  }
}

const uploadImage = async () => {
  if (!selectedFile) {
    alert('请先选择文件')
    return
  }

  // 生成唯一的文件名
  const timestamp = Date.now()
  const uniqueFileName = `${timestamp}-${selectedFile.name}`

  try {
    const data = await cos.uploadFile({
      Bucket: config.public.cosBucket,
      Region: config.public.cosRegion,
      Key: `x-dimension/avatar/${uniqueFileName}`,
      Body: selectedFile,
      SliceSize: 1024 * 1024 * 5,
      onProgress: function (progressData) {
        console.log(JSON.stringify(progressData))
      },
      onTaskReady: function (id) {
        taskId.value = id
      },
    })

    console.log('上传成功', data)
  }
  catch (e) {
    console.error('上传失败', e)
  }
}
</script>

<template>
  <u-container class="my-5">
    <input
      type="file"
      @change="handleFileChange"
    >

    <UButton
      color="gray"
      variant="solid"
      @click="uploadImage"
    >
      上传头像
    </UButton>
  </u-container>
</template>

<style scoped>

</style>

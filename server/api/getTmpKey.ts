import STS from 'qcloud-cos-sts'

// 定义接口类型
interface TempKeys {
  credentials: {
    tmpSecretId: string
    tmpSecretKey: string
    sessionToken: string
  }
  startTime: number
  expiredTime: number
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event) // 获取前端传递的请求体

  if (!body || !body.scope) {
    return { error: 'Invalid request body' }
  }

  const stsConfig = {
    secretId: config.cosSecretId,
    secretKey: config.cosSecretKey,
    durationSeconds: 1800,
    endpoint: 'sts.tencentcloudapi.com',
    bucket: config.public.cosBucket,
    region: config.public.cosRegion,
    allowPrefix: 'x-dimension/*', // 调整为实际允许的路径前缀
    allowActions: [
      // 简单上传
      'name/cos:PutObject',
      'name/cos:PostObject',
      // 分片上传
      'name/cos:InitiateMultipartUpload',
      'name/cos:ListMultipartUploads',
      'name/cos:ListParts',
      'name/cos:UploadPart',
      'name/cos:CompleteMultipartUpload',
    ],
  }

  const shortBucketName = stsConfig.bucket.substr(0, stsConfig.bucket.lastIndexOf('-'))
  const appId = stsConfig.bucket.substr(1 + stsConfig.bucket.lastIndexOf('-'))

  const policy = {
    version: '2.0',
    statement: [{
      action: stsConfig.allowActions,
      effect: 'allow',
      principal: { qcs: ['*'] },
      resource: [
        `qcs::cos:${stsConfig.region}:uid/${appId}:prefix//${appId}/${shortBucketName}/${stsConfig.allowPrefix}`,
      ],
    }],
  }

  try {
    const tempKeys = await new Promise<TempKeys>((resolve, reject) => {
      STS.getCredential({
        secretId: stsConfig.secretId,
        secretKey: stsConfig.secretKey,
        durationSeconds: stsConfig.durationSeconds,
        endpoint: stsConfig.endpoint,
        policy: policy,
      }, (err, tempKeys) => {
        if (err) reject(err)
        else resolve(tempKeys)
      })
    })

    return {
      tmpSecretId: tempKeys.credentials.tmpSecretId,
      tmpSecretKey: tempKeys.credentials.tmpSecretKey,
      sessionToken: tempKeys.credentials.sessionToken,
      startTime: tempKeys.startTime,
      expiredTime: tempKeys.expiredTime,
    }
  }
  catch (err) {
    return { error: 'Failed to get temp keys', details: err }
  }
})

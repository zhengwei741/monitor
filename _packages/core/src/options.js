// 配置初始化 校验
export function initOptions (option) {
  checkBaseInfo(option)
  // const { transport } = option
}

function checkBaseInfo(option) {
  const { url, appId, userId } = option
  if (!url || !appId || !userId) {
    throw new Error('缺少必要参数')
  }
}

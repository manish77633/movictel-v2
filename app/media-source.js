export function mediaUrl(value = '') {
  if (!value) return undefined
  return value.startsWith('/') || value.startsWith('https://') ? value : '/media/' + value
}

export function isVideo(value, mime = '') {
  return value?.endsWith('#video') || mime?.startsWith('video/') || /\.(mp4|webm)(?:$|[?#])/i.test(value || '')
}

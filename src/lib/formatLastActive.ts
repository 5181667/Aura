export function formatLastActive(lastActiveAt: Date): string {
    const now = new Date()
    const diff = now.getTime() - new Date(lastActiveAt).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 5) return "在线"
    if (minutes < 60) return `${minutes}分钟前在线`
    if (hours < 24) return `${hours}小时前在线`
    if (days < 7) return `${days}天前在线`
    return "离线"
}

export function isOnline(lastActiveAt: Date): boolean {
    const now = new Date()
    const diff = now.getTime() - new Date(lastActiveAt).getTime()
    const minutes = Math.floor(diff / 60000)
    return minutes < 5
}

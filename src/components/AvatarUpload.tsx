"use client"

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './AvatarUpload.module.css'

interface AvatarUploadProps {
    currentImage?: string | null
    userName?: string
}

export default function AvatarUpload({ currentImage, userName }: AvatarUploadProps) {
    const router = useRouter()
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(currentImage || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Show preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Upload
        setUploading(true)
        const formData = new FormData()
        formData.append('avatar', file)

        try {
            const res = await fetch('/api/user/upload-avatar', {
                method: 'POST',
                body: formData,
            })

            if (res.ok) {
                const data = await res.json()
                setPreview(data.imageUrl)
                router.refresh()
                alert('头像上传成功！')
            } else {
                const data = await res.json()
                alert(data.message || '上传失败')
            }
        } catch (error) {
            alert('网络错误')
        } finally {
            setUploading(false)
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className={styles.container}>
            <div className={styles.avatarPreview} onClick={triggerFileInput}>
                {preview ? (
                    <img src={preview} alt="Avatar" className={styles.avatarImage} />
                ) : (
                    <div className={styles.avatarPlaceholder}>
                        {userName?.[0]?.toUpperCase() || '?'}
                    </div>
                )}
                <div className={styles.overlay}>
                    {uploading ? '上传中...' : '点击上传'}
                </div>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={uploading}
            />
            <p className={styles.hint}>支持 JPG、PNG、GIF、WebP 格式，最大 5MB</p>
        </div>
    )
}

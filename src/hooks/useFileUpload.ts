import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const supabase = createClient()

  const uploadFile = async (file: File, bucket: string = 'public_images', pathPrefix: string = 'uploads') => {
    if (!file) return null
    
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('Kích thước ảnh phải nhỏ hơn 2MB!')
    }

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `${pathPrefix}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      return publicUrl
    } catch (err: any) {
      console.error('Upload error:', err)
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  return { uploadFile, isUploading }
}

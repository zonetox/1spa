'use client'

import { useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'
import { UniversalTemplate } from '@/components/templates/v7-core/UniversalTemplate'
import { CATEGORY_DEFAULTS, CATEGORY_COLORS } from '@/lib/constants'

function PreviewContent() {
  const searchParams = useSearchParams()
  const type = searchParams.get('template')

  const renderTemplate = () => {
    const dummyProps = {
      data: {}, // Fallbacks internally to templates' embedded static constants
      isEditing: false,
      onUpdate: () => {},
      businessInfo: {
        name: 'Luxe Experience Preview'
      }
    }

    if (['Spa', 'Beauty', 'Dental'].includes(type || '')) {
      const pillar = type as 'Spa' | 'Beauty' | 'Dental'
      return (
        <UniversalTemplate 
          {...dummyProps} 
          defaults={{
            ...CATEGORY_DEFAULTS[pillar],
            themeColor: CATEGORY_COLORS[pillar]
          }}
        />
      )
    }

    switch (type) {
      default:
        return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
              <h1 className="text-2xl font-bold text-slate-800 mb-6">1Beauty.Asia Elite Templates</h1>
              <div className="space-y-4">
                <a href="/preview?template=Spa" className="block w-full py-4 bg-orange-50 text-orange-800 font-bold rounded-xl border border-orange-200 hover:bg-orange-100 transition-all">
                  🌿 Spa & Wellness (Trầm Ấm / Resort)
                </a>
                <a href="/preview?template=Beauty" className="block w-full py-4 bg-yellow-50 text-yellow-800 font-bold rounded-xl border border-yellow-200 hover:bg-yellow-100 transition-all">
                  👑 Beauty Salon (Vàng Gold)
                </a>
                <a href="/preview?template=Dental" className="block w-full py-4 bg-cyan-50 text-cyan-800 font-bold rounded-xl border border-cyan-200 hover:bg-cyan-100 transition-all">
                  🦷 Dental Care (Xanh Ngọc / Sáng)
                </a>
              </div>
            </div>
          </div>
        )
    }
  }

  return <main>{renderTemplate()}</main>
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div>Đang tải component...</div>}>
      <PreviewContent />
    </Suspense>
  )
}

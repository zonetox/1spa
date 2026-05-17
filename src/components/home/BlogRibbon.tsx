'use client'
import Image from 'next/image';
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const POSTS = [
  { slug: 'xu-huong-spa-2026', label: 'Xu Hướng', title: 'Top 10 Liệu Trình Spa Cao Cấp Được Yêu Thích Nhất 2026', excerpt: 'Khám phá những liệu trình spa sang trọng đang làm say mê giới thượng lưu toàn cầu.', img: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800', big: true },
  { slug: 'rang-su-cercon', label: 'Nha Khoa', title: 'Răng Sứ Cercon: Bí Quyết Nụ Cười Hoàn Hảo', excerpt: 'Công nghệ răng sứ tiên tiến đang thay đổi ngành nha khoa thẩm mỹ.', img: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=800', big: false },
  { slug: 'tri-nam-picosure', label: 'Thẩm Mỹ', title: 'Picosure: Cách Mạng Điều Trị Nám 2026', excerpt: 'Laser thế hệ mới xóa nám sâu chỉ sau 3 buổi, không đau không bong tróc.', img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800', big: false },
  { slug: 'chon-spa-uy-tin', label: 'Hướng Dẫn', title: '7 Tiêu Chí Vàng Chọn Spa Đẳng Cấp', excerpt: 'Những điều bạn cần kiểm tra trước khi đặt lịch tại bất kỳ spa nào.', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800', big: false },
]

export function BlogRibbon() {
  const [posts, setPosts] = useState<any[]>(POSTS)
  const supabase = createClient()

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4)

      if (!error && data && data.length > 0) {
        const mapped = data.map((item: any, idx: number) => {
          const text = item.content ? item.content.replace(/<[^>]*>/g, '') : ''
          const excerpt = text.length > 120 ? text.substring(0, 120) + '...' : text
          return {
            slug: item.slug,
            label: item.category || (idx === 0 ? 'Xu Hướng' : idx === 1 ? 'Nha Khoa' : 'Thẩm Mỹ'),
            title: item.title,
            excerpt: excerpt || 'Khám phá bài viết mới nhất từ chúng tôi.',
            img: item.thumbnail_url || 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800',
            big: idx === 0
          }
        })
        setPosts(mapped)
      }
    }
    fetchBlogs()
  }, [])
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-12 h-px bg-[#D4AF37]" />
              <span className="text-[11px] tracking-[0.5em] uppercase text-[#D4AF37] font-medium">Vogue Style</span>
            </div>
            <h2 className="text-5xl font-bold text-[#2F2F2F]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Cẩm Nang<br /><span className="text-[#D4AF37]">Làm Đẹp.</span>
            </h2>
          </div>
          <Link href="/blog" className="hidden md:flex items-center gap-2 text-[11px] tracking-widest uppercase text-[#D4AF37] hover:gap-4 transition-all font-medium">
            Xem tất cả <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Asymmetric Grid - Vogue Style */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Big feature - left */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="md:col-span-7 group cursor-pointer">
            <Link href={`/blog/${posts[0]?.slug || ''}`}>
              <div className="relative h-[520px] rounded-3xl overflow-hidden mb-6">
                <Image width={800} height={800} src={posts[0]?.img}   alt={posts[0]?.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"  />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2F2F2F]/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-white mb-4"
                    style={{ background: '#D4AF37' }}>
                    {posts[0]?.label}
                  </span>
                  <h3 className="text-white text-2xl font-bold leading-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {posts[0]?.title}
                  </h3>
                  <p className="text-white/70 text-sm">{posts[0]?.excerpt}</p>
                </div>
              </div>
            </Link>
          </motion.div>
 
          {/* Small posts - right column */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {posts.slice(1).map((post, i) => (
              <motion.div key={post.slug} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7 }}
                className="group cursor-pointer flex gap-5">
                <Link href={`/blog/${post.slug}`} className="flex gap-5 flex-1">
                  <div className="relative w-32 h-28 rounded-2xl overflow-hidden flex-shrink-0">
                    <Image width={800} height={800} src={post.img}   alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"  />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-medium mb-2">{post.label}</span>
                    <h4 className="text-[#2F2F2F] font-bold text-sm leading-tight group-hover:text-[#D4AF37] transition-colors mb-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}>
                      {post.title}
                    </h4>
                    <p className="text-[#2F2F2F]/50 text-xs leading-relaxed line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

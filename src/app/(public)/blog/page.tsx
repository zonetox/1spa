'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ArrowRight, Tag } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Footer } from '@/components/home/Footer'

type Category = { id: string; name: string; slug: string }
type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  image_url: string
  created_at: string
  read_time: string
  category_id: string
  blog_categories?: { name: string }
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      // Fetch Categories
      const { data: catData } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name')
      
      setCategories(catData || [])

      // Fetch Posts
      const { data: postData } = await supabase
        .from('blogs')
        .select('*, blog_categories(name)')
        .eq('status', 'Published')
        .order('created_at', { ascending: false })
      
      setPosts(postData || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const filteredPosts = selectedCat 
    ? posts.filter(p => p.category_id === selectedCat)
    : posts

  const featuredPost = filteredPosts[0]
  const regularPosts = filteredPosts.slice(1)

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pt-32 pb-32" style={{ background: '#F9F6F0' }}>
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#D4AF37] tracking-[0.4em] uppercase text-xs font-bold block mb-6"
            >
              Editorial & Insights
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-[#2F2F2F] leading-tight mb-8"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Cảm Hứng <span className="text-[#D4AF37]">Làm Đẹp.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[#2F2F2F]/60 text-lg md:text-xl leading-relaxed font-medium"
            >
              Nơi hội tụ những kiến thức y khoa thẩm mỹ chuyên sâu, bí quyết sống khỏe và xu hướng làm đẹp thượng lưu từ các chuyên gia hàng đầu.
            </motion.p>
          </div>

          {/* Category Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 border-y border-[#D4AF37]/10 py-8">
            <button
              onClick={() => setSelectedCat(null)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                selectedCat === null 
                  ? 'bg-[#D4AF37] text-white shadow-lg' 
                  : 'bg-white text-[#2F2F2F]/60 hover:text-[#D4AF37] border border-transparent hover:border-[#D4AF37]/20'
              }`}
            >
              Tất cả
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                  selectedCat === cat.id 
                    ? 'bg-[#D4AF37] text-white shadow-lg' 
                    : 'bg-white text-[#2F2F2F]/60 hover:text-[#D4AF37] border border-transparent hover:border-[#D4AF37]/20'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mx-auto" />
              <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em]">Đang nạp tinh hoa...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-32 text-center bg-white/50 rounded-[3rem] border border-[#D4AF37]/10">
              <Tag size={48} className="mx-auto text-[#D4AF37]/20 mb-6" />
              <h3 className="text-2xl font-bold text-[#2F2F2F] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Chưa có bài viết</h3>
              <p className="text-[#2F2F2F]/50">Danh mục này đang được các chuyên gia biên soạn.</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-pointer border border-[#D4AF37]/10 bg-white"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                    <div className="relative h-[300px] lg:h-auto overflow-hidden order-1 lg:order-2">
                      <Image 
                        width={800}
                        height={600}
                        src={featuredPost.image_url || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80'} 
                        alt={featuredPost.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                      />
                    </div>
                    <div className="p-10 md:p-16 flex flex-col justify-center order-2 lg:order-1 bg-white">
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                          <span className="text-[#D4AF37] px-4 py-1.5 border border-[#D4AF37]/30 rounded-full bg-[#D4AF37]/5">
                            {featuredPost.blog_categories?.name || 'Chưa phân loại'}
                          </span>
                          <span className="text-[#2F2F2F]/40 flex items-center gap-1.5"><Clock size={12}/> {featuredPost.read_time || '5 phút'}</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#2F2F2F] leading-[1.1] group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {featuredPost.title}
                        </h2>
                        <p className="text-[#2F2F2F]/60 text-lg leading-relaxed font-medium line-clamp-3">
                          {featuredPost.excerpt}
                        </p>
                        <div className="pt-4">
                          <button className="flex items-center gap-3 text-[#2F2F2F] font-bold text-xs tracking-[0.2em] uppercase group/btn">
                            <span className="border-b-2 border-transparent group-hover/btn:border-[#D4AF37] transition-colors pb-1 group-hover/btn:text-[#D4AF37]">Đọc bài viết</span>
                            <div className="w-8 h-8 rounded-full border border-[#2F2F2F]/20 flex items-center justify-center group-hover/btn:bg-[#D4AF37] group-hover/btn:border-[#D4AF37] group-hover/btn:text-white transition-all">
                              <ArrowRight size={14} />
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Regular Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <AnimatePresence mode='popLayout'>
                  {regularPosts.map((post, idx) => (
                    <motion.div 
                      key={post.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                      className="group cursor-pointer flex flex-col space-y-6"
                    >
                      <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-sm relative border border-transparent hover:border-[#D4AF37]/20 transition-all duration-500">
                        <Image 
                          width={600}
                          height={450}
                          src={post.image_url || 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?auto=format&fit=crop&q=80'} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] shadow-lg">
                          {post.blog_categories?.name}
                        </div>
                      </div>
                      <div className="space-y-4 px-2">
                        <div className="flex items-center gap-3 text-[10px] font-bold text-[#2F2F2F]/40 uppercase tracking-widest">
                          <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                          <span className="w-1 h-1 rounded-full bg-[#D4AF37]/50" />
                          <span className="flex items-center gap-1.5"><Clock size={12}/> {post.read_time || '3 phút'}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-[#2F2F2F] group-hover:text-[#D4AF37] transition-colors leading-snug line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {post.title}
                        </h3>
                        <p className="text-[#2F2F2F]/60 text-sm leading-relaxed font-medium line-clamp-3">
                          {post.excerpt}
                        </p>
                        <button className="text-[10px] font-bold text-[#2F2F2F]/50 uppercase tracking-[0.2em] hover:text-[#D4AF37] transition-colors flex items-center gap-2 pt-2 border-b border-transparent hover:border-[#D4AF37] pb-1 w-fit">
                          Chi tiết <ArrowRight size={12} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Load More Button */}
              <div className="text-center pt-16 border-t border-[#D4AF37]/10">
                <button className="px-10 py-4 border border-[#D4AF37] text-[#D4AF37] rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-white transition-all shadow-sm hover:shadow-xl">
                  Tải thêm ấn phẩm
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

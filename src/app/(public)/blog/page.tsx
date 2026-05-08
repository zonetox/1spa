'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, ArrowRight } from 'lucide-react'

// Mock Data cho Blog
const BLOG_POSTS = [
  {
    id: 1,
    category: 'Xu hướng thẩm mỹ',
    title: 'Kỷ Nguyên Làm Đẹp Không Xâm Lấn 2026: Nét Đẹp Bền Vững Lên Ngôi',
    excerpt: 'Sự dịch chuyển từ phẫu thuật thẩm mỹ sang các công nghệ công nghệ cao (High-tech Beauty) đang định hình lại tiêu chuẩn sắc đẹp toàn cầu. Khám phá những cỗ máy hàng tỷ đồng đang tạo nên cơn sốt tại các spa hạng sang.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80',
    date: '15/05/2026',
    readTime: '5 phút',
    isFeatured: true
  },
  {
    id: 2,
    category: 'Chăm sóc da',
    title: 'Bí quyết duy trì làn da "Pha Lê" sau khi cấy tinh chất',
    excerpt: 'Chăm sóc da sau khi làm liệu trình tại spa quyết định 50% hiệu quả cuối cùng. Chuyên gia da liễu mách bạn 3 nguyên tắc vàng không thể bỏ qua.',
    image: 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?auto=format&fit=crop&q=80',
    date: '12/05/2026',
    readTime: '3 phút'
  },
  {
    id: 3,
    category: 'Nha khoa thẩm mỹ',
    title: 'Sự thật về Dán sứ Veneer siêu mỏng 0.1mm',
    excerpt: 'Liệu dán sứ có đau không? Có ảnh hưởng đến răng thật? Mọi thắc mắc sẽ được giải đáp bởi bác sĩ chuyên khoa cấp II.',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80',
    date: '10/05/2026',
    readTime: '4 phút'
  },
  {
    id: 4,
    category: 'Phong cách sống',
    title: 'Thực đơn 7 ngày thanh lọc cơ thể, trẻ hóa từ bên trong',
    excerpt: 'Vẻ đẹp thực sự bắt nguồn từ sức khỏe. Khám phá chế độ ăn được thiết kế riêng bởi các chuyên gia dinh dưỡng hàng đầu.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80',
    date: '08/05/2026',
    readTime: '6 phút'
  },
  {
    id: 5,
    category: 'Công nghệ',
    title: 'Ultherapy vs Thermage: Đâu là chân ái cho làn da lão hóa?',
    excerpt: 'So sánh chi tiết 2 công nghệ nâng cơ đỉnh cao nhất thế giới hiện nay để giúp bạn có lựa chọn đầu tư nhan sắc thông minh nhất.',
    image: 'https://images.unsplash.com/photo-1570172619644-defd00bb34da?auto=format&fit=crop&q=80',
    date: '05/05/2026',
    readTime: '7 phút'
  },
  {
    id: 6,
    category: 'Chuyên gia chia sẻ',
    title: '5 Dấu hiệu cảnh báo bạn đang chăm sóc da sai cách',
    excerpt: 'Mụn dai dẳng, da sạm màu dù dùng mỹ phẩm đắt tiền? Có thể bạn đang mắc phải những sai lầm tai hại này.',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80',
    date: '01/05/2026',
    readTime: '4 phút'
  },
  {
    id: 7,
    category: 'Trị liệu',
    title: 'Sức mạnh chữa lành của Massage Thụy Điển',
    excerpt: 'Không chỉ là thư giãn, liệu pháp này còn mang lại những lợi ích đáng kinh ngạc cho hệ thần kinh và tuần hoàn máu.',
    image: 'https://images.unsplash.com/photo-1544161515-4af6b1d46af0?auto=format&fit=crop&q=80',
    date: '28/04/2026',
    readTime: '3 phút'
  }
]

export default function BlogPage() {
  const featuredPost = BLOG_POSTS.find(post => post.isFeatured)
  const regularPosts = BLOG_POSTS.filter(post => !post.isFeatured)

  return (
    <main className="min-h-screen pt-32 pb-32" style={{ background: '#F9F6F0' }}>
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto border-b border-[#D4AF37]/20 pb-16">
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

        {/* Featured Post (Asymmetric Vogue Style) */}
        {featuredPost && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-pointer border border-[#D4AF37]/10 bg-white"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] md:min-h-[600px]">
              {/* Image Half */}
              <div className="relative h-[300px] lg:h-full overflow-hidden order-1 lg:order-2">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent lg:block hidden opacity-50" />
              </div>

              {/* Content Half */}
              <div className="p-10 md:p-16 flex flex-col justify-center order-2 lg:order-1 relative z-10 bg-white lg:bg-transparent">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                    <span className="text-[#D4AF37] px-4 py-1.5 border border-[#D4AF37]/30 rounded-full bg-[#D4AF37]/5">{featuredPost.category}</span>
                    <span className="text-[#2F2F2F]/40 flex items-center gap-1.5"><Clock size={12}/> {featuredPost.readTime}</span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2F2F2F] leading-[1.1] group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-[#2F2F2F]/60 text-lg leading-relaxed font-medium">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="pt-8">
                    <button className="flex items-center gap-3 text-[#2F2F2F] font-bold text-xs tracking-[0.2em] uppercase group/btn">
                      <span className="border-b-2 border-transparent group-hover/btn:border-[#D4AF37] transition-colors pb-1 group-hover/btn:text-[#D4AF37]">
                        Đọc toàn bộ bài viết
                      </span>
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
          {regularPosts.map((post, idx) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx + 0.4, duration: 0.8 }}
              className="group cursor-pointer flex flex-col space-y-6"
            >
              <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-sm relative border border-transparent hover:border-[#D4AF37]/20 transition-all duration-500">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] shadow-lg">
                  {post.category}
                </div>
              </div>
              
              <div className="space-y-4 px-2">
                <div className="flex items-center gap-3 text-[10px] font-bold text-[#2F2F2F]/40 uppercase tracking-widest">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-[#D4AF37]/50" />
                  <span className="flex items-center gap-1.5"><Clock size={12}/> {post.readTime}</span>
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
        </div>

        {/* Load More Button */}
        <div className="text-center pt-16 border-t border-[#D4AF37]/10">
          <button className="px-10 py-4 border border-[#D4AF37] text-[#D4AF37] rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-white transition-all shadow-sm hover:shadow-xl">
            Tải thêm ấn phẩm
          </button>
        </div>

      </div>
    </main>
  )
}

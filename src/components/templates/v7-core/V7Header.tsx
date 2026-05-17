'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface V7HeaderProps {
  businessName: string;
  logoUrl: string;
  themeColor?: string;
  navItems?: { label: string; href: string }[];
}

export const V7Header: React.FC<V7HeaderProps> = ({ 
  businessName, 
  logoUrl, 
  themeColor = '#D4AF37',
    navItems = [
    { label: 'Về chúng tôi', href: '#about' },
    { label: 'Dịch vụ', href: '#services' },
    { label: 'Chuyên gia', href: '#team' },
    { label: 'Thư viện', href: '#gallery' },
    { label: 'Đánh giá', href: '#testimonials' },
    { label: 'Liên hệ', href: '#contact' }
  ]
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo - Strong visibility fallback */}
        <Link href="/" className="relative h-12 md:h-14 w-32 md:w-44 flex items-center">
          {logoUrl ? (
            <Image width={800} height={800} src={logoUrl}   
              alt={businessName} 
              className="h-full w-auto object-contain object-left transition-all duration-300 hover:scale-105"
              style={{ 
                filter: logoUrl.toLowerCase().includes('footer') || logoUrl.toLowerCase().includes('white') 
                  ? 'brightness(0) contrast(100%)' 
                  : 'none' 
              }}
             />
          ) : (
            <span className="text-xl md:text-2xl font-serif font-black tracking-tight text-[#1A1A1A]">
              {businessName}
            </span>
          )}
        </Link>

        {/* Navigation - Desktop (Strictly Dark on Light theme) */}
        <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10">
          {navItems.map((item) => (
            <a 
              key={item.label} 
              href={item.href}
              className="text-[11px] font-bold tracking-[0.25em] uppercase transition-all duration-300 text-[#1A1A1A] relative group"
            >
              {item.label}
              <span 
                className="absolute bottom-[-4px] left-0 w-0 h-[1.5px] transition-all duration-300 group-hover:w-full" 
                style={{ backgroundColor: themeColor }}
              />
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <a 
          href="#booking"
          className="premium-button scale-90 md:scale-100 flex items-center justify-center text-white"
          style={{ backgroundColor: themeColor }}
        >
          Đặt lịch ngay
        </a>
      </div>
    </motion.header>
  );
};

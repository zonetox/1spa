'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface TeamMember {
  name: string;
  role: string;
  desc: string;
  img: string;
  origin?: string;
}

interface V7TeamProps {
  title: string;
  subtitle: string;
  team: TeamMember[];
  themeColor?: string;
}

export const V7Team: React.FC<V7TeamProps> = ({ 
  title, 
  subtitle, 
  team = [], 
  themeColor = '#D4AF37' 
}) => {
  return (
    <section id="team" className="editorial-spacing bg-white">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-sm font-medium tracking-[0.3em] uppercase mb-4 block" style={{ color: themeColor }}>
              {subtitle}
            </span>
            <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-[#1A1A1A]">{title}</h2>
          </motion.div>
          <div className="w-24 h-[1px] bg-gray-200 hidden md:block mb-6" />
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group text-center"
            >
              <div className="relative mb-8 inline-block">
                <div 
                  className="w-48 h-48 md:w-64 md:h-64 mx-auto overflow-hidden rounded-full border-2 transition-all duration-700 relative" 
                  style={{ borderColor: `${themeColor}20` }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = themeColor}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = `${themeColor}20`}
                >
                  <Image width={800} height={800} src={member.img}   alt={member.name} className="v7-img-avatar scale-105 group-hover:scale-110 transition-transform duration-1000 object-cover"  />
                </div>
                {member.origin && (
                  <div className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-full shadow-md text-[10px] font-bold uppercase tracking-widest border border-gray-100">
                    {member.origin}
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-sans font-bold tracking-tight text-[#1A1A1A] mb-2">{member.name}</h3>
              <p className="text-sm font-medium uppercase tracking-[0.2em] mb-4" style={{ color: themeColor }}>{member.role}</p>
              <p className="text-gray-500 text-sm font-light leading-relaxed max-w-xs mx-auto italic">
                "{member.desc}"
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

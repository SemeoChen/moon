'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X, Sparkles, ShieldCheck, HeartHandshake, Truck } from 'lucide-react';

const IMAGES = [
  {
    src: '/images/DSC03291.JPG',
    title: '妮邦廚房 Ｘ 歐伯芒果 聯名中秋禮盒',
    desc: '結合甜點師細緻手藝與官田在地芒果巧克力，呈現十足誠意的中秋限定禮盒。'
  },
  {
    src: '/images/DSC03329.JPG',
    title: '芒果恰克 (Mango Dark Chocolate)',
    desc: '台灣在地小農 75% 濃醇黑巧克力 Ｘ 厚實微酸 Q 彈芒果乾，成熟優雅的大人系風味。'
  },
  {
    src: '/images/DSC03330.JPG',
    title: '法式杏仁瓦片 (French Almond Tuiles)',
    desc: '法國發酵奶油與台灣麵粉烘焙，鋪滿滿滿杏仁片，金黃薄脆、堅果香氣濃郁。'
  },
  {
    src: '/images/DSC03335.JPG',
    title: '蜂蜜燕麥餅乾 (Honey Oat Cookies)',
    desc: '純天然蜂蜜、燕麥與蔓越莓果乾，口感扎實散發樸實純粹的天然香氣。'
  },
  {
    src: '/images/DSC03344.JPG',
    title: '手作嚴選 ‧ 減糖低負擔',
    desc: '堅持無人工添加物，接單後新鮮排程製作，佳節饋贈最安心大方。'
  },
  {
    src: '/images/DSC03350.JPG',
    title: '全台 7-11 店到店冷凍配送',
    desc: '店到店冷凍保鮮配送，滿 $5,000 即享免運，預計 9/1 起陸續出貨。'
  }
];

export const ProductGallery: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const prevImage = () => {
    setSelectedIndex((prev) => (prev === 0 ? IMAGES.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setSelectedIndex((prev) => (prev === IMAGES.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full">
      {/* 主圖展示區 */}
      <div className="relative rounded-2xl overflow-hidden shadow-card border border-amber-100 bg-amber-50/30 group">
        <div className="relative aspect-[4/3] w-full bg-stone-900/5">
          <Image
            src={IMAGES[selectedIndex].src}
            alt={IMAGES[selectedIndex].title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center transition-all duration-500 group-hover:scale-105"
            priority
          />
          
          {/* 光暈疊加 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-85" />

          {/* 圖片標題說明 overlay */}
          <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white">
            <div className="flex items-center space-x-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                妮邦廚房 Ｘ 歐伯芒果 聯名禮盒
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-serif font-bold text-amber-50">
              {IMAGES[selectedIndex].title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-lg line-clamp-2">
              {IMAGES[selectedIndex].desc}
            </p>
          </div>

          {/* 放大按鈕 */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 text-white p-2.5 rounded-full backdrop-blur-md transition duration-200 cursor-pointer border border-white/20"
            title="放大全螢幕檢視"
          >
            <Maximize2 className="w-5 h-5" />
          </button>

          {/* 左右切換箭頭 */}
          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-stone-800 p-2 rounded-full shadow-lg transition duration-200 opacity-90 hover:scale-110"
            aria-label="上一張圖片"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-stone-800 p-2 rounded-full shadow-lg transition duration-200 opacity-90 hover:scale-110"
            aria-label="下一張圖片"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 縮圖輪播選擇條 */}
      <div className="grid grid-cols-6 gap-2 sm:gap-3 mt-4">
        {IMAGES.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              selectedIndex === idx
                ? 'border-amber-600 ring-2 ring-amber-400/50 scale-95 shadow-md'
                : 'border-amber-100 opacity-70 hover:opacity-100 hover:border-amber-300'
            }`}
          >
            <Image
              src={img.src}
              alt={img.title}
              fill
              sizes="100px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* 產品品質保證標籤 */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6 p-3 sm:p-4 bg-amber-50/70 rounded-xl border border-amber-200/60 text-center">
        <div className="flex flex-col items-center justify-center p-1.5">
          <ShieldCheck className="w-5 h-5 text-amber-700 mb-1" />
          <span className="text-xs font-bold text-amber-900">官田在地鮮果</span>
          <span className="text-[11px] text-amber-700/80">75%濃醇黑巧克力</span>
        </div>
        <div className="flex flex-col items-center justify-center p-1.5 border-x border-amber-200">
          <Truck className="w-5 h-5 text-amber-700 mb-1" />
          <span className="text-xs font-bold text-amber-900">7-11 冷凍配送</span>
          <span className="text-[11px] text-amber-700/80">滿 $5,000 即免運</span>
        </div>
        <div className="flex flex-col items-center justify-center p-1.5">
          <HeartHandshake className="w-5 h-5 text-amber-700 mb-1" />
          <span className="text-xs font-bold text-amber-900">7-11 貨到付款</span>
          <span className="text-[11px] text-amber-700/80">取貨付款最安心</span>
        </div>
      </div>

      {/* 全螢幕 Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-amber-400 p-2 rounded-full bg-stone-800/80 transition"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full h-[70vh]">
              <Image
                src={IMAGES[selectedIndex].src}
                alt={IMAGES[selectedIndex].title}
                fill
                className="object-contain"
              />
            </div>
            <div className="text-center text-white mt-4 max-w-xl">
              <h4 className="text-xl font-bold font-serif text-amber-300">
                {IMAGES[selectedIndex].title}
              </h4>
              <p className="text-sm text-stone-300 mt-1">
                {IMAGES[selectedIndex].desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

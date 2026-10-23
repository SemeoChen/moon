'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X, Sparkles, Snowflake, ShieldCheck, Truck } from 'lucide-react';
import { ProductImage } from '../data/products';

interface ProductGalleryProps {
  images: ProductImage[];
  badgeText?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  badgeText = '妮邦廚房 Ｘ 歐伯芒果 嚴選出品',
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // 當商品切換時重置回第一張圖
  useEffect(() => {
    setSelectedIndex(0);
  }, [images]);

  const safeImages = images && images.length > 0 ? images : [];
  const currentImg = safeImages[selectedIndex] || safeImages[0];

  if (!currentImg) return null;

  const prevImage = () => {
    setSelectedIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setSelectedIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full">
      {/* 主圖展示區 */}
      <div className="relative rounded-3xl overflow-hidden shadow-card border border-amber-200/80 bg-stone-900 group">
        <div className="relative aspect-[4/3] w-full bg-stone-900">
          <Image
            src={currentImg.src}
            alt={currentImg.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center transition-all duration-500 group-hover:scale-105"
            priority
          />

          {/* 漸層遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

          {/* 圖片標題說明 overlay */}
          <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white">
            <div className="flex items-center space-x-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="text-xs font-bold tracking-wider text-amber-300">
                {badgeText}
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-serif font-bold text-amber-50">
              {currentImg.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-lg line-clamp-2">
              {currentImg.desc}
            </p>
          </div>

          {/* 放大按鈕 */}
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute top-4 right-4 bg-black/45 hover:bg-black/75 text-white p-2.5 rounded-full backdrop-blur-md transition duration-200 cursor-pointer border border-white/20"
            title="放大檢視"
          >
            <Maximize2 className="w-5 h-5" />
          </button>

          {/* 左右切換箭頭 */}
          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-stone-800 p-2 rounded-full shadow-lg transition duration-200 opacity-90 hover:scale-110"
                aria-label="上一張圖片"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-stone-800 p-2 rounded-full shadow-lg transition duration-200 opacity-90 hover:scale-110"
                aria-label="下一張圖片"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* 縮圖輪播選擇條 */}
      {safeImages.length > 1 && (
        <div
          className={`grid gap-2.5 sm:gap-3 mt-3.5 ${
            safeImages.length === 3 ? 'grid-cols-3' : 'grid-cols-4'
          }`}
        >
          {safeImages.map((img, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                selectedIndex === idx
                  ? 'border-amber-600 ring-2 ring-amber-400/50 scale-95 shadow-md'
                  : 'border-amber-100 opacity-70 hover:opacity-100 hover:border-amber-300'
              }`}
            >
              <Image
                src={img.src}
                alt={img.title}
                fill
                sizes="140px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* 產品品質與配送保證標籤 */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5 p-3 sm:p-4 bg-amber-50/80 rounded-2xl border border-amber-200/70 text-center">
        <div className="flex flex-col items-center justify-center p-1">
          <ShieldCheck className="w-5 h-5 text-amber-700 mb-1" />
          <span className="text-xs font-bold text-amber-950">真材實料手作</span>
          <span className="text-[11px] text-amber-800/80">陽光熟成芒果X黑巧</span>
        </div>
        <div className="flex flex-col items-center justify-center p-1 border-x border-amber-200">
          <Snowflake className="w-5 h-5 text-sky-600 mb-1" />
          <span className="text-xs font-bold text-amber-950">7-11 冷凍交貨便</span>
          <span className="text-[11px] text-amber-800/80">溫層固定：冷凍配送</span>
        </div>
        <div className="flex flex-col items-center justify-center p-1">
          <Truck className="w-5 h-5 text-amber-700 mb-1" />
          <span className="text-xs font-bold text-amber-950">揪團湊單免運</span>
          <span className="text-[11px] text-amber-800/80">滿 $3,000 (12盒) 免運</span>
        </div>
      </div>

      {/* 全螢幕 Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-amber-400 p-2 rounded-full bg-stone-800/80 transition"
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[70vh]">
              <Image
                src={currentImg.src}
                alt={currentImg.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="text-center text-white mt-4 max-w-xl">
              <h4 className="text-xl font-bold font-serif text-amber-300">
                {currentImg.title}
              </h4>
              <p className="text-sm text-stone-300 mt-1">{currentImg.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { ProductGallery } from '../components/ProductGallery';
import { OrderForm } from '../components/OrderForm';
import {
  PRODUCT_CATEGORIES,
  PRODUCTS,
  DEFAULT_FEATURED_PRODUCT_ID,
  ProductCategoryId,
  ProductItem,
} from '../data/products';
import {
  Sparkles,
  Truck,
  Gift,
  Snowflake,
  Flame,
  CheckCircle2,
  Settings,
  X,
  AlertTriangle,
  Construction,
  ShoppingBag,
  ChevronRight,
  Star,
} from 'lucide-react';

const FEATURED_STORAGE_KEY = 'nibang_featured_product_id';

export default function Home() {
  // 管理者設定之目前主打商品 ID (預設為芒果恰克 'mango-choker')
  const [featuredProductId, setFeaturedProductId] = useState<string>(
    DEFAULT_FEATURED_PRODUCT_ID
  );
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<ProductCategoryId>('mango');
  const [selectedProductId, setSelectedProductId] = useState<string>(
    DEFAULT_FEATURED_PRODUCT_ID
  );
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);

  // 僅顯示未隱藏之商品分類與商品（目前隱藏蛋糕類與餅乾類）
  const visibleCategories = useMemo(
    () => PRODUCT_CATEGORIES.filter((cat) => !cat.hidden),
    []
  );
  const visibleProducts = useMemo(() => {
    const visibleCatIds = new Set(visibleCategories.map((c) => c.id));
    return PRODUCTS.filter((p) => visibleCatIds.has(p.categoryId));
  }, [visibleCategories]);

  // 讀取 localStorage 中管理者設定的主打商品
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FEATURED_STORAGE_KEY);
      if (saved && visibleProducts.some((p) => p.id === saved)) {
        setFeaturedProductId(saved);
        const found = visibleProducts.find((p) => p.id === saved);
        if (found) {
          setSelectedCategoryId(found.categoryId);
          setSelectedProductId(found.id);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, [visibleProducts]);

  const featuredProduct: ProductItem = useMemo(() => {
    return (
      visibleProducts.find((p) => p.id === featuredProductId) ||
      visibleProducts[0] ||
      PRODUCTS[0]
    );
  }, [featuredProductId, visibleProducts]);

  const currentCategoryProducts = useMemo(() => {
    return visibleProducts.filter((p) => p.categoryId === selectedCategoryId);
  }, [selectedCategoryId, visibleProducts]);

  const selectedProduct: ProductItem = useMemo(() => {
    return (
      visibleProducts.find((p) => p.id === selectedProductId) || featuredProduct
    );
  }, [selectedProductId, featuredProduct, visibleProducts]);

  // 切換大分類頁籤
  const handleSelectCategory = (catId: ProductCategoryId) => {
    setSelectedCategoryId(catId);
    const prodsInCat = visibleProducts.filter((p) => p.categoryId === catId);
    // 若該分類包含目前主打商品則優先選取主打商品，否則選第一個
    const featuredInCat = prodsInCat.find((p) => p.id === featuredProductId);
    if (featuredInCat) {
      setSelectedProductId(featuredInCat.id);
    } else if (prodsInCat.length > 0) {
      setSelectedProductId(prodsInCat[0].id);
    }
  };

  // 直接切換指定商品
  const handleSelectProduct = (prod: ProductItem) => {
    setSelectedCategoryId(prod.categoryId);
    setSelectedProductId(prod.id);
  };

  // 管理者變更目前主打商品
  const handleSaveFeaturedProduct = (newProductId: string) => {
    setFeaturedProductId(newProductId);
    try {
      localStorage.setItem(FEATURED_STORAGE_KEY, newProductId);
    } catch {
      // ignore
    }
    const target = PRODUCTS.find((p) => p.id === newProductId);
    if (target) {
      setSelectedCategoryId(target.categoryId);
      setSelectedProductId(target.id);
    }
    setAdminModalOpen(false);
  };

  const scrollToOrder = () => {
    const el = document.getElementById('order-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-moon-pattern flex flex-col">
      {/* 頂部 Header 導覽列 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div
            onClick={() => handleSelectProduct(featuredProduct)}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-300 shadow-md shrink-0 bg-amber-50">
              <Image
                src="/images/LOGO.png"
                alt="妮邦廚房 Ｘ 歐伯芒果 LOGO"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-serif font-bold text-amber-950 tracking-tight">
                妮邦廚房 Ｘ 歐伯芒果
              </h1>
              <p className="text-xs text-amber-800 font-medium">
                產品線上訂購系統 ‧ 7-11 冷凍交貨便
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* 管理者設定主打商品按鈕 */}
            <button
              type="button"
              onClick={() => setAdminModalOpen(true)}
              className="px-3 py-2 text-xs font-bold text-stone-600 hover:text-amber-900 bg-stone-100 hover:bg-amber-100/80 rounded-full transition flex items-center space-x-1 cursor-pointer"
              title="管理員設定目前主打商品"
            >
              <Settings className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">主打設定</span>
            </button>

            <button
              type="button"
              onClick={scrollToOrder}
              className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-serif font-bold text-xs sm:text-sm rounded-full shadow-md hover:shadow-glow transition cursor-pointer flex items-center space-x-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-amber-200" />
              <span>立即預訂</span>
            </button>
          </div>
        </div>
      </header>

      {/* 商品分類頁籤導覽區 (芒果類 / 蛋糕類 / 餅乾類) */}
      <section className="bg-gradient-to-b from-amber-100/70 via-amber-50/50 to-transparent pt-6 pb-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
          {/* 目前主打商品提示橫幅 */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-amber-50 px-4 py-2.5 rounded-2xl shadow-md">
            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <span className="inline-flex items-center space-x-1 bg-red-600 text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>目前主打商品</span>
              </span>
              <span className="font-serif font-bold text-amber-200 text-sm sm:text-base">
                {featuredProduct.name}
              </span>
              <span className="hidden md:inline text-amber-200/90 text-xs">
                — {featuredProduct.subtitle}
              </span>
            </div>
            {selectedProduct.id !== featuredProduct.id && (
              <button
                type="button"
                onClick={() => handleSelectProduct(featuredProduct)}
                className="text-xs font-bold bg-amber-300 hover:bg-amber-200 text-amber-950 px-3 py-1 rounded-full transition flex items-center space-x-1 cursor-pointer"
              >
                <span>切換至主打「{featuredProduct.name}」</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 第一層：商品類別頁籤 (目前僅顯示芒果類，蛋糕類與餅乾類暫時隱藏) */}
          <div
            className={`grid gap-2.5 sm:gap-4 ${
              visibleCategories.length === 1
                ? 'grid-cols-1'
                : visibleCategories.length === 2
                ? 'grid-cols-2'
                : 'grid-cols-3'
            }`}
          >
            {visibleCategories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-amber-600 shadow-md ring-2 ring-amber-400/40'
                      : 'bg-white/70 border-amber-200/80 hover:bg-white hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-base sm:text-xl font-serif font-bold text-amber-950">
                      {cat.name}
                    </span>
                    <span
                      className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold shrink-0 ${
                        cat.isUnderConstruction
                          ? 'bg-stone-200 text-stone-700'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-stone-600 mt-1 line-clamp-1">
                    {cat.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* 第二層：該類別下的細項商品頁籤 */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-stone-500 mr-1">
              選擇品項：
            </span>
            {currentCategoryProducts.map((prod) => {
              const isSelected = selectedProduct.id === prod.id;
              const isFeatured = prod.id === featuredProductId;
              return (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => handleSelectProduct(prod)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-900 text-white border-amber-900 shadow-sm'
                      : 'bg-white text-stone-700 border-amber-200 hover:border-amber-400 hover:bg-amber-50'
                  }`}
                >
                  {isFeatured && (
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                  )}
                  <span>{prod.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      prod.status === 'available'
                        ? isSelected
                          ? 'bg-red-500 text-white'
                          : 'bg-red-100 text-red-700'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {prod.statusBadgeText}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 商品詳細介紹與視覺區塊 */}
      <section className="py-6 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* 左欄：商品圖片畫廊 */}
            <div className="lg:col-span-6">
              <ProductGallery
                images={selectedProduct.images}
                badgeText={`${selectedProduct.categoryName} ‧ ${selectedProduct.name}`}
              />
            </div>

            {/* 右欄：商品詳細介紹、特色、吃法、價格與滿額免運階梯 */}
            <div className="lg:col-span-6 space-y-5 bg-white/90 p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-card">
              {/* 狀態與分類標籤 */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedProduct.id === featuredProductId && (
                  <span className="inline-flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    <Flame className="w-3.5 h-3.5" />
                    <span>目前主打商品</span>
                  </span>
                )}
                <span className="inline-flex items-center space-x-1 bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold">
                  <span>{selectedProduct.categoryName}</span>
                </span>
                <span
                  className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${
                    selectedProduct.status === 'available'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : selectedProduct.status === 'sold_out'
                      ? 'bg-stone-200 text-stone-700 border border-stone-300'
                      : 'bg-amber-50 text-amber-800 border border-amber-300'
                  }`}
                >
                  <span>{selectedProduct.statusBadgeText}</span>
                </span>
              </div>

              {/* 商品名稱與副標 */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-serif font-black text-amber-950">
                  {selectedProduct.name}
                </h2>
                <p className="text-xs sm:text-sm text-amber-800 font-semibold mt-1">
                  {selectedProduct.subtitle}
                </p>
              </div>

              {/* 若為已完售或建置中，顯示醒目提示卡 */}
              {selectedProduct.status === 'sold_out' && (
                <div className="p-4 bg-stone-100 border-2 border-stone-300 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 text-stone-800 font-bold text-base">
                    <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                    <span>本年度已銷售完畢</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600">
                    感謝大家對「{selectedProduct.name}」的熱烈支持，本年度產量已全數銷售完畢！推薦您選購使用官田陽光熟成芒果乾製作的目前主打商品「{featuredProduct.name}」。
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSelectProduct(featuredProduct)}
                    className="mt-1 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl transition cursor-pointer inline-flex items-center space-x-1"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-300" />
                    <span>立即前往主打商品：{featuredProduct.name}</span>
                  </button>
                </div>
              )}

              {selectedProduct.status === 'coming_soon' && (
                <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 text-amber-950 font-bold text-base">
                    <Construction className="w-5 h-5 text-amber-700 shrink-0" />
                    <span>{selectedProduct.categoryName}（建置中）</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700">
                    「{selectedProduct.name}」訂購頁面目前建置中！歡迎先選購目前限時優惠主打的「{featuredProduct.name}」。
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSelectProduct(featuredProduct)}
                    className="mt-1 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl transition cursor-pointer inline-flex items-center space-x-1"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-300" />
                    <span>前往預訂主打商品：{featuredProduct.name}</span>
                  </button>
                </div>
              )}

              {/* 主標題與文案介紹 */}
              <div className="space-y-3 border-l-4 border-amber-500 pl-4 py-1 bg-amber-50/40 rounded-r-xl">
                <p className="text-base sm:text-lg font-serif font-bold text-amber-950 leading-snug">
                  {selectedProduct.headline}
                </p>
                {selectedProduct.description.map((para, idx) => (
                  <p
                    key={idx}
                    className="text-xs sm:text-sm text-stone-700 leading-relaxed"
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* 三大產品亮點 */}
              <div className="space-y-2.5">
                {selectedProduct.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-2.5 bg-stone-50/80 p-3 rounded-xl border border-stone-200/80"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm">
                      <span className="font-bold text-amber-950">
                        {feat.title}：
                      </span>
                      <span className="text-stone-700">{feat.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 私房美味吃法 (若有) */}
              {selectedProduct.secretTip && (
                <div className="p-4 bg-gradient-to-r from-sky-50 to-indigo-50/60 border border-sky-200 rounded-2xl space-y-1">
                  <div className="text-xs sm:text-sm font-bold text-sky-900 flex items-center space-x-1.5">
                    <Snowflake className="w-4 h-4 text-sky-600" />
                    <span>{selectedProduct.secretTip.title}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-sky-950 leading-relaxed">
                    {selectedProduct.secretTip.content}
                  </p>
                </div>
              )}

              {/* 價格與限時滿額免運資訊卡 (針對可購買商品) */}
              {selectedProduct.price && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50/80 p-5 rounded-2xl border-2 border-amber-300 space-y-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-amber-200 pb-3">
                    <div>
                      <span className="text-xs font-bold text-red-600 block">
                        🔥 限時滿額免運優惠 🔥
                      </span>
                      <div className="flex items-baseline space-x-2 mt-0.5">
                        {selectedProduct.originalPrice && (
                          <span className="text-sm text-stone-500 line-through">
                            原價 ${selectedProduct.originalPrice}/{selectedProduct.unit}
                          </span>
                        )}
                        <span className="text-2xl sm:text-3xl font-serif font-black text-red-700">
                          現在只要 ${selectedProduct.price}元
                        </span>
                        <span className="text-xs font-bold text-amber-950">
                          / {selectedProduct.unit}
                        </span>
                      </div>
                    </div>

                    {selectedProduct.status === 'available' && (
                      <button
                        type="button"
                        onClick={scrollToOrder}
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-serif font-bold text-sm rounded-xl shadow-md transition cursor-pointer flex items-center space-x-1.5"
                      >
                        <Gift className="w-4 h-4 text-amber-300" />
                        <span>立即填單訂購</span>
                      </button>
                    )}
                  </div>

                  {selectedProduct.shippingNote && (
                    <div className="flex items-start space-x-2 text-xs sm:text-sm text-amber-950 font-medium">
                      <Truck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>{selectedProduct.shippingNote}</span>
                    </div>
                  )}

                  {selectedProduct.shippingTiers && (
                    <div className="bg-white/90 p-3.5 rounded-xl border border-amber-200 space-y-2">
                      <div className="text-xs font-bold text-amber-950">
                        🎁 揪團湊單更划算（7-11 冷凍交貨便階梯運費）：
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-stone-700">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-amber-600">🔹</span>
                          <span>未滿千元運費：<strong>$120</strong></span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-amber-600">🔹</span>
                          <span>滿 $1,000（4盒）：<strong>運費 $100</strong></span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-amber-600">🔹</span>
                          <span>滿 $2,000（8盒）：<strong>運費 $80</strong></span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-red-700 font-bold">
                          <span>🔹</span>
                          <span>滿 $3,000（12盒）：免運費 ($0)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 全品項總覽快速切換區 */}
      <section className="py-10 bg-white/80 border-y border-amber-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-950">
                全系列商品一覽
              </h3>
              <p className="text-xs text-stone-600">
                點擊任一商品卡片即可查看詳細介紹與價格狀態
              </p>
            </div>
            <div className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-full self-start sm:self-auto">
              目前主打：{featuredProduct.name}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {/* 芒果類卡片 */}
            <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 space-y-3">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <h4 className="font-serif font-bold text-lg text-amber-950">
                  🥭 芒果類
                </h4>
                <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">
                  熱銷主打
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs sm:text-sm">
                {PRODUCTS.filter((p) => p.categoryId === 'mango').map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectProduct(p)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                      selectedProduct.id === p.id
                        ? 'bg-amber-900 text-white border-amber-900 font-bold'
                        : 'bg-white text-stone-800 border-amber-200 hover:bg-amber-100/60'
                    }`}
                  >
                    <span className="flex items-center space-x-1.5">
                      {p.id === featuredProductId && (
                        <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                      <span>{p.name}</span>
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full ${
                        p.status === 'available'
                          ? 'bg-red-100 text-red-700 font-bold'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {p.status === 'available'
                        ? `$${p.price}/${p.unit}`
                        : p.statusBadgeText}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 線上訂購表單區 */}
      <section className="py-12 md:py-16 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <OrderForm
          selectedProduct={
            selectedProduct.status === 'available'
              ? selectedProduct
              : featuredProduct
          }
          onSelectProductById={(id) => {
            const found = PRODUCTS.find((p) => p.id === id);
            if (found) handleSelectProduct(found);
          }}
        />
      </section>

      {/* 手機版底部固定預訂按鈕 */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-amber-300 p-3 shadow-2xl flex items-center justify-between">
        <div className="text-left pl-2">
          <div className="text-[11px] text-red-600 font-bold">
            主打：{featuredProduct.name} (滿$3,000免運)
          </div>
          <div className="text-base font-bold text-amber-900 font-serif">
            NT$ {featuredProduct.price || 250}{' '}
            <span className="text-xs font-normal text-stone-500 line-through">
              ${featuredProduct.originalPrice || 280}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            handleSelectProduct(featuredProduct);
            scrollToOrder();
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center space-x-1 cursor-pointer"
        >
          <Gift className="w-4 h-4 text-amber-200" />
          <span>立即訂購</span>
        </button>
      </div>

      {/* 管理者設定目前主打商品 Modal */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-200 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-serif font-bold text-amber-950">
                  管理者設定：設定目前主打商品
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAdminModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              請選擇要設為「目前主打商品」的品項（系統預設為「芒果恰克」）：
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {visibleProducts.map((prod) => {
                const isCurrentFeatured = prod.id === featuredProductId;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleSaveFeaturedProduct(prod.id)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                      isCurrentFeatured
                        ? 'bg-amber-100 border-amber-600 font-bold text-amber-950'
                        : 'bg-stone-50 border-stone-200 hover:bg-amber-50/60 text-stone-700'
                    }`}
                  >
                    <div>
                      <div className="text-sm flex items-center space-x-1.5">
                        <span>
                          [{prod.categoryName}] {prod.name}
                        </span>
                        {prod.defaultFeatured && (
                          <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                            預設主打
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        狀態：{prod.statusBadgeText}
                      </div>
                    </div>
                    {isCurrentFeatured && (
                      <span className="text-xs bg-amber-800 text-white px-2.5 py-1 rounded-full">
                        目前主打
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setAdminModalOpen(false)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl cursor-pointer"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 頁尾 Footer */}
      <footer className="mt-auto bg-amber-950 text-amber-100 py-8 pb-24 md:pb-8 border-t-4 border-amber-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-amber-200">
              妮邦廚房 Ｘ 歐伯芒果 產品訂購系統
            </span>
            <span className="text-amber-500">|</span>
            <span>一律採用 7-11 冷凍交貨便配送</span>
          </div>
          <div className="text-amber-300/80 text-xs">
            © {new Date().getFullYear()} 妮邦廚房 X 歐伯芒果 All Rights Reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}

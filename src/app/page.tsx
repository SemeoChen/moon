'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductGallery } from '../components/ProductGallery';
import { OrderForm } from '../components/OrderForm';
import {
  Sparkles,
  Award,
  Truck,
  PhoneCall,
  ChevronDown,
  Gift,
  HelpCircle,
  Clock,
  Heart,
  Cookie,
  Flame,
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const scrollToOrder = () => {
    const el = document.getElementById('order-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-moon-pattern flex flex-col">
      {/* 頂部 Header / 導覽列 */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-200/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-300 shadow-md shrink-0 bg-amber-100">
              <Image
                src="/images/LOGO.png"
                alt="妮邦廚房 Ｘ 歐伯芒果"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-serif font-bold text-amber-950 tracking-tight">
                妮邦廚房 Ｘ 歐伯芒果
              </h1>
              <p className="text-xs text-amber-700 font-medium">
                2026 中秋聯名禮盒預購系統
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-6">
            <a
              href="tel:0989518831"
              className="hidden md:flex items-center space-x-2 text-stone-700 hover:text-amber-800 transition text-sm font-semibold"
            >
              <PhoneCall className="w-4 h-4 text-amber-700" />
              <span>預訂專線 0989518831</span>
            </a>
            <button
              onClick={scrollToOrder}
              className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-serif font-bold text-xs sm:text-sm rounded-full shadow-md hover:shadow-glow transition cursor-pointer"
            >
              立即線上預訂
            </button>
          </div>
        </div>
      </header>

      {/* Hero 佳節主題 Banner */}
      <section className="relative overflow-hidden pt-10 pb-14 md:py-20 bg-gradient-to-b from-amber-100/60 via-amber-50/40 to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* 文案區 */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-amber-100/90 border border-amber-300 text-amber-900 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                <span>首次跨界聯名 ‧ 手工限量預訂開跑</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-amber-950 leading-tight">
                妮邦廚房 Ｘ 歐伯芒果<br />
                <span className="text-amber-700 font-serif">用真材實料，送出一份真誠的心意</span>
              </h2>

              <p className="text-sm sm:text-base text-stone-700 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                今年中秋很不一樣，妮邦廚房 Ｘ 歐伯芒果 首次合作推出限量聯名禮盒。結合甜點師的細緻手藝，與官田在地馥郁果香的芒果巧克力，呈現出十足誠心誠意的中秋禮盒。
              </p>

              {/* 折扣亮點卡片 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white/80 p-3.5 rounded-2xl border border-amber-200 shadow-sm text-center">
                  <div className="text-xs text-stone-500 font-medium">聯名禮盒原價</div>
                  <div className="text-lg font-bold text-stone-800 line-through">NT$ 692</div>
                  <div className="text-[11px] text-amber-700">精緻典藏包裝</div>
                </div>
                <div className="bg-gradient-to-b from-amber-50 to-amber-100/80 p-3.5 rounded-2xl border-2 border-amber-400 shadow-sm text-center">
                  <div className="text-xs font-bold text-amber-800">1~4 盒早鳥 9 折</div>
                  <div className="text-xl font-black text-amber-700 font-serif">NT$ 622</div>
                  <div className="text-[11px] text-amber-800">特惠 $622 / 盒</div>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-gradient-to-b from-amber-600 to-amber-800 text-white p-3.5 rounded-2xl shadow-md text-center">
                  <div className="text-xs font-bold text-amber-200">5~8 盒早鳥 85 折</div>
                  <div className="text-xl font-black font-serif text-white">NT$ 588</div>
                  <div className="text-[11px] text-amber-200">特惠 $588 / 盒</div>
                </div>
              </div>

              {/* 7-11 冷凍免運標籤 */}
              <div className="p-3 bg-amber-100/80 border border-amber-300 rounded-xl text-amber-900 text-xs sm:text-sm font-semibold flex items-center justify-center lg:justify-start space-x-2">
                <Truck className="w-5 h-5 text-amber-700 shrink-0" />
                <span>全台 7-11 店到店冷凍配送！單筆訂單滿 <strong>$5,000 即享免運</strong>（預計 9/1 順序陸續出貨）</span>
              </div>

              {/* 行動按鈕 */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <button
                  onClick={scrollToOrder}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-serif font-bold text-base rounded-2xl shadow-xl hover:shadow-glow transition duration-200 flex items-center justify-center space-x-2 border border-amber-300/30 cursor-pointer"
                >
                  <Gift className="w-5 h-5 text-amber-300" />
                  <span>立即預訂享早鳥價</span>
                </button>
                
                <a
                  href="tel:0989518831"
                  className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-bold text-sm rounded-2xl transition shadow-sm flex items-center justify-center space-x-2"
                >
                  <PhoneCall className="w-4 h-4 text-amber-700" />
                  <span>大量訂購請另洽 0989518831</span>
                </a>
              </div>
            </div>

            {/* 相片畫廊 Preview */}
            <div className="lg:col-span-5">
              <ProductGallery />
            </div>
          </div>
        </div>
      </section>

      {/* 3 大聯名禮盒內容特色區 */}
      <section className="py-14 bg-white border-y border-amber-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-950">
              中秋聯名禮盒內容（原價 $692／盒）
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 font-medium">
              這一次就把今年最真摯的心意，好好裝進一盒手作甜點裡。（手工限量製作，售完為止）
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. 法式杏仁瓦片 */}
            <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-200 shadow-sm space-y-3 relative overflow-hidden group hover:border-amber-400 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-200/80 text-amber-900 flex items-center justify-center font-serif font-bold text-xl">
                1
              </div>
              <h4 className="text-xl font-serif font-bold text-amber-950 flex items-center space-x-2">
                <Cookie className="w-5 h-5 text-amber-700" />
                <span>法式杏仁瓦片</span>
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                嚴選新鮮雞蛋、法國發酵奶油與台灣在地麵粉，鋪上滿滿杏仁片手工細烤。薄脆金黃、堅果香氣濃郁，入口輕盈酥脆，越嚼越香。
              </p>
              <div className="pt-2 text-xs font-semibold text-amber-800">
                ✨ 薄脆金黃 ‧ 越嚼越香
              </div>
            </div>

            {/* 2. 芒果恰克 */}
            <div className="bg-amber-50/50 p-6 rounded-3xl border-2 border-amber-300 shadow-md space-y-3 relative overflow-hidden group hover:border-amber-500 transition duration-300">
              <div className="absolute top-3 right-3 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                官田在地果香
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-serif font-bold text-xl shadow">
                2
              </div>
              <h4 className="text-xl font-serif font-bold text-amber-950 flex items-center space-x-2">
                <Flame className="w-5 h-5 text-amber-700" />
                <span>芒果恰克</span>
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                選用台灣在地小農75% 濃醇黑巧克力，巧搭厚實微酸、Q 彈有勁的芒果乾。深邃苦甜與自然果酸在舌尖交織，是成熟優雅的大人系風味。
              </p>
              <div className="pt-2 text-xs font-semibold text-amber-800">
                ✨ 75%黑巧 Ｘ 官田芒果乾
              </div>
            </div>

            {/* 3. 蜂蜜燕麥餅乾 */}
            <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-200 shadow-sm space-y-3 relative overflow-hidden group hover:border-amber-400 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-200/80 text-amber-900 flex items-center justify-center font-serif font-bold text-xl">
                3
              </div>
              <h4 className="text-xl font-serif font-bold text-amber-950 flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-700" />
                <span>蜂蜜燕麥餅乾</span>
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                以純天然蜂蜜、燕麥與優質奶油為基底，拌入嚴選天然果乾與蔓越莓，層次豐富、口感扎實，散發樸實純粹的自然香氣。
              </p>
              <div className="pt-2 text-xs font-semibold text-amber-800">
                ✨ 天然蜂蜜 Ｘ 蔓越莓燕麥
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 配送與出貨說明卡片 */}
      <section className="py-10 bg-amber-100/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-4">
            <h4 className="text-lg font-serif font-bold text-amber-950 flex items-center space-x-2 border-b border-amber-100 pb-2">
              <Truck className="w-5 h-5 text-amber-700" />
              <span>配送與出貨說明</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-stone-700">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span>全台 7-11 店到店冷凍配送（運費 $129）</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span>單筆訂單滿 <strong>$5,000 即享免運</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span>預計 <strong>9/1 順序陸續出貨</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span>妮邦廚房依法免開統一發票</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 價格比較與訂購區 */}
      <section className="py-14 md:py-20 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-serif font-bold text-amber-950">
            中秋聯名禮盒線上預訂
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            請輸入取件人姓名、手機號碼與 7-11 門市店號，通過圖形驗證即可成功送出預訂。
          </p>
        </div>

        {/* 訂購表單 Component */}
        <OrderForm />
      </section>

      {/* 常見問題 FAQ 區塊 */}
      <section className="py-12 bg-amber-50/60 border-t border-amber-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-serif font-bold text-amber-950 flex items-center justify-center space-x-2">
              <HelpCircle className="w-6 h-6 text-amber-700" />
              <span>中秋聯名預購常見問題</span>
            </h3>
          </div>

          <div className="space-y-4">
            {[
              {
                q: '請問妮邦廚房 Ｘ 歐伯芒果聯名禮盒包含哪些內容？',
                a: '聯名禮盒包含三款嚴選頂級手作糕點：1. 法式杏仁瓦片（薄脆金黃、堅果濃香）、2. 芒果恰克（官田在地75%黑巧克力與芒果乾）、3. 蜂蜜燕麥餅乾（天然蜂蜜、燕麥與蔓越莓）。'
              },
              {
                q: '請問早鳥優惠折扣與免運門檻如何計算？',
                a: '聯名禮盒原價 $692/盒。預訂 1~4 盒享早鳥 9 折 ($622/盒)；5~8 盒享早鳥 85 折 ($588/盒)。全台 7-11 冷凍運費 $129，單筆訂單滿 $5,000 即享全台免運！'
              },
              {
                q: '配送與出貨日程為何？',
                a: '商品預計於 9/1 起依照訂單順序陸續出貨。全台採用 7-ELEVEN 店到店冷凍配送，付費方式為 7-11 貨到付款 (到付)。'
              },
              {
                q: '發票與大量企業訂購問題？',
                a: '妮邦廚房依法為小規模營業人免開統一發票，如需報帳收據可於表單中勾選「免用統一發票收據」。超過 8 盒的大量訂購，歡迎直接致電預訂專線：0989518831。'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left font-bold text-amber-950 flex items-center justify-between hover:bg-amber-50/50 transition"
                >
                  <span className="text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-amber-700 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-sm text-stone-600 border-t border-amber-100 leading-relaxed bg-amber-50/30">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 手機版底部固定預訂按鈕 (Mobile Sticky Floating CTA Bar) */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-amber-300 p-3 shadow-2xl flex items-center justify-between">
        <div className="text-left pl-2">
          <div className="text-[11px] text-stone-500">早鳥特惠價 (滿$5000免運)</div>
          <div className="text-base font-bold text-amber-700 font-serif">
            NT$ 622 <span className="text-xs font-normal text-stone-600">/ 盒起</span>
          </div>
        </div>
        <button
          onClick={scrollToOrder}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center space-x-1"
        >
          <Gift className="w-4 h-4 text-amber-200" />
          <span>立即線上預訂</span>
        </button>
      </div>

      {/* 頁尾 Footer */}
      <footer className="mt-auto bg-amber-950 text-amber-100 py-10 pb-24 md:pb-10 border-t-4 border-amber-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between text-center md:text-left space-y-6 md:space-y-0">
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber-400 shrink-0 bg-amber-100">
              <Image
                src="/images/LOGO.png"
                alt="妮邦廚房 Ｘ 歐伯芒果"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <div>
              <div className="text-lg font-serif font-bold text-white">
                妮邦廚房 Ｘ 歐伯芒果 中秋聯名禮盒
              </div>
              <p className="text-xs text-amber-300/80 mt-0.5">
                這一次就把今年最真摯的心意，好好裝進一盒手作甜點裡。
              </p>
            </div>
          </div>

          <div className="text-xs text-amber-200/90 space-y-1">
            <div>預訂與客服專線：<a href="tel:0989518831" className="font-bold underline text-amber-300">0989518831</a></div>
            <div>配送方式：全台 7-11 店到店冷凍配送 (滿 $5,000 免運)</div>
          </div>
        </div>
      </footer>
    </main>
  );
}

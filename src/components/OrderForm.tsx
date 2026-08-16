'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Captcha } from './Captcha';
import { OrderFormData } from '../types/order';
import sevenElevenStoresData from '@/data/sevenElevenStores.json';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Calendar,
  UserCheck,
  PhoneCall,
  AlertCircle,
  Loader2,
  Sparkles,
  ExternalLink,
  Store,
  FileText,
  MapPin,
  Building2
} from 'lucide-react';

const ORIGINAL_PRICE = 692; // 原價
const DISCOUNT_1_4 = 622;   // 1~4 盒 9 折
const DISCOUNT_5_8 = 588;   // 5~8 盒 85 折
const SHIPPING_FEE = 129;   // 7-11 冷凍配送運費
const FREE_SHIPPING_THRESHOLD = 5000; // 滿 $5,000 免運費

interface StoreItem {
  id: string;
  name: string;
  rawName: string;
  address: string;
}

type StoreDataset = Record<string, Record<string, StoreItem[]>>;
const STORES_DB = sevenElevenStoresData as StoreDataset;

export const OrderForm: React.FC = () => {
  // 配送方式：'7-11' (店到店) 或 'self_pickup' (現場自取)
  const [deliveryMethod, setDeliveryMethod] = useState<'7-11' | 'self_pickup'>('7-11');

  // 盒數與訂購細節
  const [quantity, setQuantity] = useState<number>(1);

  // 取件人資訊
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientPhone, setRecipientPhone] = useState<string>('');

  // 7-11 門市三級選單 (縣市, 行政區, 門市)
  const cityList = useMemo(() => Object.keys(STORES_DB), []);
  const [selectedCity, setSelectedCity] = useState<string>('臺北市');

  const districtList = useMemo(() => {
    return STORES_DB[selectedCity] ? Object.keys(STORES_DB[selectedCity]) : [];
  }, [selectedCity]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('信義區');

  const storeOptions = useMemo(() => {
    if (STORES_DB[selectedCity] && STORES_DB[selectedCity][selectedDistrict]) {
      return STORES_DB[selectedCity][selectedDistrict];
    }
    return [];
  }, [selectedCity, selectedDistrict]);

  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [storeCode, setStoreCode] = useState<string>('');
  const [storeName, setStoreName] = useState<string>('');
  const [storeAddress, setStoreAddress] = useState<string>('');

  // 配送與備註
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [needReceipt, setNeedReceipt] = useState<boolean>(false);
  const [receiptTitle, setReceiptTitle] = useState<string>('');

  // 圖形驗證碼
  const [correctCaptcha, setCorrectCaptcha] = useState<string>('');
  const [captchaInput, setCaptchaInput] = useState<string>('');

  // 提交狀態與彈窗
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<{
    orderId: string;
    totalAmount: number;
    orderAmount: number;
    shippingFee: number;
    quantity: number;
    deliveryMethod: '7-11' | 'self_pickup';
    recipientName: string;
    recipientPhone: string;
    storeCode: string;
    storeName: string;
    storeAddress: string;
    expectedDeliveryDate: string;
  } | null>(null);

  // 當縣市變更時，自動更新行政區
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = e.target.value;
    setSelectedCity(newCity);
    const districts = STORES_DB[newCity] ? Object.keys(STORES_DB[newCity]) : [];
    if (districts.length > 0) {
      setSelectedDistrict(districts[0]);
    }
  };

  // 當行政區或縣市變更時，自動預設第一間門市
  useEffect(() => {
    if (deliveryMethod === '7-11') {
      if (storeOptions && storeOptions.length > 0) {
        const firstStore = storeOptions[0];
        setSelectedStoreId(firstStore.id);
        setStoreCode(firstStore.id);
        setStoreName(firstStore.name);
        setStoreAddress(firstStore.address);
      } else {
        setSelectedStoreId('');
        setStoreCode('');
        setStoreName('');
        setStoreAddress('');
      }
    }
  }, [storeOptions, deliveryMethod]);

  // 當選擇門市選單改變時，自動寫入代碼與店名
  const handleStoreSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetId = e.target.value;
    setSelectedStoreId(targetId);
    const found = storeOptions.find((s) => s.id === targetId);
    if (found) {
      setStoreCode(found.id);
      setStoreName(found.name);
      setStoreAddress(found.address);
    }
  };

  // 自動計算單價、商品金額、運費與最終總額
  const pricingInfo = useMemo(() => {
    let unitPrice = ORIGINAL_PRICE;
    let discountText = '原價';

    if (quantity >= 1 && quantity <= 4) {
      unitPrice = DISCOUNT_1_4;
      discountText = '優惠 9 折';
    } else if (quantity >= 5 && quantity <= 8) {
      unitPrice = DISCOUNT_5_8;
      discountText = '優惠 85 折';
    } else if (quantity > 8) {
      unitPrice = DISCOUNT_5_8;
      discountText = '大量訂購專屬價';
    }

    const orderAmount = quantity * unitPrice; // 商品小計
    const isSelfPickup = deliveryMethod === 'self_pickup';
    const isFreeShipping = isSelfPickup || orderAmount >= FREE_SHIPPING_THRESHOLD;
    const shippingFee = isSelfPickup ? 0 : (isFreeShipping ? 0 : SHIPPING_FEE); // 現場自取為 0
    const totalAmount = orderAmount + shippingFee; // 總金額
    const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - orderAmount);

    return {
      unitPrice,
      orderAmount,
      shippingFee,
      totalAmount,
      discountText,
      isSelfPickup,
      isFreeShipping,
      remainingForFreeShipping
    };
  }, [quantity, deliveryMethod]);

  // 檢查並送出表單
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. 取件人姓名驗證 (不可超過5個中文字)
    if (!recipientName.trim()) {
      setErrorMessage('請填寫取件人姓名');
      return;
    }

    if (recipientName.trim().length > 10) {
      setErrorMessage('取件人姓名請勿超過 5 個中文字 (10 碼)');
      return;
    }

    // 2. 取件人手機驗證 (10碼數字)
    const cleanPhone = recipientPhone.replace(/-/g, '').trim();
    if (!cleanPhone || !/^09\d{8}$/.test(cleanPhone)) {
      setErrorMessage('請填寫正確的 10 位數手機號碼 (例如: 0912345678)');
      return;
    }

    // 3. 配送與門市驗證 (若選擇 7-11 才需驗證門市)
    const isSelfPickup = deliveryMethod === 'self_pickup';
    const cleanStoreCode = isSelfPickup ? '自取' : storeCode.trim();
    const finalStoreName = isSelfPickup ? '現場自取' : storeName.trim();

    if (!isSelfPickup) {
      if (!cleanStoreCode) {
        setErrorMessage('請選擇 7-11 取件門市');
        return;
      }
      if (!finalStoreName) {
        setErrorMessage('請選擇 7-11 取件門市店名');
        return;
      }
    }

    // 4. 圖形驗證碼比對
    if (!captchaInput.trim() || captchaInput.trim().toUpperCase() !== correctCaptcha.toUpperCase()) {
      setErrorMessage('圖形驗證碼輸入錯誤，請重新確認或點擊「換一張」');
      return;
    }

    setIsSubmitting(true);

    // 自動產生 12 碼訂單編號
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedOrderId = `NB${dateStr}${randomSuffix}`;

    // 格式化當天日期 YYYY/MM/DD
    const orderDateStr = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}`;

    // 組合商品備註 (門市/自取 + 希望送達日期 + 訂購盒數 + 收據抬頭/客人備註)
    let compiledItemNotes = isSelfPickup
      ? `【取件方式: 現場自取】 【希望取貨日期: ${expectedDeliveryDate || '未指定'}】 【訂購盒數: ${quantity}盒】`
      : `【取件門市: ${finalStoreName} (${cleanStoreCode})】 【送達日期: ${expectedDeliveryDate || '未指定'}】 【訂購盒數: ${quantity}盒】`;

    if (needReceipt && receiptTitle.trim()) {
      compiledItemNotes += ` 【需免用發票收據 抬頭:${receiptTitle.trim()}】`;
    }
    if (notes.trim()) {
      compiledItemNotes += ` 【備註: ${notes.trim()}】`;
    }

    const orderData: OrderFormData = {
      deliveryMethod,
      quantity,
      unitPrice: pricingInfo.unitPrice,
      discountRateText: pricingInfo.discountText,
      orderAmount: pricingInfo.orderAmount,
      shippingFee: pricingInfo.shippingFee,
      totalAmount: pricingInfo.totalAmount,

      recipientName: recipientName.trim(),
      recipientPhone: cleanPhone,
      storeCode: cleanStoreCode,
      storeName: finalStoreName,

      tempZone: isSelfPickup ? '自取' : '冷凍',
      productName: '中秋聯名禮盒',
      orderDate: orderDateStr,
      expectedDeliveryDate: expectedDeliveryDate || (isSelfPickup ? '現場自取' : '預計9/1起陸續出貨'),
      notes: notes.trim(),
      itemNotes: compiledItemNotes,

      email: email.trim(),
      captchaInput: captchaInput.trim(),
    };

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...orderData, orderId: generatedOrderId }),
      });

      const resData = await response.json();

      if (resData.success || response.ok) {
        setCompletedOrder({
          orderId: generatedOrderId,
          totalAmount: pricingInfo.totalAmount,
          orderAmount: pricingInfo.orderAmount,
          shippingFee: pricingInfo.shippingFee,
          quantity,
          deliveryMethod,
          recipientName: recipientName.trim(),
          recipientPhone: cleanPhone,
          storeCode: cleanStoreCode,
          storeName: finalStoreName,
          storeAddress: isSelfPickup ? '現場自取 (免填門市)' : storeAddress,
          expectedDeliveryDate: expectedDeliveryDate || (isSelfPickup ? '現場自取' : '9/1 起順序陸續出貨'),
        });
      } else {
        setErrorMessage(resData.message || '訂單送出失敗，請稍後再試。');
      }
    } catch (err) {
      console.error(err);
      setCompletedOrder({
        orderId: generatedOrderId,
        totalAmount: pricingInfo.totalAmount,
        orderAmount: pricingInfo.orderAmount,
        shippingFee: pricingInfo.shippingFee,
        quantity,
        deliveryMethod,
        recipientName: recipientName.trim(),
        recipientPhone: cleanPhone,
        storeCode: cleanStoreCode,
        storeName: finalStoreName,
        storeAddress: isSelfPickup ? '現場自取 (免填門市)' : storeAddress,
        expectedDeliveryDate: expectedDeliveryDate || (isSelfPickup ? '現場自取' : '9/1 起順序陸續出貨'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="order-section" className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8 bg-white/95 backdrop-blur-sm p-5 sm:p-10 rounded-3xl shadow-card border border-amber-200/80">
        
        {/* 表單 Header */}
        <div className="border-b border-amber-100 pb-6">
          <div className="flex items-center space-x-3 text-amber-700 font-semibold text-sm mb-1">
            <ShoppingBag className="w-5 h-5 text-amber-700" />
            <span>妮邦廚房 Ｘ 歐伯芒果 2026 中秋線上預購系統</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-950">
            中秋聯名禮盒線上預訂
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            可選擇 <strong className="text-amber-800">7-11 冷凍配送</strong> 或 <strong className="text-amber-800">現場自取 (免運費)</strong>。單筆滿 $5,000 即享 7-11 冷凍全台免運！
          </p>
        </div>

        {/* 取貨/配送方式切換卡片 */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-amber-950 flex items-center space-x-1.5">
            <Truck className="w-4 h-4 text-amber-700" />
            <span>請選擇取貨 / 配送方式 <span className="text-red-500">*</span></span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 7-11 店到店冷凍配送 */}
            <div
              onClick={() => setDeliveryMethod('7-11')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center space-x-3 ${
                deliveryMethod === '7-11'
                  ? 'border-amber-600 bg-amber-50/90 shadow-sm'
                  : 'border-stone-200 bg-white hover:border-amber-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                deliveryMethod === '7-11' ? 'border-amber-700 bg-amber-700' : 'border-stone-300'
              }`}>
                {deliveryMethod === '7-11' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div>
                <div className="font-bold text-sm text-amber-950 flex items-center space-x-1.5">
                  <Truck className="w-4 h-4 text-amber-700" />
                  <span>7-11 冷凍店到店配送</span>
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  運費 NT$ 129（單筆滿 $5,000 免運）
                </div>
              </div>
            </div>

            {/* 現場自取 */}
            <div
              onClick={() => setDeliveryMethod('self_pickup')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center space-x-3 ${
                deliveryMethod === 'self_pickup'
                  ? 'border-amber-600 bg-amber-50/90 shadow-sm'
                  : 'border-stone-200 bg-white hover:border-amber-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                deliveryMethod === 'self_pickup' ? 'border-amber-700 bg-amber-700' : 'border-stone-300'
              }`}>
                {deliveryMethod === 'self_pickup' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div>
                <div className="font-bold text-sm text-amber-950 flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4 text-amber-700" />
                  <span>現場自取</span>
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                    免運費 $0
                  </span>
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  免輸入 7-11 店名，親自取貨
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1. 盒數選擇與金額計算卡片 */}
        <div className="bg-amber-50/70 p-5 sm:p-6 rounded-2xl border border-amber-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-amber-950">預訂盒數</span>
              <span className="text-xs bg-amber-600 text-white px-2.5 py-0.5 rounded-full font-sans font-medium shrink-0">
                {pricingInfo.discountText}
              </span>
            </div>
            <div className="flex items-baseline space-x-1.5 self-start sm:self-auto">
              <span className="text-xs text-stone-500 line-through">
                NT$ {ORIGINAL_PRICE}
              </span>
              <span className="text-lg sm:text-xl font-bold text-amber-700 font-serif">
                NT$ {pricingInfo.unitPrice}
              </span>
              <span className="text-xs text-amber-800 font-medium">/ 盒</span>
            </div>
          </div>

          {/* 盒數選擇器 */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-11 h-11 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold text-xl flex items-center justify-center transition shadow-sm cursor-pointer"
            >
              -
            </button>
            <input
              type="number"
              min={1}
              max={100}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-24 text-center py-2 text-xl font-bold font-serif text-amber-950 bg-white border-2 border-amber-400 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-11 h-11 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold text-xl flex items-center justify-center transition shadow-sm cursor-pointer"
            >
              +
            </button>
          </div>

          {/* 運費與免運提醒條 */}
          <div className="p-3.5 rounded-xl bg-white border border-amber-200 text-xs sm:text-sm">
            {deliveryMethod === 'self_pickup' ? (
              <div className="flex items-center space-x-2 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>您已選擇「現場自取」，免運費 ($0)！</span>
              </div>
            ) : pricingInfo.isFreeShipping ? (
              <div className="flex items-center space-x-2 text-emerald-700 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-bounce" />
                <span>已滿 NT$ 5,000 門檻！恭喜享有全台 7-11 冷凍免運優惠！</span>
              </div>
            ) : (
              <div className="flex items-center justify-between text-stone-700">
                <div className="flex items-center space-x-1">
                  <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>7-11 店到店冷凍運費：<strong className="text-amber-800">NT$ 129</strong></span>
                </div>
                <div className="text-amber-800 font-medium text-xs">
                  再加購 <strong className="font-bold underline text-amber-900">NT$ {pricingInfo.remainingForFreeShipping.toLocaleString()}</strong> 享免運！
                </div>
              </div>
            )}
          </div>

          {/* 大量訂購提醒 */}
          {quantity > 8 && (
            <div className="flex items-start space-x-2 p-3 bg-amber-100/90 border border-amber-300 rounded-xl text-amber-900 text-xs sm:text-sm">
              <PhoneCall className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>大量企業訂購特別提醒：</strong> 您選擇了 {quantity} 盒禮盒。8 盒以上享極尊榮企業特惠價，歡迎撥打專線{' '}
                <a href="tel:0989518831" className="underline font-bold text-amber-800 hover:text-amber-600">
                  0989518831
                </a>{' '}
                由專人為您安排！
              </div>
            </div>
          )}

          {/* 應付金額試算卡片 */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-amber-200 mt-4 shadow-sm">
            <div className="text-xs sm:text-sm text-stone-700 space-y-1 mb-2 sm:mb-0 w-full sm:w-auto">
              <div>取貨方式：<span className="font-semibold text-amber-900">{deliveryMethod === 'self_pickup' ? '現場自取 (免運)' : '7-11 店到店 (冷凍)'}</span></div>
              <div className="text-stone-500">
                商品小計：NT$ {pricingInfo.orderAmount.toLocaleString()} ＋ 運費：{pricingInfo.shippingFee === 0 ? <span className="text-emerald-600 font-bold">免運 ($0)</span> : `NT$ ${SHIPPING_FEE}`}
              </div>
            </div>
            <div className="text-right w-full sm:w-auto">
              <div className="text-xs text-stone-500">應付總金額</div>
              <div className="text-2xl font-extrabold text-amber-700 font-serif">
                NT$ {pricingInfo.totalAmount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* 2. 取件人資訊與門市/自取欄位 */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-amber-950 flex items-center space-x-2 border-b border-amber-100 pb-2">
            <UserCheck className="w-5 h-5 text-amber-700" />
            <span>1. 取件人資訊與取貨地點</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                取件人姓名 <span className="text-red-500">* (上限 5 個中文字)</span>
              </label>
              <input
                type="text"
                required
                maxLength={10}
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="例如：王小明"
                className="w-full px-3.5 py-3 sm:py-2.5 bg-stone-50/50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition text-base sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                取件人手機 <span className="text-red-500">* (10碼數字，請勿含「-」)</span>
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="例如：0912345678"
                className="w-full px-3.5 py-3 sm:py-2.5 bg-stone-50/50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition text-base sm:text-sm"
              />
            </div>
          </div>

          {/* 門市選擇器 (7-11) 或 自取說明 */}
          {deliveryMethod === 'self_pickup' ? (
            <div className="p-4 bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl text-xs sm:text-sm text-emerald-900 flex items-center space-x-3">
              <Building2 className="w-6 h-6 text-emerald-700 shrink-0" />
              <div>
                <strong className="text-base block">已選擇「現場自取」選項</strong>
                您不需輸入 7-11 門市名稱與店號，現場取貨享 <span className="font-bold underline">免運費 NT$ 0</span>！
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-2 bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-amber-950 flex items-center space-x-1.5">
                  <Store className="w-4 h-4 text-amber-700" />
                  <span>7-11 全國門市對照選單</span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md font-normal">
                    自動填入門市代碼與名稱
                  </span>
                </label>
                <a
                  href="https://emap.pcsc.com.tw/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-amber-800 hover:text-amber-950 font-bold underline flex items-center space-x-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>外部電子地圖查詢</span>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">1. 選擇縣市</label>
                  <select
                    value={selectedCity}
                    onChange={handleCityChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-base sm:text-sm font-medium focus:ring-2 focus:ring-amber-500"
                  >
                    {cityList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">2. 選擇鄉鎮市區</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-base sm:text-sm font-medium focus:ring-2 focus:ring-amber-500"
                  >
                    {districtList.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  3. 選擇 7-11 門市 ({storeOptions.length} 家門市供選擇)
                </label>
                <select
                  value={selectedStoreId}
                  onChange={handleStoreSelectChange}
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-amber-400 rounded-xl text-base sm:text-sm font-bold text-amber-950 focus:ring-2 focus:ring-amber-500"
                >
                  {storeOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (店號: {s.id}) - {s.address}
                    </option>
                  ))}
                </select>
              </div>

              {/* 即時已選門市卡片顯示 */}
              {storeCode && (
                <div className="p-3 bg-white rounded-xl border border-amber-300 space-y-1 text-xs text-stone-700 shadow-sm mt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 text-sm flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-amber-700" />
                      <span>已選取門市：{storeName}</span>
                    </span>
                    <span className="font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                      門市店號代碼：{storeCode}
                    </span>
                  </div>
                  {storeAddress && (
                    <div className="text-stone-500 pl-5">門市地址：{storeAddress}</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. 送達/取貨日期與 Email 通知 */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-amber-950 flex items-center space-x-2 border-b border-amber-100 pb-2">
            <Truck className="w-5 h-5 text-amber-700" />
            <span>2. 日期與聯絡偏好</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>{deliveryMethod === 'self_pickup' ? '希望現場取貨日期 (選填)' : '希望送達日期 (選填)'}</span>
              </label>
              <input
                type="date"
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                className="w-full px-3.5 py-3 sm:py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-base sm:text-sm focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[11px] text-amber-800 mt-1 block font-medium">
                📦 {deliveryMethod === 'self_pickup' ? '現場自取預計 9/1 起供取貨' : '預計 9/1 起依照訂單順序陸續出貨'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                買家 Email (填寫將寄送訂單確認信)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="例如：name@example.com"
                className="w-full px-3.5 py-3 sm:py-2.5 bg-stone-50/50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition text-base sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              商品備註 (選填)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="如有特殊需求或贈禮卡片說明請在此填寫"
              className="w-full px-3.5 py-3 sm:py-2.5 bg-stone-50/50 border border-stone-300 rounded-xl text-base sm:text-sm focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* 4. 發票說明 (妮邦廚房依法免開統一發票) */}
        <div className="space-y-3 bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
          <h3 className="text-base font-bold text-amber-950 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-700" />
            <span>3. 發票開立說明</span>
          </h3>

          <div className="text-xs text-stone-700 leading-relaxed space-y-1">
            <p className="font-semibold text-amber-900">
              💡 妮邦廚房依法為小規模營業人，免用統一發票。
            </p>
            <p>
              本訂單依法免開立統一發票。如您或公司需「小規模營業人免用統一發票收據」（可作為報帳憑證），請於下方勾選。
            </p>
          </div>

          <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-amber-900 pt-1">
            <input
              type="checkbox"
              checked={needReceipt}
              onChange={(e) => setNeedReceipt(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
            />
            <span>需隨貨附上「免用統一發票收據」</span>
          </label>

          {needReceipt && (
            <div className="pt-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                收據抬頭 / 買方名稱 (選填)
              </label>
              <input
                type="text"
                value={receiptTitle}
                onChange={(e) => setReceiptTitle(e.target.value)}
                placeholder="例如：妮邦股份有限公司"
                className="w-full sm:w-1/2 px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}
        </div>

        {/* 5. 4碼圖形驗證碼 */}
        <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-3">
          <label className="block text-xs font-bold text-stone-800">
            請輸入下方 4 位圖形驗證碼 <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Captcha onCodeChange={setCorrectCaptcha} />
            <input
              type="text"
              required
              maxLength={4}
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
              placeholder="輸入驗證碼"
              className="w-36 px-4 py-2.5 text-center text-lg font-mono font-bold uppercase tracking-widest bg-white border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* 錯誤訊息 Alert */}
        {errorMessage && (
          <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 送出按鈕 */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-serif font-bold text-lg rounded-2xl shadow-lg hover:shadow-glow transition duration-200 flex items-center justify-center space-x-2 cursor-pointer border border-amber-400/30"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-amber-200" />
                <span>訂單寫入中...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6 text-amber-200" />
                <span>確認預訂中秋聯名禮盒 (總金額 NT$ {pricingInfo.totalAmount.toLocaleString()})</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-stone-500 mt-2">
            {deliveryMethod === 'self_pickup' ? '選擇現場自取，免運費 ($0)。' : '送出訂單後將自動寫入相容 7-11 賣貨便匯入格式。'}
          </p>
        </div>
      </form>

      {/* 訂單完成 Modal */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-amber-200 animate-in fade-in zoom-in duration-300">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold font-serif text-amber-950">
                預訂成功！完成訂單
              </h3>
              <p className="text-sm text-stone-600">
                我們已收到您的【妮邦廚房 Ｘ 歐伯芒果】中秋聯名禮盒預訂單。
              </p>
            </div>

            <div className="my-6 bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2.5 text-sm text-stone-800">
              <div className="flex justify-between items-center border-b border-amber-200/60 pb-2">
                <span className="text-stone-500 text-xs">訂單編號：</span>
                <span className="font-mono font-bold text-amber-900 text-base">
                  {completedOrder.orderId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">取貨方式：</span>
                <span className="font-bold text-amber-900">
                  {completedOrder.deliveryMethod === 'self_pickup' ? '現場自取 (免運)' : '7-11 店到店冷凍配送'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">禮盒數量：</span>
                <span className="font-semibold">{completedOrder.quantity} 盒</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">商品小計：</span>
                <span className="font-semibold">NT$ {completedOrder.orderAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">運費金額：</span>
                <span className="font-semibold">{completedOrder.shippingFee === 0 ? <span className="text-emerald-700 font-bold">免運費 ($0)</span> : `NT$ ${completedOrder.shippingFee}`}</span>
              </div>
              <div className="flex justify-between border-t border-amber-200/60 pt-2">
                <span className="text-stone-500 font-bold">應付總金額：</span>
                <span className="font-extrabold text-amber-700 text-lg">
                  NT$ {completedOrder.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-stone-500">取件人：</span>
                <span className="font-semibold">{completedOrder.recipientName} ({completedOrder.recipientPhone})</span>
              </div>
              {completedOrder.deliveryMethod === '7-11' && (
                <div className="flex justify-between items-start">
                  <span className="text-stone-500 shrink-0">7-11 取件門市：</span>
                  <div className="text-right font-medium text-amber-900 text-xs">
                    <div>{completedOrder.storeName} (店號: {completedOrder.storeCode})</div>
                    {completedOrder.storeAddress && <div className="text-[11px] text-stone-500">{completedOrder.storeAddress}</div>}
                  </div>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-stone-500">{completedOrder.deliveryMethod === 'self_pickup' ? '希望取貨日期：' : '希望送達日期：'}</span>
                <span className="font-medium">{completedOrder.expectedDeliveryDate}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setCompletedOrder(null)}
                className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl transition shadow-md cursor-pointer"
              >
                完成並關閉
              </button>
              <div className="text-center text-xs text-stone-500">
                如有疑問請洽專線：<a href="tel:0989518831" className="text-amber-800 font-bold underline">0989518831</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

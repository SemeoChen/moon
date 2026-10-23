'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Captcha } from './Captcha';
import { OrderFormData } from '../types/order';
import { ProductItem, calculateShippingFee } from '../data/products';
import sevenElevenStoresData from '@/data/sevenElevenStores.json';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Calendar,
  UserCheck,
  AlertCircle,
  Loader2,
  Sparkles,
  ExternalLink,
  Store,
  MapPin,
  Snowflake,
  Mail,
  FileSpreadsheet,
  Gift,
  Building2,
} from 'lucide-react';

interface StoreItem {
  id: string;
  name: string;
  rawName: string;
  address: string;
}

type StoreDataset = Record<string, Record<string, StoreItem[]>>;
const STORES_DB = sevenElevenStoresData as StoreDataset;

interface OrderFormProps {
  selectedProduct: ProductItem;
  onSelectProductById?: (productId: string) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ selectedProduct }) => {
  // 取貨/配送方式：'7-11' (7-11冷凍交貨便) 或 'self_pickup' (自取)
  const [deliveryMethod, setDeliveryMethod] = useState<'7-11' | 'self_pickup'>('7-11');

  // 盒數與訂購細節
  const [quantity, setQuantity] = useState<number>(4);

  // 收件人資訊
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientPhone, setRecipientPhone] = useState<string>('');

  // 7-11 門市三級選單 (縣市, 行政區, 店名)
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

  // 買家下訂日期 (預設今天 YYYY/MM/DD)
  const [orderDate, setOrderDate] = useState<string>('');
  useEffect(() => {
    const now = new Date();
    const formatted = `${now.getFullYear()}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}`;
    setOrderDate(formatted);
  }, []);

  // 希望送達日期、寄件人/買家 EMAIL、商品備註
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // 圖形驗證碼
  const [correctCaptcha, setCorrectCaptcha] = useState<string>('');
  const [captchaInput, setCaptchaInput] = useState<string>('');
  const [captchaResetKey, setCaptchaResetKey] = useState<number>(0);

  // 提交狀態與完成訂單彈窗
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<{
    orderId: string;
    productName: string;
    deliveryMethod: '7-11' | 'self_pickup';
    tempZone: string;
    totalAmount: number;
    orderAmount: number;
    shippingFee: number;
    quantity: number;
    recipientName: string;
    recipientPhone: string;
    storeCode: string;
    storeName: string;
    storeAddress: string;
    orderDate: string;
    expectedDeliveryDate: string;
    email: string;
    compiledItemNotes: string;
  } | null>(null);

  // 當縣市變更時，自動更新行政區
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = e.target.value;
    setSelectedCity(newCity);
    const districts =
      newCity && STORES_DB[newCity] ? Object.keys(STORES_DB[newCity]) : [];
    if (districts.length > 0) {
      setSelectedDistrict(districts[0]);
    } else {
      setSelectedDistrict('');
    }
  };

  // 當行政區或縣市變更時，自動預設第一間門市並填入取件門市(代碼)與取件門市欄位
  useEffect(() => {
    if (storeOptions && storeOptions.length > 0) {
      const firstStore = storeOptions[0];
      setSelectedStoreId(firstStore.id);
      setStoreCode(firstStore.id);
      setStoreName(`7-11 ${firstStore.name}門市`);
      setStoreAddress(firstStore.address);
    } else {
      setSelectedStoreId('');
      setStoreCode('');
      setStoreName('');
      setStoreAddress('');
    }
  }, [storeOptions]);

  // 當選擇門市選單改變時，自動填入取件門市(代碼)以及取件門市欄位
  const handleStoreSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetId = e.target.value;
    setSelectedStoreId(targetId);
    const found = storeOptions.find((s) => s.id === targetId);
    if (found) {
      setStoreCode(found.id);
      setStoreName(`7-11 ${found.name}門市`);
      setStoreAddress(found.address);
    } else {
      setStoreCode('');
      setStoreName('');
      setStoreAddress('');
    }
  };

  const unitPrice = selectedProduct.price || 250;
  const originalPrice = selectedProduct.originalPrice || 280;

  // 自動計算訂單金額、階梯運費與應付總額
  const pricingInfo = useMemo(() => {
    const orderAmount = quantity * unitPrice;
    const isSelfPickup = deliveryMethod === 'self_pickup';
    const {
      shippingFee: calculatedFee,
      currentTierLabel: calculatedLabel,
      nextTierInfo: calculatedNextTier,
    } = calculateShippingFee(orderAmount, quantity);

    const shippingFee = isSelfPickup ? 0 : calculatedFee;
    const currentTierLabel = isSelfPickup
      ? '自取：免運費 ($0)'
      : calculatedLabel;
    const nextTierInfo = isSelfPickup ? null : calculatedNextTier;
    const totalAmount = orderAmount + shippingFee;

    return {
      unitPrice,
      originalPrice,
      orderAmount,
      shippingFee,
      totalAmount,
      currentTierLabel,
      nextTierInfo,
      isSelfPickup,
    };
  }, [quantity, unitPrice, originalPrice, deliveryMethod]);

  // 即時產生將寫入 Google Sheet 的備註內容（希望送達門市(中文)/自取、送達日期、訂購盒數）
  const compiledItemNotesPreview = useMemo(() => {
    const isSelfPickup = deliveryMethod === 'self_pickup';
    const deliveryDateText =
      expectedDeliveryDate || (isSelfPickup ? '現場自取' : '依序出貨');
    const baseNote = isSelfPickup
      ? `取件方式：自取｜希望取貨日期：${deliveryDateText}｜訂購盒數：${quantity}${
          selectedProduct.unit || '盒'
        }`
      : `希望送達門市：${storeName || '未選擇'}(${
          storeCode || '-'
        })｜希望送達日期：${deliveryDateText}｜訂購盒數：${quantity}${
          selectedProduct.unit || '盒'
        }`;
    return notes.trim() ? `${baseNote}｜買家備註：${notes.trim()}` : baseNote;
  }, [
    deliveryMethod,
    storeName,
    storeCode,
    expectedDeliveryDate,
    quantity,
    selectedProduct.unit,
    notes,
  ]);

  // 檢查並送出表單
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (selectedProduct.status !== 'available') {
      setErrorMessage(`「${selectedProduct.name}」目前為「${selectedProduct.statusBadgeText}」，請切換至主打商品「芒果恰克」進行訂購。`);
      return;
    }

    // 1. 收件人姓名驗證
    if (!recipientName.trim()) {
      setErrorMessage('請填寫收件人姓名');
      return;
    }
    if (recipientName.trim().length > 10) {
      setErrorMessage('收件人姓名請勿超過 10 個字元');
      return;
    }

    // 2. 收件人手機驗證 (10碼數字)
    const cleanPhone = recipientPhone.replace(/-/g, '').trim();
    if (!cleanPhone || !/^09\d{8}$/.test(cleanPhone)) {
      setErrorMessage('請填寫正確的 10 位數手機號碼 (例如: 0912345678)');
      return;
    }

    // 3. 取貨方式與 7-11 取件門市驗證
    const isSelfPickup = deliveryMethod === 'self_pickup';
    const cleanStoreCode = isSelfPickup ? '自取' : storeCode.trim();
    const finalStoreName = isSelfPickup ? '現場自取' : storeName.trim();
    if (!isSelfPickup && (!cleanStoreCode || !finalStoreName)) {
      setErrorMessage('請選擇 7-11 取件門市（縣市、行政區與店名）');
      return;
    }

    // 4. 四碼圖形驗證碼比對
    if (
      !captchaInput.trim() ||
      captchaInput.trim().toUpperCase() !== correctCaptcha.toUpperCase()
    ) {
      setErrorMessage('四碼圖形驗證碼輸入錯誤，請重新確認或點擊「換一張」');
      return;
    }

    setIsSubmitting(true);

    // 產生訂單編號
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedOrderId = `NB${dateStr}${randomSuffix}`;

    const currentOrderDate =
      orderDate ||
      `${now.getFullYear()}/${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}`;

    const orderData: OrderFormData = {
      deliveryMethod,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity,
      unitPrice: pricingInfo.unitPrice,
      orderAmount: pricingInfo.orderAmount,
      shippingFee: pricingInfo.shippingFee,
      totalAmount: pricingInfo.totalAmount,

      recipientName: recipientName.trim(),
      recipientPhone: cleanPhone,
      storeCode: cleanStoreCode,
      storeName: finalStoreName,

      tempZone: isSelfPickup ? '自取' : '冷凍',
      orderDate: currentOrderDate,
      expectedDeliveryDate:
        expectedDeliveryDate || (isSelfPickup ? '現場自取' : '依序出貨'),
      notes: notes.trim(),
      itemNotes: compiledItemNotesPreview,

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
          productName: selectedProduct.name,
          deliveryMethod,
          tempZone: isSelfPickup ? '自取' : '冷凍',
          totalAmount: pricingInfo.totalAmount,
          orderAmount: pricingInfo.orderAmount,
          shippingFee: pricingInfo.shippingFee,
          quantity,
          recipientName: recipientName.trim(),
          recipientPhone: cleanPhone,
          storeCode: cleanStoreCode,
          storeName: finalStoreName,
          storeAddress: isSelfPickup ? '現場自取（免填 7-11 門市）' : storeAddress,
          orderDate: currentOrderDate,
          expectedDeliveryDate:
            expectedDeliveryDate || (isSelfPickup ? '現場自取' : '依序安排出貨'),
          email: email.trim(),
          compiledItemNotes: compiledItemNotesPreview,
        });

        // 送出訂單後：保留收件人(訂購人)姓名、電話及 Email，其餘輸入欄位清除，並重設圖形驗證碼
        setSelectedCity('');
        setSelectedDistrict('');
        setSelectedStoreId('');
        setStoreCode('');
        setStoreName('');
        setStoreAddress('');
        setExpectedDeliveryDate('');
        setNotes('');
        setQuantity(1);
        setCaptchaInput('');
        setCaptchaResetKey((prev) => prev + 1);
      } else {
        setErrorMessage(resData.message || '訂單送出失敗，請稍後再試。');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('網路連線異常，請稍後再試。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="order-section" className="w-full max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white/95 backdrop-blur-sm p-5 sm:p-10 rounded-3xl shadow-card border border-amber-200/90"
      >
        {/* 表單頂部標題 */}
        <div className="border-b border-amber-100 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm">
              <ShoppingBag className="w-5 h-5 text-amber-700" />
              <span>妮邦廚房 Ｘ 歐伯芒果 產品訂購表單</span>
            </div>
            <span className="inline-flex items-center space-x-1.5 text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200 px-3 py-1 rounded-full">
              <Snowflake className="w-3.5 h-3.5 text-sky-600" />
              <span>可選 7-11 冷凍交貨便 或 自取（免運費）</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-950">
            線上預訂：{selectedProduct.name}
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            請選擇取貨方式（7-11 取貨或自取）並填寫收件人資訊，輸入正確四碼圖形驗證碼後即可送出訂單寫入系統。
          </p>
        </div>

        {/* 取貨 / 配送方式選擇卡片 */}
        <div className="space-y-3">
          <label className="block text-xs sm:text-sm font-bold text-amber-950 flex items-center space-x-1.5">
            <Truck className="w-4 h-4 text-amber-700" />
            <span>
              請選擇取貨方式 <span className="text-red-500">*</span>
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 7-11 冷凍交貨便取貨 */}
            <div
              onClick={() => setDeliveryMethod('7-11')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center space-x-3 ${
                deliveryMethod === '7-11'
                  ? 'border-amber-600 bg-amber-50/90 shadow-sm'
                  : 'border-stone-200 bg-white hover:border-amber-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  deliveryMethod === '7-11'
                    ? 'border-amber-700 bg-amber-700'
                    : 'border-stone-300'
                }`}
              >
                {deliveryMethod === '7-11' && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <div>
                <div className="font-bold text-sm text-amber-950 flex items-center space-x-1.5">
                  <Store className="w-4 h-4 text-amber-700" />
                  <span>7-11 取貨（冷凍交貨便）</span>
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  階梯運費優惠，滿 $3,000（12盒）享免運費
                </div>
              </div>
            </div>

            {/* 自取 */}
            <div
              onClick={() => setDeliveryMethod('self_pickup')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center space-x-3 ${
                deliveryMethod === 'self_pickup'
                  ? 'border-amber-600 bg-amber-50/90 shadow-sm'
                  : 'border-stone-200 bg-white hover:border-amber-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  deliveryMethod === 'self_pickup'
                    ? 'border-amber-700 bg-amber-700'
                    : 'border-stone-300'
                }`}
              >
                {deliveryMethod === 'self_pickup' && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <div>
                <div className="font-bold text-sm text-amber-950 flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4 text-amber-700" />
                  <span>自取</span>
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                    免運費 $0
                  </span>
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  免填 7-11 門市，親自取貨免運費
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1. 商品、溫層、訂購盒數與階梯運費試算 */}
        <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-amber-50/80 p-5 sm:p-6 rounded-2xl border border-amber-200 space-y-5">
          {/* 商品名稱與溫層唯讀欄位列 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-amber-200/80">
              <label className="block text-[11px] font-bold text-stone-500 mb-0.5">
                訂購商品 (自動帶入)
              </label>
              <div className="text-base font-serif font-bold text-amber-950 flex items-center justify-between">
                <span>{selectedProduct.name}</span>
                <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-sans">
                  ${unitPrice}/{selectedProduct.unit}
                </span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-amber-200/80">
              <label className="block text-[11px] font-bold text-stone-500 mb-0.5">
                取貨方式 / 溫層
              </label>
              {deliveryMethod === 'self_pickup' ? (
                <div className="text-base font-bold text-emerald-800 flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>自取 (免運費 $0)</span>
                </div>
              ) : (
                <div className="text-base font-bold text-sky-800 flex items-center space-x-1.5">
                  <Snowflake className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>冷凍 (7-11 冷凍交貨便)</span>
                </div>
              )}
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-amber-200/80">
              <label className="block text-[11px] font-bold text-stone-500 mb-0.5">
                買家下訂日期
              </label>
              <div className="text-base font-mono font-bold text-stone-800">
                {orderDate || '今日'}
              </div>
            </div>
          </div>

          {/* 單價與盒數選擇器 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-amber-200/60">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-bold text-amber-950">
                  選擇訂購盒數
                </span>
                <span className="text-xs bg-red-600 text-white px-2.5 py-0.5 rounded-full font-bold">
                  限時特惠價
                </span>
              </div>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-xs text-stone-500 line-through">
                  原價 ${originalPrice}/{selectedProduct.unit}
                </span>
                <span className="text-xl font-extrabold text-amber-800 font-serif">
                  特價 NT$ {unitPrice}
                </span>
                <span className="text-xs text-stone-600">/ {selectedProduct.unit}</span>
              </div>
            </div>

            {/* 盒數加減與快捷按鈕 */}
            <div className="flex flex-col items-start sm:items-end space-y-2">
              <div className="flex items-center space-x-3">
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
                  max={200}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-24 text-center py-2 text-xl font-bold font-serif text-amber-950 bg-white border-2 border-amber-500 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-11 h-11 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold text-xl flex items-center justify-center transition shadow-sm cursor-pointer"
                >
                  +
                </button>
                <span className="text-sm font-bold text-amber-950">
                  {selectedProduct.unit}
                </span>
              </div>

              {/* 揪團湊單快捷鍵 */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { boxes: 1, tag: '1盒嚐鮮' },
                  { boxes: 4, tag: '4盒(滿千運$100)' },
                  { boxes: 8, tag: '8盒(滿兩千運$80)' },
                  { boxes: 12, tag: '12盒(滿三千免運🔥)' },
                ].map((preset) => (
                  <button
                    key={preset.boxes}
                    type="button"
                    onClick={() => setQuantity(preset.boxes)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      quantity === preset.boxes
                        ? 'bg-amber-800 text-white shadow-sm'
                        : 'bg-white text-amber-900 border border-amber-300 hover:bg-amber-100'
                    }`}
                  >
                    {preset.tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 🎁 揪團湊單階梯運費進度表 */}
          <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 flex items-center space-x-1.5">
                <Gift className="w-4 h-4 text-red-600" />
                <span>🎁 揪團湊單更划算（7-11 冷凍交貨便階梯運費）</span>
              </span>
              <span className="text-xs font-bold text-emerald-700">
                目前適用：{pricingInfo.currentTierLabel}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              {[
                { label: '未滿千元 (1~3盒)', feeText: '運費 $120', active: pricingInfo.shippingFee === 120 },
                { label: '滿 $1,000 (4盒)', feeText: '運費 $100', active: pricingInfo.shippingFee === 100 },
                { label: '滿 $2,000 (8盒)', feeText: '運費 $80', active: pricingInfo.shippingFee === 80 },
                { label: '滿 $3,000 (12盒)', feeText: '免運費 $0', active: pricingInfo.shippingFee === 0 },
              ].map((tier, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border transition ${
                    tier.active
                      ? 'bg-amber-100/90 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-400/40'
                      : 'bg-stone-50 border-stone-200 text-stone-500'
                  }`}
                >
                  <div className="text-[11px]">{tier.label}</div>
                  <div className={`text-sm mt-0.5 ${tier.active ? 'text-red-700 font-extrabold' : ''}`}>
                    {tier.feeText}
                  </div>
                </div>
              ))}
            </div>

            {deliveryMethod === 'self_pickup' ? (
              <div className="text-xs text-emerald-800 bg-emerald-50 px-3 py-2 rounded-lg font-bold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>您已選擇「自取」，本單直接享有「免運費 $0」！</span>
              </div>
            ) : pricingInfo.nextTierInfo ? (
              <div className="text-xs text-amber-800 bg-amber-50 px-3 py-2 rounded-lg flex items-center justify-between">
                <span>
                  💡 再加購{' '}
                  <strong className="text-red-600 underline">
                    {pricingInfo.nextTierInfo.neededBoxes} 盒
                  </strong>{' '}
                  (差 NT$ {pricingInfo.nextTierInfo.neededAmount.toLocaleString()})，
                  {pricingInfo.nextTierInfo.nextFee === 0
                    ? '立即享有「免運費 ($0)」！'
                    : `運費立即降為 $${pricingInfo.nextTierInfo.nextFee}！`}
                </span>
              </div>
            ) : (
              <div className="text-xs text-emerald-800 bg-emerald-50 px-3 py-2 rounded-lg font-bold flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>恭喜已達滿 $3,000（12盒）最高門檻，本單享「免運費 $0」！</span>
              </div>
            )}
          </div>

          {/* 訂單金額 + 運費金額 = 總金額 欄位顯示 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-amber-950 text-amber-50 p-4 rounded-xl shadow-inner">
            <div>
              <div className="text-[11px] text-amber-300/80">訂單金額 (商品小計)</div>
              <div className="text-lg font-bold font-mono">
                NT$ {pricingInfo.orderAmount.toLocaleString()}
                <span className="text-xs font-normal text-amber-200/80 ml-1">
                  ({quantity}盒 × ${unitPrice})
                </span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-amber-300/80">
                運費金額 ({deliveryMethod === 'self_pickup' ? '自取' : '7-11冷凍交貨便'})
              </div>
              <div className="text-lg font-bold font-mono">
                {deliveryMethod === 'self_pickup' ? (
                  <span className="text-emerald-300">NT$ 0 (自取免運)</span>
                ) : pricingInfo.shippingFee === 0 ? (
                  <span className="text-emerald-300">NT$ 0 (滿三千免運)</span>
                ) : (
                  `NT$ ${pricingInfo.shippingFee}`
                )}
              </div>
            </div>
            <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-amber-800">
              <div className="text-[11px] text-amber-300">應付總金額 (訂單+運費)</div>
              <div className="text-2xl font-extrabold text-amber-300 font-serif">
                NT$ {pricingInfo.totalAmount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* 2. 收件人姓名、收件人手機與取貨地點 (7-11 門市或自取) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-amber-950 flex items-center space-x-2 border-b border-amber-100 pb-2">
            <UserCheck className="w-5 h-5 text-amber-700" />
            <span>
              1. 收件人資訊與
              {deliveryMethod === 'self_pickup' ? '自取資訊' : ' 7-11 取件門市'}
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                收件人姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={10}
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="請輸入取件人真實姓名 (如：王小明)"
                className="w-full px-3.5 py-3 sm:py-2.5 bg-stone-50/70 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition text-base sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                收件人手機 <span className="text-red-500">* (10碼數字，如 0912345678)</span>
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="例如：0912345678"
                className="w-full px-3.5 py-3 sm:py-2.5 bg-stone-50/70 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition text-base sm:text-sm"
              />
            </div>
          </div>

          {deliveryMethod === 'self_pickup' ? (
            <div className="p-4 bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl text-xs sm:text-sm text-emerald-900 flex items-center space-x-3">
              <Building2 className="w-6 h-6 text-emerald-700 shrink-0" />
              <div>
                <strong className="text-base block">已選擇「自取」選項</strong>
                您不需選擇 7-11 門市名稱與店號，現場自取享{' '}
                <span className="font-bold underline">免運費 NT$ 0</span>！可於下方選擇希望取貨日期或填寫備註。
              </div>
            </div>
          ) : (
            /* 台灣 7-11 全國門市選擇器 */
            <div className="space-y-3.5 pt-2 bg-amber-50/60 p-4 sm:p-5 rounded-2xl border border-amber-200">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <label className="text-xs sm:text-sm font-bold text-amber-950 flex items-center space-x-1.5">
                  <Store className="w-4 h-4 text-amber-700" />
                  <span>選擇台灣 7-11 取件門市（選取縣市、行政區、店名後自動填入代碼與門市欄位）</span>
                </label>
                <a
                  href="https://emap.pcsc.com.tw/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-amber-800 hover:text-amber-950 font-bold underline flex items-center space-x-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>7-11 電子地圖查詢</span>
                </a>
              </div>

              {/* 三級選單：縣市 -> 行政區 -> 店名 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    步驟 1：選取縣市
                  </label>
                  <select
                    value={selectedCity}
                    onChange={handleCityChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-base sm:text-sm font-medium focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">-- 請選擇縣市 --</option>
                    {cityList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    步驟 2：選取行政區
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-base sm:text-sm font-medium focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">-- 請選擇行政區 --</option>
                    {districtList.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    步驟 3：選取 7-11 店名 ({storeOptions.length} 家門市)
                  </label>
                  <select
                    value={selectedStoreId}
                    onChange={handleStoreSelectChange}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-amber-500 rounded-xl text-base sm:text-sm font-bold text-amber-950 focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">-- 請選擇 7-11 門市 --</option>
                    {storeOptions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}門市 (代碼:{s.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 自動填入之「取件門市(代碼)」與「取件門市(中文)」欄位 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">
                    取件門市 (代碼) <span className="text-stone-500 font-normal">(自動填入 6 碼店號)</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={storeCode}
                    className="w-full px-3.5 py-2 bg-amber-100/70 border border-amber-300 rounded-xl text-sm font-mono font-bold text-amber-950 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">
                    取件門市 (中文店名) <span className="text-stone-500 font-normal">(自動填入並寫入備註)</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={storeName}
                    className="w-full px-3.5 py-2 bg-amber-100/70 border border-amber-300 rounded-xl text-sm font-bold text-amber-950 cursor-not-allowed"
                  />
                </div>
              </div>

              {storeAddress && (
                <div className="flex items-center space-x-1.5 text-xs text-stone-600 pl-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>門市地址：{storeAddress}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. 希望送達日期、寄件人EMAIL、商品備註 */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-amber-950 flex items-center space-x-2 border-b border-amber-100 pb-2">
            <Truck className="w-5 h-5 text-amber-700" />
            <span>2. 希望送達日期、Email 確認信與商品備註</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>希望送達日期 (選填，將寫入 Google Sheet 與備註)</span>
              </label>
              <input
                type="date"
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                className="w-full px-3.5 py-3 sm:py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-base sm:text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-amber-700" />
                <span>寄件人/買家 EMAIL (若有填寫將自動發送 Email 訂單確認信)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="例如：name@example.com"
                className="w-full px-3.5 py-3 sm:py-2.5 bg-stone-50/70 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition text-base sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              額外商品備註 (選填)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="如有其他特殊需求請在此填寫..."
              className="w-full px-3.5 py-2.5 bg-stone-50/70 border border-stone-300 rounded-xl text-base sm:text-sm focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* 自動組合之 Google Sheet 商品備註預覽 */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
            <div className="font-bold text-stone-800 flex items-center space-x-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>將自動寫入 Google Sheet「商品備註」欄位的完整內容：</span>
            </div>
            <div className="font-mono text-amber-950 bg-white p-2 rounded-lg border border-stone-200 break-all">
              {compiledItemNotesPreview}
            </div>
          </div>
        </div>

        {/* 4. 四碼圖形驗證碼 */}
        <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-3">
          <label className="block text-xs font-bold text-stone-800">
            請輸入下方 4 碼圖形驗證碼 <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Captcha
              onCodeChange={setCorrectCaptcha}
              refreshKey={captchaResetKey}
            />
            <input
              type="text"
              required
              maxLength={4}
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
              placeholder="輸入4碼驗證碼"
              className="w-44 px-4 py-2.5 text-center text-lg font-mono font-bold uppercase tracking-widest bg-white border-2 border-amber-400 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* 錯誤訊息 Alert */}
        {errorMessage && (
          <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 送出按鈕 */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || selectedProduct.status !== 'available'}
            className={`w-full py-4 px-6 font-serif font-bold text-lg rounded-2xl shadow-lg transition duration-200 flex items-center justify-center space-x-2 cursor-pointer border ${
              selectedProduct.status === 'available'
                ? 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white border-amber-400/30 hover:shadow-glow'
                : 'bg-stone-300 text-stone-600 border-stone-300 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-amber-200" />
                <span>驗證並寫入 Google Sheet 訂單中...</span>
              </>
            ) : selectedProduct.status !== 'available' ? (
              <span>此商品目前「{selectedProduct.statusBadgeText}」無法下單</span>
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6 text-amber-200" />
                <span>
                  確認送出訂單：{selectedProduct.name} {quantity} {selectedProduct.unit}（總計 NT${' '}
                  {pricingInfo.totalAmount.toLocaleString()}）
                </span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-stone-500 mt-2">
            送出後將自動寫入 Google Sheet（相容 7-11 賣貨便_訂單匯入.xlsm 格式），若有填寫 Email 將同步寄發確認信。
          </p>
        </div>
      </form>

      {/* 訂單完成 Modal */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-amber-200 animate-in fade-in zoom-in duration-300 my-8">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold font-serif text-amber-950">
                完成訂單！感謝您的預訂
              </h3>
              <p className="text-xs sm:text-sm text-stone-600">
                您的訂單已成功送出並寫入 Google Sheet 訂單系統。
                {completedOrder.email && (
                  <span className="block text-emerald-700 font-semibold mt-1">
                    ✉️ 已同步發送訂單確認信至：{completedOrder.email}
                  </span>
                )}
              </p>
            </div>

            <div className="mt-5 bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-amber-200/60">
                <span className="text-stone-500">訂單編號</span>
                <span className="font-mono font-bold text-amber-900">
                  {completedOrder.orderId}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-amber-200/60">
                <span className="text-stone-500">訂購商品 / 溫層</span>
                <span className="font-bold text-stone-800">
                  {completedOrder.productName} × {completedOrder.quantity} 盒（{completedOrder.tempZone}）
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-amber-200/60">
                <span className="text-stone-500">收件人姓名 / 手機</span>
                <span className="font-semibold text-stone-800">
                  {completedOrder.recipientName} / {completedOrder.recipientPhone}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-amber-200/60">
                <span className="text-stone-500">取貨方式 / 門市</span>
                <span className="font-bold text-amber-900">
                  {completedOrder.deliveryMethod === 'self_pickup'
                    ? '自取（現場自取，免運費）'
                    : `${completedOrder.storeName} (${completedOrder.storeCode})`}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-amber-200/60">
                <span className="text-stone-500">買家下訂日期 / 希望送達日</span>
                <span className="font-semibold text-stone-800">
                  {completedOrder.orderDate} ／ {completedOrder.expectedDeliveryDate}
                </span>
              </div>
              <div className="py-1 border-b border-amber-200/60">
                <span className="text-stone-500 block mb-1">寫入備註內容</span>
                <span className="text-xs font-mono text-stone-700 bg-white p-2 rounded border border-amber-200 block">
                  {completedOrder.compiledItemNotes}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-amber-200/60">
                <span className="text-stone-500">訂單金額 ＋ 運費金額</span>
                <span className="font-semibold text-stone-800">
                  NT$ {completedOrder.orderAmount.toLocaleString()} ＋ NT$ {completedOrder.shippingFee}
                </span>
              </div>
              <div className="flex justify-between py-2 text-base">
                <span className="font-bold text-amber-950">應付總金額</span>
                <span className="font-extrabold text-amber-700 font-serif">
                  NT$ {completedOrder.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setCompletedOrder(null);
                setCaptchaInput('');
              }}
              className="mt-6 w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl shadow transition cursor-pointer"
            >
              完成並返回商品頁面
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

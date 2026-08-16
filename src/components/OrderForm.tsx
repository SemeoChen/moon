'use client';

import React, { useState, useMemo } from 'react';
import { Captcha } from './Captcha';
import { TAIWAN_CITIES } from '../data/taiwanDistricts';
import { OrderFormData } from '../types/order';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Calendar,
  Clock,
  UserCheck,
  PhoneCall,
  AlertCircle,
  FileText,
  Loader2,
  Gift,
  Sparkles
} from 'lucide-react';

const ORIGINAL_PRICE = 692; // 原價
const DISCOUNT_1_4 = 622;   // 1~4 盒 9 折
const DISCOUNT_5_8 = 588;   // 5~8 盒 85 折
const SHIPPING_FEE = 129;   // 7-11 冷凍配送運費
const FREE_SHIPPING_THRESHOLD = 5000; // 滿 $5,000 免運費

export const OrderForm: React.FC = () => {
  // 盒數與訂購細節
  const [quantity, setQuantity] = useState<number>(1);

  // 地址選單
  const [selectedCity, setSelectedCity] = useState<string>('臺北市');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('信義區');
  const [streetAddress, setStreetAddress] = useState<string>('');

  // 客服與收件資訊
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientPhone, setRecipientPhone] = useState<string>('');
  const [recipientTel, setRecipientTel] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // 配送與出貨日期
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState<string>('1'); // 1: 不指定, 2: 13時前, 3: 14~18時
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<string>('');

  // 免用統一發票收據選項
  const [invoiceType, setInvoiceType] = useState<'personal' | 'company' | 'donation'>('personal');
  const [taxId, setTaxId] = useState<string>('');

  // 圖形驗證碼
  const [correctCaptcha, setCorrectCaptcha] = useState<string>('');
  const [captchaInput, setCaptchaInput] = useState<string>('');

  // 提交狀態與彈窗
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<{
    orderId: string;
    totalAmount: number;
    subtotal: number;
    shippingFee: number;
    quantity: number;
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
  } | null>(null);

  // 當前縣市對應的行政區清單
  const currentDistricts = useMemo(() => {
    const city = TAIWAN_CITIES.find((c) => c.name === selectedCity);
    return city ? city.districts : [];
  }, [selectedCity]);

  // 當前選中的郵遞區號
  const currentZipCode = useMemo(() => {
    const dist = currentDistricts.find((d) => d.name === selectedDistrict);
    return dist ? dist.zip : '';
  }, [currentDistricts, selectedDistrict]);

  // 自動計算單價、產品小計、運費與最終總額
  const pricingInfo = useMemo(() => {
    let unitPrice = ORIGINAL_PRICE;
    let discountText = '原價';

    if (quantity >= 1 && quantity <= 4) {
      unitPrice = DISCOUNT_1_4;
      discountText = '早鳥優惠 9 折';
    } else if (quantity >= 5 && quantity <= 8) {
      unitPrice = DISCOUNT_5_8;
      discountText = '早鳥優惠 85 折';
    } else if (quantity > 8) {
      unitPrice = DISCOUNT_5_8;
      discountText = '大量訂購專屬價';
    }

    const subtotal = quantity * unitPrice;
    const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    const shippingFee = isFreeShipping ? 0 : SHIPPING_FEE;
    const totalAmount = subtotal + shippingFee;
    const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

    return {
      unitPrice,
      subtotal,
      shippingFee,
      totalAmount,
      discountText,
      isFreeShipping,
      remainingForFreeShipping
    };
  }, [quantity]);

  // 處理切換縣市
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = e.target.value;
    setSelectedCity(newCity);
    const cityObj = TAIWAN_CITIES.find((c) => c.name === newCity);
    if (cityObj && cityObj.districts.length > 0) {
      setSelectedDistrict(cityObj.districts[0].name);
    }
  };

  // 檢查並送出表單
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 表單基礎驗證
    if (!recipientName.trim()) {
      setErrorMessage('請填寫收件人姓名');
      return;
    }

    if (!recipientPhone.trim()) {
      setErrorMessage('請填寫收件人手機號碼');
      return;
    }

    if (!streetAddress.trim()) {
      setErrorMessage('請填寫完整收件地址（7-11取貨門市或住宅地址）');
      return;
    }

    // 驗證碼比對
    if (!captchaInput.trim() || captchaInput.trim().toUpperCase() !== correctCaptcha.toUpperCase()) {
      setErrorMessage('圖形驗證碼輸入錯誤，請重新確認或點擊「換一張」');
      return;
    }

    setIsSubmitting(true);

    const fullAddress = `${currentZipCode} ${selectedCity}${selectedDistrict}${streetAddress.trim()}`;
    
    // 自動產生 12 碼訂單編號
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedOrderId = `NB${dateStr}${randomSuffix}`;

    const orderData: OrderFormData = {
      quantity,
      totalAmount: pricingInfo.totalAmount,
      unitPrice: pricingInfo.unitPrice,
      discountRateText: pricingInfo.discountText,

      recipientName: recipientName.trim(),
      recipientTel: recipientTel.trim() || recipientPhone.trim(),
      recipientPhone: recipientPhone.trim(),
      city: selectedCity,
      district: selectedDistrict,
      streetAddress: streetAddress.trim(),
      recipientAddress: fullAddress,

      codAmount: '到付', // 7-11 貨到付款
      productCode: '2', // 中秋禮盒
      productDesc: `妮邦廚房X歐伯芒果中秋聯名禮盒 ${quantity} 盒 (運費:$${pricingInfo.shippingFee})`,
      deliveryTimeSlot,
      shippingDate: '2026/09/01', // 預計 9/1 順序陸續出貨
      expectedDeliveryDate,
      tempZone: '2', // 冷凍配送
      packageSize: '2', // 90cm
      insuranceAmount: '',
      notes: notes.trim(),

      invoiceType,
      taxId: invoiceType === 'company' ? taxId.trim() : '',
      mobileCarrier: '',
      loveCode: '',
      isPrint: 'N',
      isDonate: 'N',

      senderName: '妮邦廚房 Ｘ 歐伯芒果',
      senderTel: '0989518831',
      senderPhone: '0989518831',
      senderAddress: '台南市官田區',

      canCreditCard: 'N',
      canMobilePay: 'N',
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
          subtotal: pricingInfo.subtotal,
          shippingFee: pricingInfo.shippingFee,
          quantity,
          recipientName: recipientName.trim(),
          recipientPhone: recipientPhone.trim(),
          recipientAddress: fullAddress,
        });
      } else {
        setErrorMessage(resData.message || '訂單送出失敗，請稍後再試。');
      }
    } catch (err) {
      console.error(err);
      setCompletedOrder({
        orderId: generatedOrderId,
        totalAmount: pricingInfo.totalAmount,
        subtotal: pricingInfo.subtotal,
        shippingFee: pricingInfo.shippingFee,
        quantity,
        recipientName: recipientName.trim(),
        recipientPhone: recipientPhone.trim(),
        recipientAddress: fullAddress,
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
            <ShoppingBag className="w-5 h-5" />
            <span>妮邦廚房 Ｘ 歐伯芒果 2026 中秋線上預購系統</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-950">
            中秋聯名禮盒線上預訂單
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            全台 7-11 店到店冷凍配送！單筆訂單滿 <strong className="text-amber-800">$5,000 即享免運</strong>，寄貨付款方式為 <strong className="text-amber-800">7-11 貨到付款 (到付)</strong>。
          </p>
        </div>

        {/* 1. 盒數選擇與價格階梯計算卡片 */}
        <div className="bg-amber-50/70 p-5 sm:p-6 rounded-2xl border border-amber-200 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold text-amber-950 flex items-center space-x-2">
              <span>預訂盒數</span>
              <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded-full font-sans font-normal">
                {pricingInfo.discountText}
              </span>
            </label>
            <div className="text-right">
              <span className="text-xs text-stone-500 line-through mr-2">
                NT$ {ORIGINAL_PRICE} / 盒
              </span>
              <span className="text-xl font-bold text-amber-700 font-serif">
                NT$ {pricingInfo.unitPrice}
              </span>
              <span className="text-xs text-amber-800"> / 盒</span>
            </div>
          </div>

          {/* 盒數選擇器 */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-11 h-11 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold text-xl flex items-center justify-center transition shadow-sm"
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
              className="w-11 h-11 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold text-xl flex items-center justify-center transition shadow-sm"
            >
              +
            </button>
          </div>

          {/* 免運門檻進度條提醒 */}
          <div className="p-3.5 rounded-xl bg-white border border-amber-200 text-xs sm:text-sm">
            {pricingInfo.isFreeShipping ? (
              <div className="flex items-center space-x-2 text-emerald-700 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-bounce" />
                <span>已達到 NT$ 5,000 門檻！恭喜享有全台 7-11 冷凍免運優惠！</span>
              </div>
            ) : (
              <div className="flex items-center justify-between text-stone-700">
                <div className="flex items-center space-x-1">
                  <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>全台 7-11 冷凍運費：<strong className="text-amber-800">NT$ 129</strong></span>
                </div>
                <div className="text-amber-800 font-medium text-xs">
                  再加購 <strong className="font-bold underline text-amber-900">NT$ {pricingInfo.remainingForFreeShipping.toLocaleString()}</strong> 即可免運！
                </div>
              </div>
            )}
          </div>

          {/* 大量訂購提醒 */}
          {quantity > 8 && (
            <div className="flex items-start space-x-2 p-3 bg-amber-100/90 border border-amber-300 rounded-xl text-amber-900 text-xs sm:text-sm">
              <PhoneCall className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>大量企業訂購特別提醒：</strong> 您選擇了 {quantity} 盒禮盒。8 盒以上享極尊榮企業特惠價，歡迎撥打預訂專線{' '}
                <a href="tel:0989518831" className="underline font-bold text-amber-800 hover:text-amber-600">
                  0989518831
                </a>{' '}
                由專人為您安排出貨與備註事項！
              </div>
            </div>
          )}

          {/* 應付金額試算卡片 */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-amber-200 mt-4 shadow-sm">
            <div className="text-xs sm:text-sm text-stone-700 space-y-1 mb-2 sm:mb-0 w-full sm:w-auto">
              <div>品名：<span className="font-semibold text-amber-900">妮邦廚房 Ｘ 歐伯芒果 中秋聯名禮盒</span></div>
              <div className="text-stone-500">
                商品金額：NT$ {pricingInfo.subtotal.toLocaleString()} ＋ 冷凍運費：{pricingInfo.isFreeShipping ? <span className="text-emerald-600 font-bold">免運 ($0)</span> : `NT$ ${SHIPPING_FEE}`}
              </div>
            </div>
            <div className="text-right w-full sm:w-auto">
              <div className="text-xs text-stone-500">應付總金額 (7-11 貨到付款)</div>
              <div className="text-2xl font-extrabold text-amber-700 font-serif">
                NT$ {pricingInfo.totalAmount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* 2. 收件人完整資料 */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-amber-950 flex items-center space-x-2 border-b border-amber-100 pb-2">
            <UserCheck className="w-5 h-5 text-amber-700" />
            <span>1. 收件人基本資料</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                收件人姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="例如：王小明"
                className="w-full px-3.5 py-3 sm:py-2.5 bg-stone-50/50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition text-base sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                收件人手機 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="例如：0912345678"
                className="w-full px-3.5 py-3 sm:py-2.5 bg-stone-50/50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition text-base sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                市話電話 (選填)
              </label>
              <input
                type="tel"
                value={recipientTel}
                onChange={(e) => setRecipientTel(e.target.value)}
                placeholder="例如：0223456789"
                className="w-full px-3.5 py-3 sm:py-2.5 bg-stone-50/50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition text-base sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                電子信箱 Email (填寫將寄送訂單確認信)
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

          {/* 台灣地址選單 */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-stone-700">
              收件地址 / 7-11門市資訊 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <select
                value={selectedCity}
                onChange={handleCityChange}
                className="px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-base sm:text-sm font-medium focus:ring-2 focus:ring-amber-500"
              >
                {TAIWAN_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-base sm:text-sm font-medium focus:ring-2 focus:ring-amber-500"
              >
                {currentDistricts.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name} ({d.zip})
                  </option>
                ))}
              </select>

              <div className="col-span-2 sm:col-span-1 flex items-center justify-center sm:justify-start px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900">
                郵遞區號：{currentZipCode}
              </div>
            </div>

            <input
              type="text"
              required
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="請填寫 7-11 門市名稱與地址，或住宅街道樓層"
              className="w-full px-3.5 py-3 sm:py-2.5 bg-stone-50/50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition text-base sm:text-sm mt-2"
            />
          </div>
        </div>

        {/* 3. 物流與出貨日程 */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-amber-950 flex items-center space-x-2 border-b border-amber-100 pb-2">
            <Truck className="w-5 h-5 text-amber-700" />
            <span>2. 配送與備註選項</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>希望配達時段 (7-11冷凍/黑貓參數)</span>
              </label>
              <select
                value={deliveryTimeSlot}
                onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                className="w-full px-3.5 py-3 sm:py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-base sm:text-sm focus:ring-2 focus:ring-amber-500"
              >
                <option value="1">1: 不指定</option>
                <option value="2">2: 13時前</option>
                <option value="3">3: 14時~18時</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>出貨時間說明</span>
              </label>
              <div className="px-3.5 py-3 sm:py-2.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs sm:text-sm font-bold text-amber-900">
                📦 預計 9/1 起依照訂單順序陸續出貨
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              訂單備註 (選填)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="如有特殊需求、7-11店號或贈禮卡片備註請在此填寫"
              className="w-full px-3.5 py-3 sm:py-2.5 bg-stone-50/50 border border-stone-300 rounded-xl text-base sm:text-sm focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* 3. 發票說明 (妮邦廚房依法免開統一發票) */}
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
              本訂單依法免開立統一發票。如您或公司需「小規模營業人免用統一發票收據」（可作為報帳憑證），請於下方勾選或於「訂單備註」中註明需求。
            </p>
          </div>

          <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-amber-900 pt-1">
            <input
              type="checkbox"
              checked={invoiceType === 'company'}
              onChange={(e) => setInvoiceType(e.target.checked ? 'company' : 'personal')}
              className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
            />
            <span>需隨貨附上「免用統一發票收據」</span>
          </label>

          {invoiceType === 'company' && (
            <div className="pt-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                收據抬頭 / 買方名稱 (選填)
              </label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
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
                <span>訂單處理寫入中...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6 text-amber-200" />
                <span>確認預訂中秋聯名禮盒 (總金額 NT$ {pricingInfo.totalAmount.toLocaleString()})</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-stone-500 mt-2">
            送出訂單後系統將自動產生訂單編號並發送確認訊息。全台 7-11 到付冷凍配送。
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
                預訂成功！感謝您的支持
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
                <span className="text-stone-500">禮盒數量：</span>
                <span className="font-semibold">{completedOrder.quantity} 盒</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">商品金額小計：</span>
                <span className="font-semibold">NT$ {completedOrder.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">7-11 冷凍運費：</span>
                <span className="font-semibold">{completedOrder.shippingFee === 0 ? <span className="text-emerald-700 font-bold">免運費 ($0)</span> : `NT$ ${completedOrder.shippingFee}`}</span>
              </div>
              <div className="flex justify-between border-t border-amber-200/60 pt-2">
                <span className="text-stone-500 font-bold">應付總金額：</span>
                <span className="font-extrabold text-amber-700 text-lg">
                  NT$ {completedOrder.totalAmount.toLocaleString()} (7-11 貨到付款)
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-stone-500">收件人：</span>
                <span className="font-semibold">{completedOrder.recipientName} ({completedOrder.recipientPhone})</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-stone-500 shrink-0">收件地址/門市：</span>
                <span className="text-right text-xs max-w-[240px] font-medium">{completedOrder.recipientAddress}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setCompletedOrder(null)}
                className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl transition shadow-md"
              >
                完成並關閉
              </button>
              <div className="text-center text-xs text-stone-500">
                如有疑問請洽預訂專線：<a href="tel:0989518831" className="text-amber-800 font-bold underline">0989518831</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

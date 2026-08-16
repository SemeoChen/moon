export interface OrderFormData {
  // 產品與金額
  quantity: number;
  totalAmount: number;
  unitPrice: number;
  discountRateText: string;

  // 收件者資訊
  recipientName: string;
  recipientTel: string;
  recipientPhone: string;
  city: string;
  district: string;
  streetAddress: string;
  recipientAddress: string;
  
  // 物流與出貨細節 (對應 ezprint)
  codAmount: string; // 代收金額或到付 (預設 "到付" 或 金額數字)
  productCode: string; // 品名 (詳參數表 預設 2: 中秋禮盒)
  productDesc: string; // 品名說明
  deliveryTimeSlot: string; // 1: 不指定, 2: 13時前, 3: 14時~18時
  shippingDate: string; // 出貨日期 (YYYY/MM/DD)
  expectedDeliveryDate: string; // 預定配達日期 (YYYY/MM/DD)
  tempZone: string; // 溫層: 1:常溫, 2:冷藏, 3:冷凍 (預設 1)
  packageSize: string; // 尺寸: 1:60cm, 2:90cm, 3:120cm, 4:150cm (預設 2)
  insuranceAmount: string; // 保值金額 (20001~10萬之間)
  notes: string; // 備註

  // 發票與載具
  invoiceType: 'personal' | 'company' | 'donation';
  taxId: string; // 統一編號
  mobileCarrier: string; // 手機載具
  loveCode: string; // 愛心碼
  isPrint: 'Y' | 'N';
  isDonate: 'Y' | 'N';

  // 寄件者資訊 (預設妮邦廚房)
  senderName: string;
  senderTel: string;
  senderPhone: string;
  senderAddress: string;

  // 付款防禦與驗證
  canCreditCard: 'Y' | 'N';
  canMobilePay: 'Y' | 'N';
  email: string;
  captchaInput: string;
}

export interface OrderSubmissionResult {
  success: boolean;
  orderId?: string;
  message?: string;
}

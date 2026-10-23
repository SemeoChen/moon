export interface OrderFormData {
  // 取貨/配送方式
  deliveryMethod?: '7-11' | 'self_pickup';

  // 產品與金額
  productId: string;
  productName: string; // 商品名稱 (例如：芒果恰克)
  quantity: number;    // 訂購盒數
  unitPrice: number;   // 單盒售價 (例如：250)
  orderAmount: number; // 訂單金額 (商品小計)
  shippingFee: number; // 運費金額 (自取 $0 / 未滿千 $120 / 滿千 $100 / 滿兩千 $80 / 滿三千 $0)
  totalAmount: number; // 應付總金額 = orderAmount + shippingFee

  // 買家 / 收件人資訊 (相容 7-11 賣貨便_訂單匯入.xlsm 格式)
  recipientName: string;  // 收件人姓名
  recipientPhone: string; // 收件人手機 (10 碼數字)
  storeCode: string;      // 取件門市(代碼) (6 碼 7-11 門市店號 或 '自取')
  storeName: string;      // 取件門市(中文名稱 或 '現場自取')

  // 賣貨便固定與選填欄位
  tempZone: '冷凍' | '自取';    // 溫層固定為 '冷凍' 或 '自取'
  orderDate: string;            // 買家下訂日期 (YYYY/MM/DD)
  expectedDeliveryDate: string; // 希望送達日期 (YYYY/MM/DD)
  notes: string;                // 買家自填備註
  itemNotes: string;            // 商品備註 (寫入 Google Sheet：包含希望送達門市(中文)、送達日期、訂購盒數及買家備註)

  // 聯絡與驗證
  email: string;        // 寄件人/買家 EMAIL (若有填寫則發送確認信)
  captchaInput: string; // 四碼圖形驗證碼
}

export interface OrderSubmissionResult {
  success: boolean;
  orderId?: string;
  message?: string;
}

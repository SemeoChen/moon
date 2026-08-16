export interface OrderFormData {
  // 產品與金額
  quantity: number;
  unitPrice: number;
  discountRateText: string;
  orderAmount: number; // 商品金額小計
  shippingFee: number; // 運費金額 (滿$5,000免運費為 0，否則為 129)
  totalAmount: number; // 應付總金額 = orderAmount + shippingFee

  // 買家 / 收件人資訊 (賣貨便匯入格式)
  recipientName: string; // 取件人姓名 (上限 5 個中文字)
  recipientPhone: string; // 取件人手機 (10 碼數字，不含「-」)
  storeCode: string; // 取件門市 (6 碼 7-11 門市店號)
  storeName: string; // 取件門市中文名稱 (例如: 7-11 鑫昌門市)

  // 賣貨便固定與選填欄位
  tempZone: '冷凍'; // 溫層固定為 '冷凍'
  productName: '中秋聯名禮盒'; // 商品固定為 '中秋聯名禮盒'
  orderDate: string; // 買家下訂日期 (YYYY/MM/DD)
  expectedDeliveryDate: string; // 希望送達日期 (YYYY/MM/DD)
  notes: string; // 買家原始備註
  itemNotes: string; // 商品備註 (包含門市中文、送達日期與訂購盒數)

  // 聯絡與驗證
  email: string; // 買家 EMAIL
  captchaInput: string;
}

export interface OrderSubmissionResult {
  success: boolean;
  orderId?: string;
  message?: string;
}

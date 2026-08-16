/**
 * 妮邦廚房中秋禮盒訂購系統 - Google Apps Script (GAS) 部署腳本
 * 
 * 部署說明：
 * 1. 在 Google Drive 建立一個新的 Google Sheet，命名為「妮邦廚房中秋禮盒訂單」
 * 2. 第一列貼上以下 27 個欄位名稱 (如 ezprint_sample_v2.csv 格式)：
 *    [收件人姓名, 收件人電話, 收件人手機, 收件人地址, 代收金額或到付, 件數, 品名, 備註, 訂單編號, 
 *     希望配達時間, 出貨日期, 預定配達日期, 溫層, 尺寸, 寄件人姓名, 寄件人電話, 寄件人手機, 
 *     寄件人地址, 保值金額, 品名說明, 是否列印, 是否捐贈, 統一編號, 手機載具, 愛心碼, 可刷卡, 手機支付]
 * 3. 點選「擴充功能」->「Apps Script」，將本檔內容複製貼上。
 * 4. 填入您的 LINE Notify Token (若需 LINE 推播)。
 * 5. 點選右上方「部署」->「新增部署」-> 選擇「Web 應用程式」。
 * 6. 執行身份選擇「我」，誰可以存取選擇「所有人 (Anyone)」。
 * 7. 部署後取得的 Web App URL 貼至前端環境變數或 `/api/order/route.ts` 中。
 */

// 填入您的 LINE Notify 權杖 (選填)
const LINE_NOTIFY_TOKEN = ""; 

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 如果工作表是空的，寫入標頭
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "收件人姓名", "收件人電話", "收件人手機", "收件人地址", "代收金額或到付", 
        "件數", "品名", "備註", "訂單編號", "希望配達時間", "出貨日期", 
        "預定配達日期", "溫層", "尺寸", "寄件人姓名", "寄件人電話", "寄件人手機", 
        "寄件人地址", "保值金額", "品名說明", "是否列印", "是否捐贈", "統一編號", 
        "手機載具", "愛心碼", "可刷卡", "手機支付", "訂購時間", "訂購者Email"
      ]);
    }
    
    // 準備寫入欄位數據 (按 ezprint_sample_v2.csv 格式)
    const row = [
      data.recipientName || "",
      data.recipientTel ? "'" + data.recipientTel : "",
      data.recipientPhone ? "'" + data.recipientPhone : "",
      data.recipientAddress || "",
      data.codAmount || "到付",
      data.quantity || 1,
      data.productCode || "中秋禮盒",
      data.notes || "",
      data.orderId || "",
      data.deliveryTimeSlot || "1",
      data.shippingDate || "",
      data.expectedDeliveryDate || "",
      data.tempZone || "1",
      data.packageSize || "2",
      data.senderName || "妮邦廚房",
      data.senderTel || "'0989518831",
      data.senderPhone || "'0989518831",
      data.senderAddress || "台灣",
      data.insuranceAmount || "",
      data.productDesc || "中秋經典手工禮盒",
      data.isPrint || "N",
      data.isDonate || "N",
      data.taxId || "",
      data.mobileCarrier || "",
      data.loveCode || "",
      data.canCreditCard || "N",
      data.canMobilePay || "N",
      new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" }),
      data.email || ""
    ];
    
    sheet.appendRow(row);
    
    // 1. 若有填寫 Email，發送訂單確認信
    if (data.email && data.email.includes("@")) {
      sendCustomerEmail(data);
    }
    
    // 2. 若有設定 LINE Notify，推播給管理員
    if (LINE_NOTIFY_TOKEN) {
      sendLineNotification(data);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "訂單已成功寫入！",
      orderId: data.orderId 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendCustomerEmail(data) {
  const subject = `【妮邦廚房】中秋禮盒訂購成功通知 - 訂單編號 ${data.orderId}`;
  const body = `
尊貴的 ${data.recipientName} 您好：

感謝您預訂【妮邦廚房中秋禮盒】！我們已收到您的訂單細節如下：

==========================================
■ 訂單編號：${data.orderId}
■ 訂購品項：妮邦廚房中秋禮盒 x ${data.quantity} 盒
■ 應付總金額：NT$ ${data.totalAmount} (7-ELEVEN 貨到付款)
■ 收件人：${data.recipientName}
■ 聯絡手機：${data.recipientPhone}
■ 收件地址：${data.recipientAddress}
■ 希望配達時段：${data.deliveryTimeSlot === "2" ? "13時前" : data.deliveryTimeSlot === "3" ? "14時~18時" : "不指定"}
==========================================

我們將安排於預定出貨日進行備貨與出貨，出貨時會發送通知。
如有任何問題，歡迎隨時聯繫客服專線：0989518831。

祝您中秋佳節愉快！
妮邦廚房 敬上
`;

  MailApp.sendEmail(data.email, subject, body);
}

function sendLineNotification(data) {
  const message = `
\n🌕【妮邦廚房中秋禮盒 - 新訂單通知】
--------------------------------
訂單編號：${data.orderId}
訂購數量：${data.quantity} 盒
總金額：$${data.totalAmount} (貨到付款)
收件人：${data.recipientName}
手機：${data.recipientPhone}
地址：${data.recipientAddress}
備註：${data.notes || "無"}
  `;
  
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", {
    "method": "post",
    "headers": {
      "Authorization": "Bearer " + LINE_NOTIFY_TOKEN
    },
    "payload": {
      "message": message
    }
  });
}

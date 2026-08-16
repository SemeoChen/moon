/**
 * 妮邦廚房 Ｘ 歐伯芒果 中秋禮盒訂購系統 - Google Apps Script (GAS) 部署腳本
 * 
 * 本腳本完全相容「7-11 賣貨便_訂單匯入.xlsm」格式規範！
 * 
 * 部署步驟：
 * 1. 建立一個新的 Google Sheet，命名為「妮邦廚房_賣貨便訂單匯入」
 * 2. 第一列欄位設定如下 (或留空由腳本自動生成標頭)：
 *    [取件人姓名, 取件人手機, 取件門市, 溫層, 商品, 訂單金額, 運費金額, 買家下訂日期, 商品備註, 寄件人EMAIL, 希望送達日期]
 * 3. 點選「擴充功能」->「Apps Script」，將本檔內容貼上。
 * 4. 可選填 LINE_NOTIFY_TOKEN 以獲得即時訂單通知。
 * 5. 點選右上方「部署」->「新增部署」-> 選擇「Web 應用程式」。
 * 6. 執行身份選擇「我 (Me)」，存取權選擇「所有人 (Anyone)」。
 * 7. 將取得的 Web App URL 設定至環境變數 GOOGLE_SHEET_WEBHOOK_URL 中。
 */

const LINE_NOTIFY_TOKEN = ""; // 可填入 LINE Notify 權杖

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 若工作表為空，自動寫入相容「賣貨便_訂單匯入.xlsm」標頭
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "取件人姓名",
        "取件人手機",
        "取件門市",
        "溫層",
        "商品",
        "訂單金額",
        "運費金額",
        "買家下訂日期",
        "商品備註",
        "寄件人EMAIL",
        "希望送達日期"
      ]);
    }
    
    // 組合商品備註：門市中文 + 希望送達日期 + 訂購盒數 + 客人自訂備註
    const compiledItemNotes = `【取件門市: ${data.storeName || "門市"}】 【希望送達日期: ${data.expectedDeliveryDate || "無"}】 【訂購盒數: ${data.quantity || 1}盒】 ${data.notes ? "備註: " + data.notes : ""}`;
    
    // 準備寫入數據 (對應賣貨便格式)
    const row = [
      data.recipientName || "",
      data.recipientPhone ? "'" + data.recipientPhone : "",
      data.storeCode ? "'" + data.storeCode : "",
      "冷凍", // 溫層固定為冷凍
      "中秋聯名禮盒", // 商品固定為中秋聯名禮盒
      data.orderAmount || 0, // 訂單金額 (商品小計)
      data.shippingFee !== undefined ? data.shippingFee : 129, // 運費金額
      data.orderDate || new Date().toLocaleDateString("zh-TW"), // 買家下訂日期
      compiledItemNotes, // 商品備註 (包含門市中文、送達日期與盒數)
      data.email || "", // 寄件人/買家 EMAIL
      data.expectedDeliveryDate || "" // 希望送達日期
    ];
    
    sheet.appendRow(row);
    
    // 1. 若買家有填寫 Email，發送訂單確認信
    if (data.email && data.email.includes("@")) {
      sendCustomerEmail(data, compiledItemNotes);
    }
    
    // 2. 若有設定 LINE Notify，推播給管理員
    if (LINE_NOTIFY_TOKEN) {
      sendLineNotification(data, compiledItemNotes);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "訂單已成功寫入 Google Sheet (相容賣貨便匯入格式)！",
      orderId: data.orderId 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendCustomerEmail(data, compiledItemNotes) {
  const subject = `【妮邦廚房 Ｘ 歐伯芒果】中秋聯名禮盒預訂成功通知`;
  const body = `
尊貴的 ${data.recipientName} 您好：

感謝您預訂【妮邦廚房 Ｘ 歐伯芒果 中秋聯名禮盒】！我們已收到您的訂單明細：

==========================================
■ 訂購品項：妮邦廚房 Ｘ 歐伯芒果 中秋聯名禮盒 x ${data.quantity} 盒
■ 商品金額：NT$ ${data.orderAmount}
■ 7-11 冷凍運費：NT$ ${data.shippingFee} (單筆滿 $5,000 免運)
■ 應付總金額：NT$ ${data.totalAmount} (7-11 貨到付款)
==========================================
■ 取件人：${data.recipientName}
■ 手機號碼：${data.recipientPhone}
■ 7-11 取件門市：${data.storeName} (門市代碼: ${data.storeCode})
■ 希望送達日期：${data.expectedDeliveryDate || "無"}
■ 明細備註：${compiledItemNotes}
==========================================

我們將預計於 9/1 起依照訂單順序陸續安排出貨。
如有任何問題，歡迎隨時聯繫客服專線：0989518831。

祝您中秋佳節愉快！
妮邦廚房 Ｘ 歐伯芒果 敬上
`;

  MailApp.sendEmail(data.email, subject, body);
}

function sendLineNotification(data, compiledItemNotes) {
  const message = `
\n🌕【妮邦廚房 Ｘ 歐伯芒果 - 新訂單通知】
--------------------------------
取件人：${data.recipientName} (${data.recipientPhone})
7-11門市：${data.storeName} (店號: ${data.storeCode})
訂購數量：${data.quantity} 盒
商品小計：$${data.orderAmount}
運費金額：$${data.shippingFee}
總金額：$${data.totalAmount} (到付)
備註說明：${compiledItemNotes}
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

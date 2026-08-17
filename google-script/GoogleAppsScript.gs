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
 * 4. 設定 ADMIN_EMAIL 為 bonnie70280@gmail.com。
 * 5. 點選右上方「部署」->「新增部署」-> 選擇「Web 應用程式」。
 * 6. 執行身份選擇「我 (Me)」，存取權選擇「所有人 (Anyone)」。
 * 7. 將取得的 Web App URL 設定至 Next.js 環境變數 GOOGLE_SHEET_WEBHOOK_URL 中。
 */

const ADMIN_EMAIL = "bonnie70280@gmail.com"; // 管理員通知 EMAIL
const LINE_NOTIFY_TOKEN = ""; // 可填入 LINE Notify 權杖 (選填)

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
    
    const isSelfPickup = data.deliveryMethod === 'self_pickup' || data.storeCode === '自取' || data.storeName === '現場自取';
    const storeDisplayName = isSelfPickup ? "現場自取" : (data.storeName || "7-11門市");
    const storeCodeDisplay = isSelfPickup ? "自取" : (data.storeCode || "自取");

    // 組合商品備註：門市/自取 + 希望送達日期 + 訂購盒數 + 客人自訂備註
    const compiledItemNotes = isSelfPickup
      ? `【取件方式: 現場自取】 【希望取貨日期: ${data.expectedDeliveryDate || "無"}】 【訂購盒數: ${data.quantity || 1}盒】 ${data.notes ? "備註: " + data.notes : ""}`
      : `【取件門市: ${storeDisplayName} (${storeCodeDisplay})】 【希望送達日期: ${data.expectedDeliveryDate || "無"}】 【訂購盒數: ${data.quantity || 1}盒】 ${data.notes ? "備註: " + data.notes : ""}`;
    
    // 準備寫入數據 (對應賣貨便格式)
    const row = [
      data.recipientName || "",
      data.recipientPhone ? "'" + data.recipientPhone : "",
      storeCodeDisplay ? "'" + storeCodeDisplay : "",
      isSelfPickup ? "自取" : "冷凍", // 溫層
      "中秋聯名禮盒", // 商品固定為中秋聯名禮盒
      data.orderAmount || 0, // 訂單金額 (商品小計)
      data.shippingFee !== undefined ? data.shippingFee : (isSelfPickup ? 0 : 129), // 運費金額
      data.orderDate || new Date().toLocaleDateString("zh-TW"), // 買家下訂日期
      compiledItemNotes, // 商品備註
      data.email || "", // 寄件人/買家 EMAIL
      data.expectedDeliveryDate || "" // 希望送達日期
    ];
    
    sheet.appendRow(row);
    
    // 1. 若買家有填寫 Email，發送買家訂單確認信
    if (data.email && data.email.includes("@")) {
      sendCustomerEmail(data, compiledItemNotes, isSelfPickup);
    }

    // 2. 寄送新訂單 EMAIL 通知給管理員 (bonnie70280@gmail.com)
    if (ADMIN_EMAIL) {
      sendAdminEmail(data, compiledItemNotes, isSelfPickup);
    }
    
    // 3. 若有設定 LINE Notify，推播給管理員
    if (LINE_NOTIFY_TOKEN) {
      sendLineNotification(data, compiledItemNotes, isSelfPickup);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "訂單已成功寫入 Google Sheet 並發送通知信！",
      orderId: data.orderId 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 發送買家確認信
function sendCustomerEmail(data, compiledItemNotes, isSelfPickup) {
  const subject = `【妮邦廚房 Ｘ 歐伯芒果】中秋聯名禮盒預訂成功通知`;
  const body = `
尊貴的 ${data.recipientName} 您好：

感謝您預訂【妮邦廚房 Ｘ 歐伯芒果 中秋聯名禮盒】！我們已收到您的訂單明細：

==========================================
■ 訂購品項：妮邦廚房 Ｘ 歐伯芒果 中秋聯名禮盒 x ${data.quantity} 盒
■ 取貨方式：${isSelfPickup ? "現場自取 (免運費)" : "7-11 冷凍店到店配送"}
■ 商品金額：NT$ ${data.orderAmount}
■ 運費金額：NT$ ${data.shippingFee} ${isSelfPickup ? "(免運費)" : "(單筆滿 $5,000 免運)"}
■ 應付總金額：NT$ ${data.totalAmount}
==========================================
■ 取件人：${data.recipientName}
■ 手機號碼：${data.recipientPhone}
■ 取貨地點：${isSelfPickup ? "現場自取" : `${data.storeName} (門市代碼: ${data.storeCode})`}
■ 希望${isSelfPickup ? "取貨" : "送達"}日期：${data.expectedDeliveryDate || "未指定"}
■ 明細備註：${compiledItemNotes}
==========================================

預計於 9/1 起陸續為您安排出貨/取貨。
如有任何問題，歡迎隨時聯繫客服專線：0989518831。

祝您中秋佳節愉快！
妮邦廚房 Ｘ 歐伯芒果 敬上
`;

  MailApp.sendEmail(data.email, subject, body);
}

// 發送管理員新訂單通知信 (bonnie70280@gmail.com)
function sendAdminEmail(data, compiledItemNotes, isSelfPickup) {
  const subject = `【新訂單通知】${data.recipientName} 預訂 ${data.quantity} 盒中秋聯名禮盒 (總金額 $${data.totalAmount})`;
  const body = `
妮邦廚房 管理員您好：

系統已收到一筆新的中秋聯名禮盒預訂單，明細如下：

==========================================
■ 訂單編號：${data.orderId || "自動編號"}
■ 取貨方式：${isSelfPickup ? "現場自取 (免運費)" : "7-11 冷凍店到店配送"}
■ 訂購盒數：${data.quantity} 盒
■ 商品金額：NT$ ${data.orderAmount}
■ 運費金額：NT$ ${data.shippingFee} ${isSelfPickup ? "(現場自取免運)" : ""}
■ 應付總額：NT$ ${data.totalAmount} (7-11 貨到付款/現場付費)
==========================================
■ 取件人姓名：${data.recipientName}
■ 取件人手機：${data.recipientPhone}
■ 7-11 取件門市：${isSelfPickup ? "現場自取 (免填門市)" : `${data.storeName} (門市代碼: ${data.storeCode})`}
■ 希望${isSelfPickup ? "取貨" : "送達"}日期：${data.expectedDeliveryDate || "未指定"}
■ 買家 EMAIL：${data.email || "未填寫"}
■ 完整備註說明：${compiledItemNotes}
==========================================
下訂時間：${new Date().toLocaleString("zh-TW")}
`;

  MailApp.sendEmail(ADMIN_EMAIL, subject, body);
}

// LINE Notify 推播通知
function sendLineNotification(data, compiledItemNotes, isSelfPickup) {
  const message = `
\n🌕【妮邦廚房 Ｘ 歐伯芒果 - 新訂單通知】
--------------------------------
取件人：${data.recipientName} (${data.recipientPhone})
取貨方式：${isSelfPickup ? "現場自取" : "7-11 店到店"}
7-11門市：${isSelfPickup ? "現場自取" : `${data.storeName} (店號: ${data.storeCode})`}
訂購數量：${data.quantity} 盒
商品小計：$${data.orderAmount}
運費金額：$${data.shippingFee}
總金額：$${data.totalAmount}
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

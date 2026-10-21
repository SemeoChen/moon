/**
 * 妮邦廚房 Ｘ 歐伯芒果 產品訂購系統 - Google Apps Script (GAS) 部署腳本
 *
 * 本腳本完全相容「D:\PROJECTS\moon\賣貨便_訂單匯入.xlsm」11 欄位格式規範：
 * [收件人姓名, 收件人手機, 取件門市(代碼), 溫層, 商品, 訂單金額, 運費金額, 買家下訂日期, 商品備註, 寄件人EMAIL, 希望送達日期]
 *
 * 功能特點：
 * 1. 溫層固定寫入 '冷凍'
 * 2. 買家填寫之希望送達門市(中文)、送達日期以及訂購盒數自動寫入 Google Sheet 的「商品備註」欄位內
 * 3. 如果買家有填寫 Email，自動發送 Email 訂單確認信給客人
 * 4. 同步發送新訂單通知信給管理員
 */

const ADMIN_EMAIL = "bonnie70280@gmail.com"; // 管理員通知 EMAIL

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

    const storeDisplayName = data.storeName || "7-11門市";
    const storeCodeDisplay = data.storeCode || "";
    const productName = data.productName || "芒果恰克";
    const quantity = data.quantity || 1;
    const expectedDeliveryDate = data.expectedDeliveryDate || "依序出貨";

    // 買家填寫之希望送達門市(中文)、送達日期以及訂購盒數寫入 Google Sheet 的備註內
    const compiledItemNotes = data.itemNotes ||
      `希望送達門市：${storeDisplayName}(${storeCodeDisplay})｜希望送達日期：${expectedDeliveryDate}｜訂購盒數：${quantity}盒${data.notes ? "｜買家備註：" + data.notes : ""}`;

    // 準備寫入數據 (完全對應賣貨便_訂單匯入.xlsm 欄位)
    const row = [
      data.recipientName || "",                             // 1. 收件人姓名
      data.recipientPhone ? "'" + data.recipientPhone : "", // 2. 收件人手機
      storeCodeDisplay ? "'" + storeCodeDisplay : "",       // 3. 取件門市(代碼)
      "冷凍",                                               // 4. 溫層 (固定為 '冷凍')
      productName,                                          // 5. 商品 (如：芒果恰克)
      data.orderAmount || 0,                                // 6. 訂單金額
      data.shippingFee !== undefined ? data.shippingFee : 120, // 7. 運費金額
      data.orderDate || new Date().toLocaleDateString("zh-TW"), // 8. 買家下訂日期
      compiledItemNotes,                                    // 9. 商品備註 (含中文門市、送達日、盒數)
      data.email || "",                                     // 10. 寄件人/買家 EMAIL
      expectedDeliveryDate                                  // 11. 希望送達日期
    ];

    sheet.appendRow(row);

    // 若買家有填寫 Email，發送確認信給客人
    if (data.email && data.email.includes("@")) {
      sendCustomerEmail(data, productName, compiledItemNotes);
    }

    // 寄送新訂單 EMAIL 通知給管理員
    if (ADMIN_EMAIL) {
      sendAdminEmail(data, productName, compiledItemNotes);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "訂單已成功寫入 Google Sheet！",
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
function sendCustomerEmail(data, productName, compiledItemNotes) {
  const subject = `【妮邦廚房 Ｘ 歐伯芒果】${productName} 訂單確認通知 (${data.orderId || ""})`;
  const body = `
親愛的 ${data.recipientName} 您好：

感謝您訂購【妮邦廚房 Ｘ 歐伯芒果】產品！我們已收到您的訂單，明細如下：

==========================================
■ 訂單編號：${data.orderId || "系統自動產生"}
■ 訂購商品：${productName} × ${data.quantity} 盒
■ 配送溫層：冷凍 (7-11 冷凍交貨便)
■ 訂單金額：NT$ ${data.orderAmount}
■ 運費金額：NT$ ${data.shippingFee}
■ 應付總金額：NT$ ${data.totalAmount}
==========================================
■ 收件人姓名：${data.recipientName}
■ 收件人手機：${data.recipientPhone}
■ 取件門市：${data.storeName} (代碼: ${data.storeCode})
■ 買家下訂日期：${data.orderDate}
■ 希望送達日期：${data.expectedDeliveryDate || "依序出貨"}
■ 商品備註：${compiledItemNotes}
==========================================

提醒您：收到「芒果恰克」後請直接放入冷凍庫保存，微冰享用風味最佳！
如有任何問題，歡迎聯繫我們。

妮邦廚房 Ｘ 歐伯芒果 敬上
`;

  MailApp.sendEmail(data.email, subject, body);
}

// 發送管理員新訂單通知信
function sendAdminEmail(data, productName, compiledItemNotes) {
  const subject = `【新訂單通知】${data.recipientName} 訂購 ${productName} x ${data.quantity}盒 (總計 $${data.totalAmount})`;
  const body = `
妮邦廚房 Ｘ 歐伯芒果 管理員您好：

系統收到一筆新訂單，已自動寫入 Google Sheet：

==========================================
■ 訂單編號：${data.orderId || "自動編號"}
■ 訂購商品：${productName}
■ 訂購盒數：${data.quantity} 盒
■ 溫層：冷凍
■ 訂單金額：NT$ ${data.orderAmount}
■ 運費金額：NT$ ${data.shippingFee}
■ 應付總額：NT$ ${data.totalAmount}
==========================================
■ 收件人姓名：${data.recipientName}
■ 收件人手機：${data.recipientPhone}
■ 取件門市(代碼)：${data.storeCode}
■ 取件門市(中文)：${data.storeName}
■ 買家下訂日期：${data.orderDate}
■ 希望送達日期：${data.expectedDeliveryDate || "依序出貨"}
■ 買家 EMAIL：${data.email || "未填寫"}
■ 商品備註：${compiledItemNotes}
==========================================
`;

  MailApp.sendEmail(ADMIN_EMAIL, subject, body);
}

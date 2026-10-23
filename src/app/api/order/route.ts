import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const isSelfPickup =
      body.deliveryMethod === 'self_pickup' ||
      body.storeCode === '自取' ||
      body.storeName === '現場自取';

    // 檢查基礎必填欄位 (收件人姓名、收件人手機)
    if (!body.recipientName || !body.recipientPhone) {
      return NextResponse.json(
        { success: false, message: '請填寫完整的收件人姓名與手機' },
        { status: 400 }
      );
    }

    // 若非自取，需驗證 7-11 取件門市代碼與名稱
    if (!isSelfPickup && (!body.storeCode || !body.storeName)) {
      return NextResponse.json(
        { success: false, message: '請選擇 7-11 取件門市' },
        { status: 400 }
      );
    }

    // 確保溫層與商品名稱設定正確
    const payload = {
      ...body,
      storeCode: isSelfPickup ? '自取' : body.storeCode,
      storeName: isSelfPickup ? '現場自取' : body.storeName,
      tempZone: isSelfPickup ? '自取' : '冷凍',
      productName: body.productName || '芒果恰克',
    };

    // 檢查是否有配置 Google Apps Script Webhook URL
    const gasWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

    if (gasWebhookUrl) {
      try {
        await fetch(gasWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (webhookErr) {
        console.error('Forwarding to Google Sheet Webhook failed:', webhookErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: '完成訂單！訂單已成功寫入系統。',
      orderId: body.orderId || `NB${Date.now()}`,
    });
  } catch (error) {
    console.error('Order API error:', error);
    return NextResponse.json(
      { success: false, message: '伺服器處理訂單時發生錯誤' },
      { status: 500 }
    );
  }
}

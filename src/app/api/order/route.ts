import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const isSelfPickup = body.deliveryMethod === 'self_pickup' || body.storeCode === '自取' || body.storeName === '現場自取';

    // 檢查基礎必填欄位 (取件人姓名、取件人手機)
    if (!body.recipientName || !body.recipientPhone) {
      return NextResponse.json(
        { success: false, message: '請填寫完整的取件人姓名與手機' },
        { status: 400 }
      );
    }

    // 若非現場自取，需驗證 7-11 門市資訊
    if (!isSelfPickup && (!body.storeCode || !body.storeName)) {
      return NextResponse.json(
        { success: false, message: '請選擇 7-11 取件門市' },
        { status: 400 }
      );
    }

    // 檢查是否有配置 Google Apps Script Webhook URL
    const gasWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

    if (gasWebhookUrl) {
      try {
        await fetch(gasWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } catch (webhookErr) {
        console.error('Forwarding to Google Sheet Webhook failed:', webhookErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: '訂單建立成功！',
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

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 檢查基礎必填欄位
    if (!body.recipientName || !body.recipientPhone || !body.recipientAddress) {
      return NextResponse.json(
        { success: false, message: '請填寫完整的收件人姓名、電話與地址' },
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

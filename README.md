# 妮邦廚房 2026 中秋禮盒訂購系統 (Nibang Kitchen Mid-Autumn Gift Box Order System)

本專案為 **妮邦廚房** 專屬打造的中秋禮盒線上預購系統，採用 Next.js 14、React、Tailwind CSS 開發，支援 Vercel 代管、Google Sheets 自動訂單紀錄 (ezprint 黑貓 27 欄位格式)、LINE 推播與 Email 確認信。

---

## 🌟 系統特色與功能

1. **產品視覺與輪播**：
   * 整合 `D:\PROJECTS\moon` 目錄下的 6 張優質禮盒產品照片。
   * 支援高畫質大圖切換與全螢幕 Lightbox 放大預覽。

2. **動態階梯式價格計算**：
   * 禮盒原價：**$692** / 盒
   * 早鳥優惠 **1~4 盒 9 折** (特價 **$622** / 盒)
   * 早鳥優惠 **5~8 盒 85 折** (特價 **$588** / 盒)
   * 大量訂購 (8盒以上)：自動跳出提醒，可撥打專線 `0989518831` 安排企業團購。
   * 寄貨付款方式：預設為 **7-ELEVEN 貨到付款 (到付)**。

3. **完全相容 Ezprint / 黑貓 27 欄位格式**：
   * 整合台灣縣市與鄉鎮市區二級選單，自動帶入郵遞區號。
   * 支援發票設定（個人/手機載具/統一編號/愛心碼捐贈）。
   * 支援希望配達時間（不指定 / 13時前 / 14-18時）與預定配達日期。

4. **4 碼圖形驗證碼 (Captcha)**：
   * 使用 HTML Canvas 即時繪製隨機 4 位數圖形驗證碼（含干擾點與干擾線），防止防刷與機器人。

5. **自動產生訂單編號**：
   * 每次送出自動生成 `NB` + 年月日 + 4位隨機碼（如 `NB202608168888`）。

---

## 🚀 本地開發與部署 (Vercel & GitHub)

### 1. 本地啟動開發伺服器
```bash
npm run dev
```
瀏覽器開啟 `http://localhost:3000` 即可預覽。

### 2. 部署至 Vercel
1. 將原始碼上傳至您的 GitHub 儲存庫。
2. 登入 [Vercel](https://vercel.com) 並匯入該 GitHub 專案。
3. 可在 Vercel Environment Variables 設定 `GOOGLE_SHEET_WEBHOOK_URL`（Google Apps Script Web App URL）。

---

## 📊 Google Sheets 與 LINE/Email 對接說明

隨附腳本檔案位於：[google-script/GoogleAppsScript.gs](file:///d:/PROJECTS/moon/google-script/GoogleAppsScript.gs)

1. 在 Google Drive 建立一個新的 Google Sheet，命名為「妮邦廚房中秋禮盒訂單」。
2. 點選「擴充功能」->「Apps Script」，貼上 `GoogleAppsScript.gs` 內容。
3. 可於腳本上方填入 LINE Notify Token。
4. 點選右上方「部署」->「新增部署」-> 選擇「Web 應用程式」（執行身分選擇「我」，存取權選擇「所有人」）。
5. 複製生成的網址，設定至環境變數或 `/api/order/route.ts` 即可！

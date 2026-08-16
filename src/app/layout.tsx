import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://nibang-moon.vercel.app'),
  title: '妮邦廚房 Ｘ 歐伯芒果 2026 中秋聯名禮盒預購系統 | 用真材實料 送真誠心意',
  description: '妮邦廚房 Ｘ 歐伯芒果首次合作推出中秋聯名禮盒！內含法式杏仁瓦片、芒果恰克、蜂蜜燕麥餅乾。享早鳥優惠 1~4 盒 9 折 ($622)、5~8 盒 85 折 ($588)，滿 $5,000 即享全台 7-11 冷凍免運！',
  keywords: ['妮邦廚房', '歐伯芒果', '中秋禮盒', '中秋預購', '芒果恰克', '法式杏仁瓦片', '蜂蜜燕麥餅乾', '7-11冷凍配送'],
  openGraph: {
    title: '妮邦廚房 Ｘ 歐伯芒果 中秋聯名禮盒預購系統',
    description: '用真材實料，送出一份真誠的心意。甜點師細緻手藝 Ｘ 官田在地馥郁芒果巧克力。',
    type: 'website',
    images: ['/images/DSC03291.JPG'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="scroll-smooth">
      <body className="antialiased selection:bg-amber-200 selection:text-amber-900">
        {children}
      </body>
    </html>
  );
}

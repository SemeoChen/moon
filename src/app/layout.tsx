import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://nibang-moon.vercel.app'),
  title: '妮邦廚房 Ｘ 歐伯芒果 產品訂購系統 | 主打「芒果恰克」7-11冷凍交貨便',
  description:
    '妮邦廚房 Ｘ 歐伯芒果產品訂購系統！目前主打「芒果恰克」濃厚絲滑黑巧克力遇上陽光熟成Q彈芒果乾，限時特價 $250/盒（原價 $280），滿 $3,000（12盒）享全台 7-11 冷凍交貨便免運費！',
  keywords: [
    '妮邦廚房',
    '歐伯芒果',
    '芒果恰克',
    '芒果巧克力',
    '芒果乾',
    '新鮮芒果',
    '裱花蛋糕',
    '翻糖蛋糕',
    '戚風蛋糕',
    '巴斯克乳酪蛋糕',
    '7-11冷凍交貨便',
  ],
  openGraph: {
    title: '妮邦廚房 Ｘ 歐伯芒果 產品訂購系統',
    description:
      '當濃厚絲滑的黑巧克力，遇上陽光熟成、酸甜Q彈的芒果乾，這就是讓人一吃就上癮的「芒果恰克」！',
    type: 'website',
    images: ['/images/choker/DSC03515.JPG'],
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

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCw } from 'lucide-react';

interface CaptchaProps {
  onCodeChange: (code: string) => void;
}

export const Captcha: React.FC<CaptchaProps> = ({ onCodeChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [captchaText, setCaptchaText] = useState<string>('');

  const generateCode = useCallback(() => {
    // 產生4位數字/大寫英文字母組合 (排除容易混淆的 0, O, 1, I, l)
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }, []);

  const drawCaptcha = useCallback((code: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 清空畫布並繪製淡黃/月餅金色系的質感背景
    ctx.fillStyle = '#FFFDF5';
    ctx.fillRect(0, 0, width, height);

    // 畫隨機干擾背景點
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 150 + 100)}, ${Math.floor(Math.random() * 100 + 50)}, 0, ${Math.random() * 0.2 + 0.1})`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2 + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // 畫隨機干擾線
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 180 + 50)}, ${Math.floor(Math.random() * 100 + 20)}, 20, 0.35)`;
      ctx.lineWidth = Math.random() * 1.5 + 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height
      );
      ctx.stroke();
    }

    // 繪製 4 位驗證碼字元 (加隨機旋轉、傾斜與顏色)
    ctx.font = 'bold 26px "Segoe UI", Arial, sans-serif';
    ctx.textBaseline = 'middle';

    const colors = ['#803612', '#9e430d', '#1b4d3e', '#c5610d', '#692d13'];

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const x = 16 + i * 26;
      const y = height / 2 + (Math.random() * 4 - 2);
      const angle = (Math.random() * 30 - 15) * (Math.PI / 180);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }, []);

  const refreshCaptcha = useCallback(() => {
    const newCode = generateCode();
    setCaptchaText(newCode);
    onCodeChange(newCode);
    drawCaptcha(newCode);
  }, [generateCode, drawCaptcha, onCodeChange]);

  useEffect(() => {
    refreshCaptcha();
  }, []);

  return (
    <div className="flex items-center space-x-3">
      <div className="relative border-2 border-amber-200 rounded-lg overflow-hidden shadow-inner bg-amber-50/50 p-1">
        <canvas
          ref={canvasRef}
          width={125}
          height={42}
          className="block cursor-pointer select-none rounded"
          onClick={refreshCaptcha}
          title="點擊更換圖形驗證碼"
        />
      </div>
      <button
        type="button"
        onClick={refreshCaptcha}
        className="flex items-center space-x-1 text-xs text-amber-800 hover:text-amber-600 bg-amber-100/60 hover:bg-amber-200/80 px-2.5 py-2 rounded-md transition duration-150 font-medium"
        title="重新產生驗證碼"
      >
        <RotateCw className="w-3.5 h-3.5" />
        <span>換一張</span>
      </button>
    </div>
  );
};

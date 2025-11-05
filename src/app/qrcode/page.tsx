"use client";
import StyledQr, { StyledQrHandle } from "../components/StyledQr";
import { useRef } from "react";

export default function QrCodePage() {
  const qrRef = useRef<StyledQrHandle>(null);
  return (
    <div dir="rtl" className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <StyledQr ref={qrRef} data="http://fastfood-salivan.ir/" size={256} />
        <div className="text-sm text-muted-foreground">اسکن کنید تا منو را ببینید</div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <a
            href="/qr/salivan-qr.svg"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-white text-black border border-zinc-200"
          >
            مشاهده نسخه SVG
          </a>
          <button
            onClick={() => qrRef.current?.downloadSvg("salivan-qr", 2000)}
            className="px-4 py-2 rounded-lg bg-orange-600 text-white"
          >
            دانلود با کیفیت (SVG)
          </button>
        </div>
      </div>
    </div>
  );
}

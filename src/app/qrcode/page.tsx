"use client";
import StyledQr from "../components/StyledQr";

export default function QrCodePage() {
  return (
    <div dir="rtl" className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <StyledQr data="http://fastfood-salivan.ir/" size={256} />
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
          <a
            href="/qr/salivan-qr.svg"
            download
            className="px-4 py-2 rounded-lg bg-orange-600 text-white"
          >
            دانلود با کیفیت (SVG)
          </a>
        </div>
      </div>
    </div>
  );
}

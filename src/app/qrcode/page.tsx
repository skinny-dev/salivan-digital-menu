"use client";
import StyledQr from "../components/StyledQr";

export default function QrCodePage() {
  return (
    <div dir="rtl" className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <StyledQr data="http://fastfood-salivan.ir/" size={256} />
        <div className="text-sm text-muted-foreground">اسکن کنید تا منو را ببینید</div>
      </div>
    </div>
  );
}

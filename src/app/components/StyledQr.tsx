"use client";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import QRCodeStyling from "qr-code-styling";

type Props = {
  data?: string;
  size?: number;
};

export type StyledQrHandle = {
  downloadSvg: (name?: string, pxSize?: number) => void;
};

function StyledQrInner(
  { data = "http://fastfood-salivan.ir/", size = 240 }: Props,
  handleRef: React.Ref<StyledQrHandle>
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    const qr = new QRCodeStyling({
      width: size,
      height: size,
      data,
      qrOptions: { errorCorrectionLevel: "Q" },
      margin: 12, // ~4-6 modules
      backgroundOptions: { color: "#ffffff" },
      dotsOptions: {
        type: "extra-rounded",
        gradient: {
          type: "linear",
          rotation: 0.85,
          colorStops: [
            { offset: 0, color: "#d73f19" },
            { offset: 1, color: "#d77519" },
          ],
        },
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: "#000000",
      },
      // Ensure proper finder pattern (dark-light-dark)
      cornersDotOptions: {
        type: "dot",
        color: "#000000",
      },
    });

    qrRef.current = qr;
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      qr.append(containerRef.current);
    }

    return () => {
      // no-op cleanup; canvas will be garbage collected
    };
  }, [data, size]);

  useImperativeHandle(handleRef, () => ({
    downloadSvg: (name = "salivan-qr", pxSize = 2000) => {
      const qr = qrRef.current;
      if (!qr) return;
      // enlarge for export, then revert
      qr.update({ width: pxSize, height: pxSize });
      qr.download({ name, extension: "svg" });
      // revert to display size
      setTimeout(() => qr.update({ width: size, height: size }), 0);
    },
  }));

  return (
    <div className="inline-block rounded-2xl bg-white p-3 shadow-sm">
  <div ref={containerRef} />
    </div>
  );
}

const StyledQr = forwardRef(StyledQrInner);
export default StyledQr;

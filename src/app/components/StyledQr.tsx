"use client";
import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

type Props = {
  data?: string;
  size?: number;
};

export default function StyledQr({ data = "http://fastfood-salivan.ir/", size = 240 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

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

    if (ref.current) {
      ref.current.innerHTML = "";
      qr.append(ref.current);
    }

    return () => {
      // no-op cleanup; canvas will be garbage collected
    };
  }, [data, size]);

  return (
    <div className="inline-block rounded-2xl bg-white p-3 shadow-sm">
      <div ref={ref} />
    </div>
  );
}

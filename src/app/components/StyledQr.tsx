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
      type: "svg",
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
      // Export exactly what is rendered by cloning the SVG node from the DOM
      const host = containerRef.current;
      if (!host) return;
      const svg = host.querySelector('svg');
      if (!svg) return;

      const cloned = svg.cloneNode(true) as SVGElement;
      // Force export size while keeping viewBox for vector fidelity
      cloned.setAttribute('width', String(pxSize));
      cloned.setAttribute('height', String(pxSize));

      const source = new XMLSerializer().serializeToString(cloned);
      const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.svg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
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

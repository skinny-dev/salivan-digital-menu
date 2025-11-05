declare module "qr-code-styling" {
  export interface QRCodeStylingOptions {
    width?: number;
    height?: number;
    data: string;
    margin?: number;
    qrOptions?: { errorCorrectionLevel?: "L" | "M" | "Q" | "H" };
    backgroundOptions?: { color?: string };
    dotsOptions?: {
      type?: "square" | "dots" | "rounded" | "extra-rounded";
      color?: string;
      gradient?: {
        type?: "linear" | "radial";
        rotation?: number;
        colorStops: { offset: number; color: string }[];
      };
    };
    cornersSquareOptions?: {
      type?: "square" | "dot" | "extra-rounded" | "rounded";
      color?: string;
    };
    cornersDotOptions?: {
      type?: "square" | "dot" | "rounded";
      color?: string;
    };
    image?: string;
    imageOptions?: {
      hideBackgroundDots?: boolean;
      imageSize?: number;
      margin?: number;
      crossOrigin?: string;
    };
  }

  export default class QRCodeStyling {
    constructor(options: QRCodeStylingOptions);
    append(element: HTMLElement): void;
    update(options: Partial<QRCodeStylingOptions>): void;
    download(options?: { name?: string; extension?: "png" | "jpeg" | "webp" | "svg" }): void;
    getRawData(extension?: "png" | "jpeg" | "webp" | "svg"): Promise<Blob>;
  }
}

"use client";

import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, X, Check } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (filename: string) => void;
  placeholder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  placeholder = "نام فایل تصویر",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onChange(data.filename);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 2000);
      } else {
        const error = await response.json();
        alert(`خطا در آپلود: ${error.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("خطا در آپلود تصویر");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-2">تصویر</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400 outline-none"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={uploading}
          className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-colors ${
            uploading
              ? "bg-zinc-600 cursor-not-allowed"
              : uploadSuccess
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : uploadSuccess ? (
            <Check size={16} />
          ) : (
            <Upload size={16} />
          )}
          <span className="text-sm">
            {uploading ? "آپلود..." : uploadSuccess ? "آپلود شد" : "آپلود"}
          </span>
        </button>
      </div>

      {/* Preview */}
      {value && (
        <div className="mt-3">
          <div className="w-24 h-24 bg-zinc-700 rounded-lg overflow-hidden">
            <img
              src={`/images/${value}`}
              alt="پیش‌نمایش"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-zinc-400">
        فرمت‌های مجاز: JPEG, PNG, GIF, WebP | حداکثر حجم: 5MB
      </p>
    </div>
  );
}
